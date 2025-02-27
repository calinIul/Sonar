namespace stream.station;

using {cuid} from '@sap/cds/common';
using {stream.station.StationGenres} from './genres';
using {stream.station.Users} from './users';

entity Stations : cuid {

        @assert.notNull name : String;
        @assert.notNull url  : String;
        url_resolved         : String;
        image_url            : String;
        country              : String;
        lastchangetime       : DateTime;
        clickcount           : Integer;
        clicktrend           : Integer;
        saved_stations       : Composition of many SavedStations
                                       on saved_stations.station.ID = ID;
        genres               : Composition of many StationGenres
                                       on genres.station.ID = ID;

}

entity SavedStations : cuid {

        user    : Association to Users;
        station : Association to Stations;

}
