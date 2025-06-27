using sonar as db from '../db';

@path: '/ar'
service AudioRecognitionService {
    entity Songs         as projection on db.Songs;
    entity SongGenres    as projection on db.SongGenres;
    entity Genres        as projection on db.Genres;

    @readonly entity SongsMetadata as
        projection on db.SongsMetadata
        excluding {
            embedding
        };

    @readonly entity UserSongs     as projection on db.UserSongs;

    @description: 'Find song action'
    action findSong(streamUrl : String, user_ID : UUID) returns Songs;

}
