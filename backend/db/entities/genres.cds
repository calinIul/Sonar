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
        station : Composition of many StationGenres
                      on station.genre.name = name;
        song    : Composition of many SongGenres
                      on song.genre.name = name;
}


entity StationGenres {
    key station : Association to Stations;
    key genre   : Association to Genres;
}

entity SongGenres {
    key song  : Association to Songs;
    key genre : Association to Genres;
}
