export default class StationsRepository {
  constructor(db) {
    this.db = db;
  }
  async insertGenres(entity, genres) {
    await this.db.run(INSERT.into(entity).entries(genres));
  }
  async getGenres(entity, columns) {
    return this.db.run(SELECT.from(entity).columns(columns).orderBy("NAME"));
  }

  async getStation(entity, stationuuid) {
    return this.db.run(
      await SELECT.one.from(entity).where({ ID: stationuuid })
    );
  }
  async addStation(entity, stationuuid, name, url_resolved, country) {
    await this.db.run(
      INSERT.into(entity)
        .columns("ID", "name", "url_resolved", "country")
        .values(stationuuid, name, url_resolved, country)
    );
  }

  async getSavedStation(entity, user_ID, stationuuid) {
    if (stationuuid) {
      return this.db.run(
        SELECT.one
          .from(entity)
          .where({ user_ID: user_ID, station_ID: stationuuid })
      );
    }
    return this.db.run(SELECT.one.from(entity).where({ user_ID: user_ID }));
  }

  async addSavedStation(entity, id, user_ID, stationuuid) {
    await this.db.run(
      INSERT.into(entity)
        .columns("ID", "user_ID", "station_ID")
        .values(id, user_ID, stationuuid)
    );
  }
}
