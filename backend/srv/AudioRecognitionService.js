import { AudioController } from "../controller/ar-service.controller";

const cds = require("@sap/cds");

module.exports = async function UsersService() {
  const db = await cds.connect.to("db");
  const audioController = new AudioController(db, db.entities);

  this.on("getSong", async (req) => {
    const { streamUrl, user_ID } = req.data;
    await audioController.onGetSong(streamUrl, user_ID);
  });
};
