namespace sonar;

using {cuid} from '@sap/cds/common';
using {managed} from '@sap/cds/common';
using {sonar.Users} from './users';
using {sonar.SongGenres} from './genres';

entity Songs : cuid, managed {
    @mandatory title : String;
    artist           : String;
    metadata         : Composition of one SongsMetadata
                           on metadata.song = $self;
    user             : Composition of many UserSongs
                           on user.song.ID = ID;
    genres           : Composition of many SongGenres
                           on genres.song.ID = ID;

}

entity SongsMetadata {
    key song        : Association to one Songs;
        album       : String;
        url         : String;
        duration    : Integer;
        cover       : String;
        fingerprint : String;
        // embedding            : Vector(1536) default null;
}

entity UserSongs: managed{
    key song : Association to Songs;
    key user : Association to Users;
}
