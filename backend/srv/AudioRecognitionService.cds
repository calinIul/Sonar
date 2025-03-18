using sonar as db from '../db';

service AudioRecognitionService {
    entity Users as projection on db.Users;
    entity Songs as projection on db.Songs;
    entity UserSongs as projection on db.UserSongs;

    function findSong(streamUrl : String, user_ID: UUID) returns Songs;


}
