namespace sonar;

using {cuid} from '@sap/cds/common';
using {sonar.StationGenres} from './genres';
using {sonar.Users} from './users';

entity Stations : cuid {
        @mandatory name : String;
        @mandatory url  : String;
        url_resolved    : String;
        image_url       : String;
        country         : String;
        clickcount      : Integer;
        clicktrend      : Integer;
        saved_stations  : Composition of many SavedStations
                                  on saved_stations.station = $self;
        genre           : Association to many StationGenres
                                  on genre.station = $self;

}

entity SavedStations: cuid {
        user    : Association to Users;
        station : Association to Stations;
        saved   : Boolean default false;

}
