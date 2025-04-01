import StationsController from "../srv/controller/stations-service.controller.js";
import axios from "axios";


module.exports = async function StationsService() {
  const db = await cds.connect.to("db");
  const stationsController = new StationsController(db, db.entities);
  this.on("GET", "Genres", async (req) => {
    try {
      const {limit = 50, offset = 0} = req.data;
      await stationsController.onGetGenres(limit, offset);
    } catch (error) {
      req.reject(`Error fetching genres: ${error}`);
    }
  });
  this.on("getStations", async (req) => {
    const term = req.data.genre || "";

    try {
      await stationsController.onGetStations(term);
    } catch (error) {
      req.reject(`Error fetching radios: ${error}`);
    }
  });
};
