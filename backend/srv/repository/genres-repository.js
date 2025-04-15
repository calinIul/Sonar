export default class GenresRepository {
    constructor(db) {
      this.db = db;
    }
    async addGenres(entity, genres) {
      await this.db.run(UPSERT.into(entity).entries(genres));
    }
    async getGenres(entity, limit, offset) {
      return this.db.run(SELECT.from(entity).limit(limit, offset));
    }
    async addStationGenre(entity, row) {
      await this.db.run(UPSERT.into(entity).entries(row));
    }
    
  }
  