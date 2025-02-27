using stream.station as ss from '../db';

service AudioRecognitionService {
    entity Users as projection on ss.Users;
    entity Songs as projection on ss.Songs;
    entity UserSongs as projection on ss.UserSongs;

    function findSong(streamUrl : String, user_ID: UUID) returns Songs;


}
