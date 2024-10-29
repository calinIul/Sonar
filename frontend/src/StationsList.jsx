// StationsList.jsx
import React from 'react';

const StationsList = ({ stations, playStream }) => {

  if (stations.length == 0) {
    return <div className='main-content'>
    <h2>Stations</h2>
    <p>{"No stations found."}</p>
    </div>
  }

  return (
    <div className='main-content'>
    <div className="stations-list">
      <h2>Stations</h2>
      <ul>
        {stations.map((station) => (
          <li key={station.stationuuid}>
            {station.name}
            <h3>{station.country}</h3>
            <button onClick={() => playStream(station)}>Play</button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default StationsList;
