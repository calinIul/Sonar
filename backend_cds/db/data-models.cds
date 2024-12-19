namespace com.sap.radio;

entity Stations {
    key ID             : UUID;
        name           : String;
        url_resolved   : String;
        country        : String;
        saved_stations : Composition of many SavedStations
                             on saved_stations.station.ID = ID;

}

entity User {
    key ID       : UUID;
        email    : String;
        password : String;
        stations : Composition of many SavedStations
                       on stations.user.ID = ID;
        songs    : Composition of many Songs
                       on songs.user.ID = ID;
}

entity Songs {
    key title           : String;
        createdAt       : DateTime default '1970-12-31T01:01:01Z';
        artist          : String;
        @UI.Hidden user : Association to one User;

}


entity SavedStations {
    key ID      : UUID;
        user    : Association to User;
        station : Association to Stations;

}
