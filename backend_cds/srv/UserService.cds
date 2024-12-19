using com.sap.radio as db from '../db/data-models';

service UserService {
    entity User          as
        select from db.User {
            ID,
            email,
            stations,
            songs
        };

    entity SavedStations as projection on db.SavedStations;
    entity Songs         as projection on db.Songs;
    entity Stations      as projection on db.Stations;
    action   getSong(streamUrl : String, user_ID : UUID)                                                             returns Songs;
    function getUserStations(user_ID : UUID)                                                                         returns array of Stations;
    action   saveStation(user_ID : UUID, stationuuid : UUID, name : String, url_resolved : String, country : String) returns array of SavedStations;
    action   removeStation(user_ID : UUID, stationuuid : UUID)                                                       returns array of SavedStations;
    action   logIn(email : String, password : String)                                                                returns User;
    action   signUp(email : String, password : String)                                                               returns User;
    annotate UserService.getUserStations with @(requires: 'authenticated-user');
    annotate UserService.getSong with @(requires: 'authenticated-user');
    annotate UserService.saveStation with @(requires: 'authenticated-user');
    annotate UserService.removeStation with @(requires: 'authenticated-user');


// type Station {
//     stationuuid: UUID;
//     name: String;
//     url_resolved: String;
//     country: String;
//     user_ID: UUID;
// };

}
