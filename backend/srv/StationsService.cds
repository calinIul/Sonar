using sonar as db from '../db';

@path: '/browse'
service StationsService {
    entity Stations      as projection on db.Stations;
    entity Genres        as projection on db.Genres;

    function getGenres()                 returns array of Genres;
    function getStations(genre : String) returns array of Stations;

};
