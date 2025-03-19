using sonar as db from '../db';

service StationsService {
    entity Stations as projection on db.Stations;
    entity SavedStations as projection on db.SavedStations;
    entity Genres as projection on db.Genres;
    entity Songs as projection on db.Songs;

    function getGenres() returns array of Genres;
    function getStations(genre: String) returns array of Stations;
    


};
