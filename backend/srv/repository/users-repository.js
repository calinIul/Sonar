export default class UserRepository {
  constructor(db) {
    this.db = db;
  }
  // async getUserStations(entity, user_ID) {
  //   return this.db.run(`SELECT * 
  //           FROM StationsService_Stations AS st  
  //           JOIN StationsService_SavedStations AS ss 
  //           ON st.ID = ss.station_ID 
  //           WHERE ss.user_ID = '${user_ID}';
  //       `);
  // }

  async getStationByUser(link, user_ID) {
    return this.db.run(
      SELECT.from(link, (userStation) => {
        userStation.station((s) => {
          s`.*`, s.ID;
        });
      }).where({ user: user_ID})
    );
  }

  async addUser(entity, user) {
    await this.db.run(INSERT.into(entity).entries(user));
  }

  async getUser(entity, email) {
    return this.db.run(SELECT.one.from(entity).where({ email: email }));
  }

  async removeUserStation(entity, user_ID, stationuuid) {
    await this.db.run(
      DELETE.one
        .from(entity)
        .where({ user_ID: user_ID, station_ID: stationuuid })
    );
  }

  async addSong(entity, id, title, timestamp, artist, user_ID) {
    await this.db.run(
      INSERT.into(entity)
        .columns('title', 'ID', 'createdAt', 'artist', 'user_ID')
        .values(title, id, timestamp, artist, user_ID)
    );
  }
  async addSavedSong(entity, user_ID, song_ID) {
    await this.db.run(
      INSERT.into(entity).entries({ user_ID: user_ID, song_ID: song_ID })
    );
  }
}
