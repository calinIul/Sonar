import {React, useContext} from 'react';
import UserFavorites from './UserFavorites';
import RadioContext from '../contexts/RadioContext';



const RecentlyPlayed = ({ recentlyPlayed }) => {
  const { history, playStream } = useContext(RadioContext);

  return (
  <div className="recently-played">
    <UserFavorites> 

    </UserFavorites>
    <h2>Recently Played</h2>
    {recentlyPlayed.length > 0 ? (
      <ul>
        {recentlyPlayed.map((station) => (
          <li key={station.stationuuid ? station.stationuuid : station.station_id}>
            {station.name.split(" ").slice(0,5)}
            <button onClick={() => playStream(station)}>Play</button>
          </li>
        ))}
      </ul>
    ) : (
      <p>No stations played recently.</p>
    )}
  </div>
  )
};

export default RecentlyPlayed;
