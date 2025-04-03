using sonar as db from '../db';

@path: '/my-profile'
service UserService @(requires: 'Listener') {
    entity Users        as
        projection on db.Users
        excluding {
            password
        }

    entity UserStations as projection on db.UserStations;
    entity UserSongs    as projection on db.UserSongs;
    action logIn(email : String, password : String)  returns Users;
    action signUp(email : String, password : String) returns Users;

    annotate UserSongs with @(restrict: [
        {
            grant: 'READ',
            to   : 'Listener',
            where: '$user.listeners = listener'
        },
        {
            grant: 'WRITE',
            to   : 'Listener',
            where: '$user.listeners = listener'
        }
    ]);

    annotate UserStations with @(restrict: [
        {
            grant: 'READ',
            to   : 'Listener',
            where: '$user.listeners = listener'
        },
        {
            grant: 'WRITE',
            to   : 'Listener',
            where: '$user.listeners = listener'
        }
    ]);

    annotate Users with @(requires: ['Admin']);

}
