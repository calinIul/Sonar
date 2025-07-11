import constants from "../utils/constants.js";
import UserRepository from "../repository/users-repository.js";
import StationsRepository from "../repository/stations-repository.js";
import bcrypt from 'bcryptjs';
import pkg from '@sap/cds/lib/utils/cds-utils.js';
import xsenv from '@sap/xsenv';
const { uuid } = pkg;
// const services = xsenv.getServices({
//   uaa: { tag: "xsuaa" },
// // });

// const CLIENT_ID = services.uaa.clientid;
// const CLIENT_SECRET = services.uaa.clientsecret;
// const { CDS_ENTITIES, AUDIO_URL } = constants;

export default class UserController {
  constructor(db, cdsEntities) {
    this.db = db;
    this.cdsEntities = cdsEntities;
    this.userRepository = new UserRepository(db);
    this.stationRepository = new StationsRepository(db);
  }

  async onSignUp(email, password) {
    const User = this.cdsEntities[CDS_ENTITIES.User];
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    await this.userRepository.addUser(User, email, hash);

    const response = await fetch(
      `https://f78a52bftrial.authentication.us10.hana.ondemand.com/oauth/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }).toString(),
      }
    );
    const token = await response.json();

    const user = await this.userRepository.getUser(email);
    user.token = token.access_token;
    return user;
  }

  async onLogIn(email, password) {
    const User = this.cdsEntities[CDS_ENTITIES.User];
    try {
      const user = await this.userRepository.getUser(User, email);

      if (!user) {
        req.reject("No user found");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        req.reject("Invalid email or password");
      }
      const response = await fetch(
        `https://f78a52bftrial.authentication.us10.hana.ondemand.com/oauth/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
          }).toString(),
        }
      );

      const token = await response.json();
      user.token = token.access_token;

      return user;
    } catch (error) {
      req.reject("Error", error);
    }
  }

  async onGetUserStations(user_ID) {
    return this.userRepository.getUserStations(user_ID);
  }

  async onRemoveStation(user_ID, stationuuid) {
    const SavedSations = this.cdsEntities[CDS_ENTITIES.SavedStations];
    return this.userRepository.removeUserStation(
      SavedSations,
      user_ID,
      stationuuid
    );
  }

  async onSaveStation(stationuuid, user_ID, name, url_resolved, country) {
    const Stations = this.cdsEntities[CDS_ENTITIES.Stations];
    const SavedStations = this.cdsEntities[CDS_ENTITIES.SavedStations];
    const id = uuid();
    let existingStation = await this.stationRepository.getStation(
      Stations,
      stationuuid
    );

    if (!existingStation) {
      existingStation = await this.stationRepository.addStation(
        Stations,
        stationuuid,
        name,
        url_resolved,
        country
      );
    }

    const existingSavedStation = await this.stationRepository.getSavedStation(
      SavedStations,
      user_ID,
      stationuuid
    );
    if (!existingSavedStation) {
      await this.stationRepository.addSavedStation(
        SavedStations,
        id,
        user_ID,
        stationuuid
      );
    }
  }

  
}
