using com.sap.radio as db from '../db/data-models';

service StationsService {
    entity Stations as projection on db.Stations;
    entity SavedStations as projection on db.SavedStations;

    function getGenres() returns array of String;
    function getStations(genre: String) returns array of Station;
    

    type Station {
        stationuuid: UUID;
        name: String;
        url_resolved: String;
        country: String;
    }


};
