export default class StationsRepository {
  constructor(db) {
    this.db = db;
  }
  async insertGenres(entity, genres) {
    return this.db.run(INSERT.into(entity).entries(genres));
  }
  async getGenres(entity, columns) {
    return this.db.run(SELECT.from(entity).columns(columns).orderBy("NAME"));
  }
}
