namespace sonar;

using {sonar.Stations} from './stations';
using {sonar.Songs} from './songs';

@readonly
entity Genres {
    key name           : String;
        station_genres : Composition of many StationGenres
                             on station_genres.genre.name = name;
        song_genres    : Composition of many SongGenres
                             on song_genres.genre.name = name;
}


entity StationGenres {
    key station : Association to one Stations;
    key genre   : Association to one Genres;
}

entity SongGenres {
    key song  : Association to one Songs;
    key genre : Association to one Genres;
}
