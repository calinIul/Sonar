namespace com.sap.radio;

entity Stations {
    key ID             : UUID;
        name           : String;
        url_resolved   : String;
        country        : String;
        saved_stations : Composition of many SavedStations
                             on saved_stations.station.ID = ID;
        genres         : Composition of many StationGenres
                             on genres.station.ID = ID;

}

entity User {
    key ID       : UUID;
        email    : String;
        password : String;
        stations : Composition of many SavedStations
                       on stations.user.ID = ID;
        songs    : Composition of many SavedSongs
                       on songs.user.ID = ID;
}

entity Songs {
    key ID        : UUID;
        title     : String;
        createdAt : DateTime default '1970-12-31T01:01:01Z';
        artist    : String;
        user      : Composition of many SavedSongs
                        on user.song.ID = ID;

}

entity Genres {
    key name           : String;
        modifiedAt     : DateTime default '1970-12-31T01:01:01Z';
        station_genres : Composition of many StationGenres
                             on station_genres.genre.name = name;


}

entity SavedSongs {
    key song : Association to one Songs;
    key user : Association to one User;
}


entity StationGenres {
    key station : Association to one Stations;
        genre   : Association to one Genres;
}

entity SavedStations {
    key ID      : UUID;
        user    : Association to User;
        station : Association to Stations;

}
