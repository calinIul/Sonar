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
        genre           : Composition of many StationGenres
                                  on genre.station.ID = ID;
        users           : Composition of many UserStations
                                  on users.station.ID = ID;

}

entity UserStations {
        key user    : Association to Users;
        key station : Association to Stations;
}
