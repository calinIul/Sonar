using sonar as db from '../db';

@path: '/my-profile'
service UserService {
    entity Users        as
        projection on db.Users
        excluding {
            password
        }

    entity UserStations as projection on db.UserStations;
    entity UserSongs    as projection on db.UserSongs;

}
