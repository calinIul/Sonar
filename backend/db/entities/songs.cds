namespace stream.station;

using {cuid} from '@sap/cds/common';
using {stream.station.Users} from './users';
using {stream.station.SongGenres} from './genres';

entity Songs : cuid {
    @assert.notNull title  : String;
    @assert.notNull artist : String;
    metadata               : Association to one SongsMetadata;
    user                   : Composition of many UserSongs
                                 on user.song.ID = ID;

}

entity SongsMetadata : cuid {
    @assert.notNull song : Association to one Songs
                               on song.metadata = $self;
    album                : String;
    genres               : Composition of many SongGenres
                               on genres.song.ID = ID;
    url                  : String;
    duration             : Integer;
    cover                : String;
    fingerprint          : String;
    embedding            : Vector(1536);


}

entity UserSongs {
    key song : Association to one Songs;
    key user : Association to one Users;
}
