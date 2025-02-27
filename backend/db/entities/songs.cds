namespace stream.station;

using {cuid} from '@sap/cds/common';
using {stream.station.Users} from './users';
using {stream.station.SongGenres} from './genres';

entity Songs : cuid {
    title    : String;
    artist   : String;
    album    : String;
    genres   : Composition of many SongGenres
                   on genres.song.ID = ID;
    metadata : Association to one SongMetadata;
    user     : Composition of many UserSongs
                   on user.song.ID = ID;

}

entity SongMetadata : cuid {
    @assert.notNull song : Association to one Songs
                               on song.metadata = $self;
    system               : String;
    duration             : Integer;
    url                  : String;
    image_url            : String;
    fingerprint          : String;
    embedding            : Vector(1536);


}

entity UserSongs {
    key song : Association to one Songs;
    key user : Association to one Users;
}
