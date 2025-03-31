namespace sonar;

using {cuid, managed} from '@sap/cds/common';
using {sonar.SavedStations} from './stations';
using {sonar.Stations} from './stations';
using {sonar.UserSongs} from './songs';


entity Users : cuid {
        email    : String;
        password : String;
        stations : Composition of many SavedStations
                           on stations.user.ID = ID;
        songs    : Composition of many UserSongs
                           on songs.user.ID = ID;
}

