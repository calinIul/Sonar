import constants from '../utils/constants.js';
import StationsRepository from '../repository/stations-repository.js';
import GenresRepository from '../repository/genres-repository.js';
import axios from 'axios';
import { get_available_server } from '../utils/url-resolver.js';

const { CDS_ENTITIES } = constants;
const BASE_API_URL = await get_available_server();

export default class StationsController {
  constructor(db, cdsEntities) {
    this.db = db;
    this.cdsEntities = cdsEntities;
    this.stationsRepository = new StationsRepository(db);
    this.genresRepository = new GenresRepository(db);
  }
  async onGetStations(searchTerm) {
    const Stations = this.cdsEntities[CDS_ENTITIES.Stations];
    const StationGenres = this.cdsEntities[CDS_ENTITIES.StationGenres];
    let stations = await this.stationsRepository.getStationsByGenre(
      Stations,
      StationGenres,
      searchTerm
    );
    if (stations && stations.length !== 0) {
      return stations;
    }
    stations = await this._fetchStationsFromAPI(searchTerm);
    return stations;
  }
  async onGetGenres(limit, offset) {
    let genres = await this.genresRepository.getGenres(limit, offset);
    if (!genres || genres.length === 0) {
      genres = await this._fetchGenresFromAPI(limit, offset);
    }
    return {
      genres,
      offset: offset+limit,
    };
  }
  async _fetchGenresFromAPI(limit, offset) {
    const Genres = this.cdsEntities[CDS_ENTITIES.Genres];
    try {
      const response = await axios.get(`${BASE_API_URL}/tags`);
      let genres = response.data
        .map((tag) => tag.name.replace(/^#|\.|-$/), '')
        .filter((tag) => /^(?=.*[A-Za-z])[A-Za-z ]{4,}$/.test(tag));

      await this.genresRepository.insertGenres(Genres, genres);
      genres = genres.slice(offset, offset + limit);
      return genres;
    } catch (error) {
      console.log(`Error fetching genres: ${error}`);
    }
  }

  async _fetchStationsFromAPI(searchTerm) {
    const Stations = this.cdsEntities[CDS_ENTITIES.Stations];
    let stations = [];
    if (searchTerm === '') {
      await this.onGetGenres(limit, offset=0);
      return;
    }
    // fetch by country
    else if (/^[A-Z][a-z]*$/.test(searchTerm)) {
      const response = await axios.get(
        `${BASE_API_URL}/stations/bycountry/${searchTerm}`
      );
      stations = response.data
        .filter(
          (station) =>
            station.url_resolved &&
            station.url_resolved.toLowerCase().startsWith('https')
        )
        .map((station) => {
          return {
            name: station.name,
            url: station.url,
            url_resolved: station.url_resolved,
            image_url: station.image_url,
            country: station.country,
            clickcount: station.clickcount,
            clicktrend: station.clicktrend,
          };
        });
      if (stations.length === 0) {
        await this.stationsRepository.addStations(Stations, stations);
      }
    }

    // fetch by tag
    else {
      const response = await axios.get(
        `${BASE_API_URL}/stations/bytag/${searchTerm}`
      );
      stations = response.data
        .filter(
          (station) =>
            station.url_resolved &&
            station.url_resolved.toLowerCase().startsWith('https')
        )
        .map((station) => {
          return {
            name: station.name,
            url: station.url,
            url_resolved: station.url_resolved,
            image_url: station.image_url,
            country: station.country,
            clickcount: station.clickcount,
            clicktrend: station.clicktrend,
          };
        });
      if (stations.length === 0) {
        await this.stationsRepository.addStations(Stations, stations);
      }
    }
    return stations;
  }
}
