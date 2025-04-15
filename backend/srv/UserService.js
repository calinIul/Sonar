import UserController from "./controller/user-service.controller.js";


export default async function UsersService() {
  const db = await cds.connect.to("db");
  const userController = new UserController(db, db.entities);

  this.on("getUserStations", async (req) => {
    const { user_ID } = req.data;
    const stations = await userController.onGetUserStations(user_ID);

    return stations;
  });

  this.on("removeStation", async (req) => {
    const { user_ID, stationuuid } = req.data;
    await userController.onRemoveStation(user_ID, stationuuid);
  });

  this.on("saveStation", async (req) => {
    const { user_ID, stationuuid, name, url_resolved, country } = req.data;
    await userController.onSaveStation(
      user_ID,
      stationuuid,
      name,
      url_resolved,
      country
    );
  });

  this.on("getSong", async (req) => {
    const { streamUrl, user_ID } = req.data;
    await userController.onGetSong(streamUrl, user_ID);
  });
};
