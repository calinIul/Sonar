using sonar as db from '../db';

@path: '/stations'
service StationsService {
    entity Stations      as projection on db.Stations;
    entity Genres        as projection on db.Genres;

    function getGenres(limit: Int16, offset: Int16) returns array of Genres;
    function getStations(genre : String) returns array of Stations;

};
