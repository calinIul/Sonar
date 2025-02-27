namespace stream.station;

using {cuid} from '@sap/cds/common';
using {stream.station.SavedStations} from './stations';
using {stream.station.UserSongs} from './songs';


entity Users: cuid {
        email    : String;
        password : String;
        stations : Composition of many SavedStations
                       on stations.user.ID = ID;
        songs    : Composition of many UserSongs
                       on songs.user.ID = ID;
}