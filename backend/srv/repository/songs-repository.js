export default class SongsRepository {
  constructor(db) {
    this.db = db;
  }

  async addSong(entity, song, user_ID) {
    await this.db.run(INSERT.into(entity).entries({ ...song, user_ID: user_ID }));
  }

  async getSongByTitle(entity, title) {
    return this.db.run(SELECT.one.from(entity).where({ title: title }));
  }

  async syncUserSongs(entity, user_ID, song_ID) {
    await this.db.run(INSERT.into(entity).entries({ user_ID: user_ID, song_ID: song_ID }));
  }

  async getUserSongs(entity, user_ID) {
    return this.db.run(SELECT.from(entity).where({ user_ID: user_ID }));
  }

  // async addSongMetadata(entity, song_ID, song_metadata) {
  //   await this.db.run(
  //     INSERT.into(entity).entries({ song_ID: song_ID, user_ID: user_ID })
  //   );
  // }

  // async getSongByUser(entity, user_ID) {
  //   return await this.db.run(SELECT.from(entity).where({ user_ID: user_ID }));
  // } 
  // async addUserSong(entity, user_ID, song_ID) {
  //   await this.db.run(
  //     INSERT.into(entity).entries({ user_ID: user_ID, song_ID: song_ID })
  //   );
  // }
}
