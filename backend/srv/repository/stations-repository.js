export default class StationsRepository {
  constructor(db) {
    this.db = db;
  }

  async getStationById(entity, stationuuid) {
    return this.db.run(
       SELECT.one.from(entity).where({ ID: stationuuid })
    );
  }
  async getStationsByGenre(link, genre) {
    return this.db.run(
      SELECT.from(link, (sGenre) => {
        sGenre.station((s) => {
          s`.*`, s.ID;
        });
      }).where({ genre: genre })
    );
  }
  async getStationsByUser(link, user_ID) {
    return this.db.run(
      SELECT.from(link, (userStation) => {
        userStation.station((s) => {
          s`.*`, s.ID;
        });
      }).where({ user: user_ID })
    );
  }

  async getStationByUser(link, user_ID, station_ID) {
    return this.db.run(
      SELECT.from(link, (userStation) => {
        userStation.station((s) => {
          s`.*`, s.ID;
        });
      }).where({ user: user_ID, station: station_ID})
    );
  }

  async addStations(entity, stations) {
    await this.db.run(UPSERT.into(entity).entries(stations));
  }

  async addStation(entity, station) {
    await this.db.run(INSERT.into(entity).entries(station))
  }

  async addSavedStation(entity, user_ID, stationuuid) {
    await this.db.run(
      UPSERT.into(entity).entries({ user_ID: user_ID, station_ID: stationuuid })
    );
  }
}
