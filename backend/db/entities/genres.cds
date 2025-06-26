namespace sonar;

using {sonar.Stations} from './stations';
using {sonar.Songs} from './songs';

@cds.search: {
    name: true,
    song.song.title,
    song.song.artist
}
entity Genres {
    key name    : String;
        station : Association to many StationGenres
                      on station.genre = $self;
        song    : Association to many SongGenres
                      on song.genre = $self;
}


entity StationGenres {
    key station : Association to Stations;
    key genre   : Association to Genres;
}

entity SongGenres {
    key song  : Association to Songs;
    key genre : Association to Genres;
}
