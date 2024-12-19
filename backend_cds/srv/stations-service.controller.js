import constants from "./utils/constants";
import StationsRepository from "./repository/stations-repository";

const axios = require("axios");
const BASE_API_URL = "https://de1.api.radio-browser.info/json";
const { CDS_ENTITIES, CACHE_DURATION } = constants;

export default class StationsController {
  constructor(db, cdsEntities) {
    this.db = db;
    this.cdsEntities = cdsEntities;
    this.stationsRepository = new StationsRepository(db);
  }
  async onGetGenres(offset, limit) {
    const Genres = this.cdsEntities[CDS_ENTITIES.Genres];
    const existingGenres = this.stationsRepository.getGenres(Genres, [
      "NAME",
      "MODIFIEDAT",
    ]);
    if (!existingGenres.length) {
      await this.stationsRepository.insertGenres(Genres, genres);
    }
    for (let genre of existingGenres) {
      {
        const response = await axios.get(`${BASE_API_URL}/tags`);
        const genres = response.data
          .map((tag) => tag.name)
          .filter((tag) => /^(?=.*[A-Za-z])[A-Za-z ]{4,}$/.test(tag));
        await this.stationsRepository.insertGenres(Genres, genres);
      }
      const paginatedGenres = cachedGenres.slice(offset, offset + limit);
      return paginatedGenres;
    }
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
