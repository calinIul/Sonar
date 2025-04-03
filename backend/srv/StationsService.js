import StationsController from './controller/stations-service.controller.js';
import axios from 'axios';

export default async (srv) => {
  const db = await cds.connect.to('db');
  const stationsController = new StationsController(db, db.entities);
  srv.on('getGenres', async (req) => {
    try {
      const { limit = 50, offset = 0 } = req.data;
      return stationsController.onGetGenres(limit, offset);
    } catch (error) {
      req.reject(`Error fetching genres: ${error}`);
    }
  });

  srv.on('getStations', async (req) => {
    const term = req.data.genre || '';

    try {
      return stationsController.onGetStations(term);
    } catch (error) {
      req.reject(`Error fetching radios: ${error}`);
    }
  });
};
