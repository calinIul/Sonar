import constants from '../utils/constants.js';
import UserRepository from '../repository/users-repository.js';
import StationsRepository from '../repository/stations-repository.js';
import bcrypt from 'bcryptjs';
import pkg from '@sap/cds/lib/utils/cds-utils.js';
const { uuid } = pkg;
// import xsenv from '@sap/xsenv';
const { CDS_ENTITIES } = constants;
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
    const Users = this.cdsEntities[CDS_ENTITIES.Users];
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    let user_ID = uuid();
    let new_user = {
      ID: user_ID,
      email: email,
      password: hash,
    };
    await this.userRepository.addUser(Users, new_user);

    // const response = await fetch(
    //   `https://f78a52bftrial.authentication.us10.hana.ondemand.com/oauth/token`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     body: new URLSearchParams({
    //       grant_type: "client_credentials",
    //       client_id: CLIENT_ID,
    //       client_secret: CLIENT_SECRET,
    //     }).toString(),
    //   }
    // );
    // const token = await response.json();

    const user = await this.userRepository.getUser(Users, email);
    // user.token = token.access_token;
    return {
      ID: user.ID,
      email: user.email,
    };
  }

  async onLogIn(email, password) {
    const Users = this.cdsEntities[CDS_ENTITIES.Users];
    try {
      const user = await this.userRepository.getUser(Users, email);

      if (!user) {
        console.log('No user found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        req.reject('Invalid email or password');
      }
      // const response = await fetch(
      //   `https://f78a52bftrial.authentication.us10.hana.ondemand.com/oauth/token`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
      //     body: new URLSearchParams({
      //       grant_type: "client_credentials",
      //       client_id: CLIENT_ID,
      //       client_secret: CLIENT_SECRET,
      //     }).toString(),
      //   }
      // );

      // const token = await response.json();
      // user.token = token.access_token;

      return {
        ID: user.ID,
        email: user.email,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async onGetUserStations(user_ID) {
    const SavedSations = this.cdsEntities[CDS_ENTITIES.SavedStations];
    return this.userRepository.getStationByUser(SavedSations, user_ID);
  }

  async onRemoveStation(user_ID, stationuuid) {
    const SavedSations = this.cdsEntities[CDS_ENTITIES.SavedStations];
    return this.userRepository.removeUserStation(
      SavedSations,
      user_ID,
      stationuuid
    );
  }

  async onSaveStation(user_ID, station) {
    const Stations = this.cdsEntities[CDS_ENTITIES.Stations];
    const SavedStations = this.cdsEntities[CDS_ENTITIES.SavedStations];
    
    let existingStation = await this.stationRepository.getStationById(
      Stations,
      station.stationuuid || station.ID
    );

    if (!existingStation) {
      await this.stationRepository.addStation(Stations, station)

      
    }

    
      await this.stationRepository.addSavedStation(
        SavedStations,
        user_ID,
        station.ID
      );
    
  }
}
