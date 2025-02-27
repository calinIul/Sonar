import constants from "../utils/constants";
import UserRepository from "../repository/users-repository";
import StationsRepository from "../repository/stations-repository";
import SongsRepository from "../repository/songs-repository";
const { uuid } = cds.utils;


const { CDS_ENTITIES, AUDIO_URL } = constants;

export default class AudioController {
  constructor(db, cdsEntities) {
    this.db = db;
    this.cdsEntities = cdsEntities;
    this.stationRepository = new StationsRepository(db);
    this.songsRepository = new SongsRepository(db);
  }
  

  async onGetSong(streamUrl, user_ID) {
    const Songs = this.cdsEntities[CDS_ENTITIES.Songs];
    const SavedSongs = this.cdsEntities[CDS_ENTITIES.SavedSongs];
    const song_id = uuid();
    try {
      const res = await fetch(AUDIO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamUrl: streamUrl }),
      });
      const response = await res.json();
      const data = response?.data?.metadata || response?.metadata;
      if (data) {
        const song = {
          title: data.music[0].title,
          artist: data.music[0].artists[0].name,
        };

        await this.songsRepository.addSong(
          Songs,
          song_id,
          song.title,
          data.timestamp_utc,
          song.artist,
          user_ID
        );
        await this.userRepository.addSavedSong(SavedSongs, user_ID, song_id);
      }

      return null;
    } catch (error) {
      req.reject("Failed to identify song");
    }
  }
}
