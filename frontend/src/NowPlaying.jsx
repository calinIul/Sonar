// NowPlaying.jsx

import React, { useState } from 'react';

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
      <h2>Now Playing: {currentStation ? currentStation.name : "Nothing playing"}</h2>
      <button onClick={stopStream}>Stop</button>
      {currentStation && (
        <button onClick={handleIdentifySong}>Find song</button>
      )}
      <div>
        <label>Volume: </label>
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
        <div>
          <h3>Song Identification Result:</h3>
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
