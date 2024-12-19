const axios = require("axios");
const cds = require("@sap/cds");
const bcrypt = require("bcryptjs");
const xsenv = require("@sap/xsenv");
const { uuid } = cds.utils;
const services = xsenv.getServices({
  uaa: { tag: "xsuaa" },
});

const CLIENT_ID = services.uaa.clientid;
const CLIENT_SECRET = services.uaa.clientsecret;

module.exports = async function UsersService() {
  const db = await cds.connect.to("db");
  const { User, Stations, SavedStations, Songs, SavedSongs, Test } =
    db.entities;

  this.on("getUserStations", async (req) => {
    const { user_ID } = req.data;

    const stations = await db.run(`SELECT * 
            FROM StationsService_Stations AS st  
            JOIN StationsService_SavedStations AS ss 
            ON st.ID = ss.station_ID 
            WHERE ss.user_ID = '${user_ID}';
        `);

    return stations;
  });

  this.on("signUp", async (req) => {
    const { email, password } = req.data;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    await INSERT.into(User).entries({ email: email, password: hash });
    const user = await SELECT.one.from(User).where({ email: email });
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
  });

  this.on("logIn", async (req) => {
    const { email, password } = req.data;

    try {
      const user = await SELECT.one.from(User).where({ email: email });

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
      console.log(error);
      req.reject("Error", error);
    }
  });

  this.on("saveStation", async (req) => {
    const { user_ID, stationuuid, name, url_resolved, country } = req.data;

    const id = uuid();
    let existingStation = await SELECT.one
      .from(Stations)
      .where({ ID: stationuuid });

    if (!existingStation) {
      existingStation = await INSERT.into(Stations)
        .columns("ID", "name", "url_resolved", "country")
        .values(stationuuid, name, url_resolved, country);
      existingStation = await SELECT.one
        .from(Stations)
        .where({ ID: stationuuid });
    }

    const existingSavedStation = await SELECT.one
      .from(SavedStations)
      .where({ user_ID: user_ID, station_ID: existingStation.ID });
    if (!existingSavedStation) {
      await INSERT.into(SavedStations)
        .columns("ID", "user_ID", "station_ID")
        .values(id, user_ID, stationuuid);
    }

    const response = await SELECT.from(SavedStations).where({
      user_ID: user_ID,
    });

    return response;
  });

  this.on("removeStation", async (req) => {
    const { user_ID, stationuuid } = req.data;

    await DELETE.one
      .from(SavedStations)
      .where({ user_ID: user_ID, station_ID: stationuuid });
  });

  this.on("getSong", async (req) => {
    const { streamUrl, user_ID } = req.data;

    try {
      const res = await fetch(
        "https://audio-empathic-panda-lw.cfapps.us10-001.hana.ondemand.com/identify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ streamUrl: streamUrl }),
        }
      );
      const response = await res.json();
      console.log(response);
      const data = response?.data?.metadata || response?.metadata;
      if (data) {
        const song = {
          title: data.music[0].title,
          artist: data.music[0].artists[0].name,
        };
        console.log(song);
        await INSERT.into(Songs)
          .columns("title", "createdAt", "artist", "user_ID")
          .values(song.title, data.timestamp_utc, song.artist, user_ID);

        const songDb = SELECT.one.from(Songs).where({ title: song.title });
        return songDb;
      }

      return null;
    } catch (error) {
      console.error("Error in identify-song route:", error);
      req.reject("Failed to identify song");
    }
  });
};
