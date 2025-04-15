import constants from '../utils/constants.js';
import StationsRepository from '../repository/stations-repository.js';
import GenresRepository from '../repository/genres-repository.js';
import axios from 'axios';
import { get_available_server } from '../utils/url-resolver.js';

const { CDS_ENTITIES } = constants;
const BASE_API_URL = (await get_available_server(5)) + '/json';

export default class StationsController {
  constructor(db, cdsEntities) {
    this.db = db;
    this.cdsEntities = cdsEntities;
    this.stationsRepository = new StationsRepository(db);
    this.genresRepository = new GenresRepository(db);
  }

  async onGetGenres(limit, offset) {
    const Genres = this.cdsEntities[CDS_ENTITIES.Genres];
    let genres = await this.genresRepository.getGenres(Genres, limit, offset);
    
    if (!genres || genres.length === 0) {
      genres = await this._fetchGenresFromAPI(limit, offset);
    }
    return genres;
  }
  async _fetchGenresFromAPI(limit, offset) {
    const Genres = this.cdsEntities[CDS_ENTITIES.Genres];
    try {
      const response = await axios.get(`${BASE_API_URL}/tags`);
      let genres = response.data
        .map((tag) => ({
          name: tag.name.replace(/^#|\.|-/, '').trim(),
        }))
        .filter((tag) => /^(?=.*[A-Za-z])[A-Za-z ]{4,}$/.test(tag.name));

      genres.sort((a, b) => a.name.localeCompare(b.name));
      await this.genresRepository.addGenres(Genres, genres);
      genres = genres.slice(offset, offset + limit);
      return genres;
    } catch (error) {
      console.log(`Error fetching genres: ${error}`);
    }
  }
  async onGetStations(searchTerm) {
    const StationGenres = this.cdsEntities[CDS_ENTITIES.StationGenres];
    try {
      let stations = await this.stationsRepository.getStationsByGenre(
        StationGenres,
        searchTerm
      );
      if (stations && stations.length !== 0) {
        return stations;
      }
      stations = await this._fetchStationsFromAPI(searchTerm);

      return stations;
    } catch (error) {
      console.log(`Error fetching stations: ${error}`);
    }
  }

  async _fetchStationsFromAPI(searchTerm) {
    let stations = [];
    if (searchTerm === '') {
      await this.onGetGenres(50, 0);
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
            ID: station.stationuuid,
            name: station.name,
            url: station.url,
            url_resolved: station.url_resolved,
            image_url: station.favicon,
            country: station.country,
            clickcount: station.clickcount,
            clicktrend: station.clicktrend,
          };
        });
      
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
            ID: station.stationuuid,
            name: station.name,
            url: station.url,
            url_resolved: station.url_resolved,
            image_url: station.favicon,
            country: station.country,
            clickcount: station.clickcount,
            clicktrend: station.clicktrend,
          };
        });
      
    }
    if (stations && stations.length !== 0) {
      const station_ids = stations.map((station) => station.ID);
      await this._processStations(searchTerm, stations, station_ids);
    }
    return stations;
  }

  async _processStations(searchTerm, stations, station_ids) {
    const Stations = this.cdsEntities[CDS_ENTITIES.Stations];
    const StationGenres = this.cdsEntities[CDS_ENTITIES.StationGenres];
    const Genres = this.cdsEntities[CDS_ENTITIES.Genres];
    await this.stationsRepository.addStations(Stations, stations);
    await this.genresRepository.addGenres(Genres, {name: searchTerm});
    await Promise.all(station_ids.map((id) => {
      this.genresRepository.addStationGenre(StationGenres, {station_ID: id, genre_name: searchTerm})
    }));
  }
}
