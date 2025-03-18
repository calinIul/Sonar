import constants from '../utils/constants';
import UserRepository from '../repository/users-repository';
import StationsRepository from '../repository/stations-repository';
import SongsRepository from '../repository/songs-repository';
const { uuid } = cds.utils;

const { CDS_ENTITIES, AUDIO_URL, METADATA_TOKEN } = constants;

export default class AudioController {
  constructor(db, cdsEntities) {
    this.db = db;
    this.cdsEntities = cdsEntities;
    this.stationRepository = new StationsRepository(db);
    this.songsRepository = new SongsRepository(db);
  }

  async onFindSong(streamUrl, user_ID) {
    const Songs = this.cdsEntities[CDS_ENTITIES.Songs];
    const SongsMetadata = this.cdsEntities[CDS_ENTITIES.SongsMetadata];
    const UserSongs = this.cdsEntities[CDS_ENTITIES.UserSongs];
    const song_id = uuid();

    //1. Generate fingerprint and get song data
    const fingerprint = await this._generateFingerprint(streamUrl);

    //2.a Generate sample and try to get song data
    let song = this._generateSample(streamUrl);

    //3. Check for song data
    if (song.artist && song.title) {
      //4. Get metadata for the song
      const song_metadata = await this._getSongMetadata(song);
      song.id = song_id;
      song.genres = song_metadata.genres.map((genre) => genre.name);
      song_metadata.fingerprint = fingerprint;
      //5. Process the song
      await this._processSong(Songs, song, song_metadata, user_ID);
      //6. Todo - Generate embeddnings

      //7. End process
      return null;
    }

    //2.b Fallback - Call the audio recognition service, get the song data
    const result = await this._callAudioRecAPI(streamUrl);
    const body = result?.status?.msg === "Success" ? result.metadata.music[0] : false;
    
    //3.b
    if (body) {
      song =
      { ID: song_id,
        title: body.title,
        artist: body.artists[0].name,
      }
      //4.b Get metadata from the result object
      const song_metadata = {
        song_ID: song_id,
        duration: body.duration_ms,
        album: body.album.name,
        cover: body.external_metadata?.spotify ? body.external_metadata.spotify[0].album.cover : null,
        genres: body.genres.map((genre) => genre.name),
        url: body.external_metadata?.spotify ? body.external_metadata.spotify[0].link : null,
      }
      song_metadata.fingerprint = fingerprint;

      //5. b Process the song
      await this._processSong(Songs, song, song_metadata, user_ID);
    }

    return null;
  }
  async _processSong(entity, song, metadata, user_ID) {
    //1. Add song to the database
    await this.songsRepository.addSong(entity, song, user_ID);
    //2. Get the song ID
    const song_ID = await this.songsRepository.getSongByTitle(
      entity,
      song.title
    );
    //3. Add genres
    await this.songsRepository.addGenres(entity, song_ID, song.genres);
    //4. Sync UserSongs
    const userSong = {
      user_ID: user_ID,
      song_ID: song_ID,
    }
    await this.songsRepository.syncUserSongs(entity, userSong);
    //5. Add song metadata
    await this.songsRepository.addSongMetadata(
      SongsMetadata,
      song_ID,
      metadata
    );
  }

  async _getSongMetadata(song) {
    let song_metadata = null;
    try {
      const url = `${METADATA_URL}/tracks?query=${encodeURIComponent(
        song.artist + ' ' +
        song.title
      )}&format=text`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + METADATA_TOKEN,
        },
      });

      const response = await res.json();
      song_metadata = {
        duration: response.data.duration_ms,
        album: response.data.album.name,
        cover: response.data.album.covers.small,
        genres: response.data.genres,
        url: response.data.external_metadata?.spotify?.link,
      };

      
    } catch (error) {
      console.log('Error fetching metadata:', error);
      
    }
    return song_metadata;
  }

  async _callAudioRecAPI(streamUrl) {
    try {
      const res = await fetch(AUDIO_URL + '/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streamUrl: streamUrl }),
      });
      const response = await res.json();
      song = response?.data?.metadata || response?.metadata;
      return song || null;
    } catch (error) {
      return null;
    }
  }

  async _generateSample(streamUrl) {
    try {
      await fetch(AUDIO_URL + '/sample', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streamUrl: streamUrl }),
      });
    } catch (error) {
      return null;
    }
  }

  async _generateFingerprint(streamUrl) {
    try {
      const res = await fetch(AUDIO_URL + '/fingerprint', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streamUrl: streamUrl }),
      });
      const response = await res.json();
      return response?.fingerprint || null;
    } catch (error) {
      return null;
    }
  }
}
