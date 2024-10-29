import React from 'react';

const RecentlyPlayed = ({ recentlyPlayed, playStream }) => (
  <div className="recently-played">
    <h2>Recently Played</h2>
    {recentlyPlayed.length > 0 ? (
      <ul>
        {recentlyPlayed.map((station) => (
          <li key={station.stationuuid}>
            {station.name}
            <button onClick={() => playStream(station)}>Play Again</button>
          </li>
        ))}
      </ul>
    ) : (
      <p>No stations played recently.</p>
    )}
  </div>
);

export default RecentlyPlayed;
