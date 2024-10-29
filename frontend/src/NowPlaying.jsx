import React from 'react';

const NowPlaying = ({ currentStationName, stopStream, volume, handleVolumeChange }) => (
  <div className="now-playing-top">
    <h2>Now Playing: {currentStationName || "Nothing playing"}</h2>
    <button onClick={stopStream}>Stop</button>
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
  </div>
);

export default NowPlaying;
