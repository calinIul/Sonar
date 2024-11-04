// NowPlaying.jsx

import React, { useState } from 'react';
import no_stations from './assets/images/no_stations.png'

const NowPlaying = ({ currentStation, stopStream, volume, handleVolumeChange, identifySong }) => {
  const [songData, setSongData] = useState(null);

  const handleIdentifySong = async () => {
    if (currentStation) {
      const data = await identifySong(currentStation);
      setSongData(data); // Save song data to state to display below
    }
  };

  return (
    <div className="now-playing-top">
      <img src={no_stations}></img>
      <div className="now-playing-sr">
      <h3>Now Playing: </h3>
      <p>{currentStation ? currentStation.name : ""}</p>
      <p>
        {currentStation && (
          <button onClick={stopStream}>Stop</button> )}
        {currentStation && (
        <button onClick={handleIdentifySong}>Find song</button>)}
      </p>
      
      
      
      </div>
      
      <div className='now-playing-sr'>
        <label><h3>Volume: </h3></label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
      {songData && (
        <div className="now-playing-sr">
          <h3>Last search result:</h3>
          {(songData.metadata && (
            <div>
          <p>Title: {songData.metadata.music[0].title}</p>
          <p>Artist: {songData.metadata.music[0].artists[0].name}</p>
          </div>
          )) || <p>songData.status.msg</p>
          }
        </div>
      )}
    </div>
  );
};

export default NowPlaying;
