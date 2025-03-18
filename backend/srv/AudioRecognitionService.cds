using sonar as db from '../db';

service AudioRecognitionService {
    entity Songs as projection on db.Songs;

    function findSong(streamUrl : String, user_ID: UUID) returns Songs;

}
