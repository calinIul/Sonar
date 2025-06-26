export default class GenresRepository {
  constructor(db) {
    this.db = db;
  }
  // TO DO: test out fuzzy search - deploy BTP
  async genreSearch(entity, genre) {
    return this.db.run(
      `SELECT *, SCORE() FROM ${entity} WHERE CONTAINS(DESCR, \'"${genre}"\', FUZZY(0.7, \'similarCalculationMode=searchCompare\'))`
    );
  }
  async getGenres(entity, limit, offset) {
    return this.db.run(SELECT.from(entity).limit(limit, offset));
  }
  async addGenres(entity, genres) {
    await this.db.run(UPSERT.into(entity).entries(genres));
  }

  async addStationGenre(entity, row) {
    await this.db.run(UPSERT.into(entity).entries(row));
  }
}
