import StationsController from "../srv/controller/stations-service.controller.js";

module.exports = async function StationsService() {
  const db = await cds.connect.to("db");
  const stationsController = new StationsController(db, db.entities);
  this.on("getGenres", async (req) => {
    try {
      await stationsController.onGetGenres();
    } catch (error) {
      req.reject(error);
    }
  });
  this.on("getStations", async (req) => {
    const term = req.data.genre || "";

    try {
      await stationsController.onGetStations(term);
    } catch (error) {
      req.reject(`Error fetching radios for: ${term}`);
    }
  });
};
