using sonar as db from '../db';

@path: '/user'
service UserService {
    entity Users        as
        projection on db.Users
        excluding {
            password
        }
    entity Stations as projection on db.Stations;
    entity UserStations as projection on db.UserStations;
    entity UserSongs    as projection on db.UserSongs;
    action signUp(email: String, password: String) returns Users;
    action logIn(email: String, password: String) returns Users;
    function getUserStations(user_ID : UUID)                                                                         returns array of Stations;
    action   saveStation(user_ID : UUID, station: Stations)                                                          returns array of UserStations;
    action   removeStation(user_ID : UUID, stationuuid : UUID)                                                       returns array of UserStations;
}
