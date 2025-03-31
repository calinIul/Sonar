namespace sonar;

using {cuid} from '@sap/cds/common';
using {sonar.Stations} from './stations';
using {sonar.Songs} from './songs';

entity Genres : cuid {
    key name           : String;
        station_genres : Composition of many StationGenres
                             on station_genres.genre.ID = ID;
        song_genres    : Composition of many SongGenres
                             on song_genres.genre.ID = ID;
}


entity StationGenres : cuid {
    key station : Association to one Stations;
    key genre   : Association to one Genres;
}

entity SongGenres : cuid {
    key song  : Association to one Songs;
    key genre : Association to one Genres;
}
