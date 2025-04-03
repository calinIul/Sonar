import AudioController from "./controller/ar-service.controller.js";
import cds from '@sap/cds'

export default async function AudioRecognitionService() {
  const db = await cds.connect.to("db");
  const audioController = new AudioController(db, db.entities);

  this.on("findSong", async (req) => {
    const { streamUrl, user_ID } = req.data;
    return audioController.onFindSong(streamUrl, user_ID);
  });
};
