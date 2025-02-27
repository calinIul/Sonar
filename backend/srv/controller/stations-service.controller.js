import constants from "../utils/constants";
import StationsRepository from "../repository/stations-repository";

const axios = require("axios");
const { CDS_ENTITIES, CACHE_DURATION, BASE_API_URL } = constants;

export default class StationsController {
  constructor(db, cdsEntities) {
    this.db = db;
    this.cdsEntities = cdsEntities;
    this.stationsRepository = new StationsRepository(db);
  }
  async onGetGenres(offset, limit) {
    const Genres = this.cdsEntities[CDS_ENTITIES.Genres];
    const existingGenres = await this.stationsRepository.getGenres(Genres, [
      "NAME",
      "MODIFIEDAT",
    ]);

    const staleGenres = existingGenres.filter(
      (genre) =>
        Date.now() - new Date(genre.modifiedAt).getTime() > CACHE_DURATION
    );

    let paginatedGenres;

    if (existingGenres.length && !staleGenres.length) {
      paginatedGenres = existingGenres
        .slice(offset, offset + limit)
        .map((genre) => genre.name);
    } else {
      const response = await axios.get(`${BASE_API_URL}/tags`);
      const genres = response.data
        .map((tag) => tag.name)
        .filter((tag) => /^(?=.*[A-Za-z])[A-Za-z ]{4,}$/.test(tag));

      await this.stationsRepository.insertGenres(Genres, genres);

      paginatedGenres = genres.slice(offset, offset + limit);
    }

    return paginatedGenres;
  }

  async onGetStations(term) {
    if (term === "") {
      await this.onGetGenres();
    }

    // fetch by country
    else if (/^[A-Z][a-z]*$/.test(term)) {
      const response = await axios.get(
        `${BASE_API_URL}/stations/bycountry/${term}`
      );
      const httpsStations = response.data.filter(
        (station) =>
          station.url_resolved &&
          station.url_resolved.toLowerCase().startsWith("https")
      );

      if (httpsStations.length === 0) {
        return [];
      } else {
        return httpsStations;
      }
    }

    // fetch by tag
    else {
      const response = await axios.get(
        `${BASE_API_URL}/stations/bytag/${term}`
      );
      const httpsStations = response.data.filter(
        (station) =>
          station.url_resolved &&
          station.url_resolved.toLowerCase().startsWith("https")
      );

      if (httpsStations.length === 0) {
        return [];
      } else {
        return httpsStations;
      }
    }
  }
}
