namespace sonar;

using {cuid} from '@sap/cds/common';
using {sonar.UserStations} from './stations';
using {sonar.UserSongs} from './songs';


entity Users : cuid {
        email    : String;
        password : String;
        stations : Composition of many UserStations
                           on stations.user.ID = ID;
        songs    : Composition of many UserSongs
                           on songs.user.ID = ID;
}

