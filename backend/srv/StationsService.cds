using stream.station as ss from '../db';

service StationsService {
    entity Stations as projection on ss.Stations;
    entity SavedStations as projection on ss.SavedStations;

    function getGenres() returns array of String;
    function getStations(genre: String) returns array of Station;
    

    type Station {
        stationuuid: UUID;
        name: String;
        url_resolved: String;
        country: String;
    }


};
