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
    //const song_id = uuid();

    //1. Generate fingerprint and get song data
    const fingerprint = await this._generateFingerprint(streamUrl);

    //2.a Generate sample and try to get song data
    let song = this._generateSample(streamUrl);

    //3. Check for song data
    if (song.artist && song.title) {
      //4. Get metadata for the song
      const song_metadata = await this._getSongMetadata(song);
      song_metadata.fingerprint = fingerprint;
      //5. Process the song
      await this._processSong(Songs, song, song_metadata, user_ID);
      //6. Exit
      return null;
    }

    //2.b Fallback - Call the audio recognition service, get the song data
    result = await this._callAudioRecAPI(streamUrl);
    // song = result?.status?.msg === "Success" ?
    //   {
    //     result.metadata.music.
    //   }
    
    //3.b
    if (song) {
      //4.b Get metadata for the song
      const song_metadata = await this._getSongMetadata(song);
      const song = {
        title: data.music[0].title,
        artist: data.music[0].artists[0].name,
      };
      //5. b
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
    //3. Sync UserSongs
    await this.songsRepository.syncUserSongs(entity, user_ID, song_ID);
    //4. Add song metadata
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
