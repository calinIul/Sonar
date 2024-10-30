// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import GenreMenu from './GenreMenu';
import NowPlaying from './NowPlaying';
import StationsList from './StationsList';
import RecentlyPlayed from './RecentlyPlayed';
import RadioContext from './RadioContext';

const App = () => {
  const [genres, setGenres] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentStationName, setCurrentStationName] = useState(null);
  const [audio, setAudio] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/genres')
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error('Error fetching genres:', err));
  }, []);

  const fetchStations = async (term) => {
    setLoading(true);
    setStations([]);
    try {
      const res = await fetch(`/api/radios/${term}`);
      const data = await res.json();
      setStations(data || []);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const playStream = (station) => {
    if (audio) audio.pause();

    const newAudio = new Audio(station.url);
    newAudio.volume = volume;
    newAudio.play();
    newAudio.addEventListener('ended', () => setAudio(null));

    setAudio(newAudio);
    setCurrentStationName(station.name);

    setRecentlyPlayed((prev) => {
      if (!prev.find((item) => item.name === station.name)) {
        return [...prev, station];
      }
      return prev;
    });
  };

  const stopStream = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
      setCurrentStationName(null);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    if (audio) audio.volume = newVolume;
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim() === '') return;
    setSelectedGenre(searchTerm);  // Sets the key based on search term
    fetchStations(searchTerm);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <RadioContext.Provider value={{ stations, selectedGenre, playStream }}>
      <div className="app-container">
        <NowPlaying
          currentStationName={currentStationName}
          stopStream={stopStream}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
        />
        <GenreMenu
          genres={genres}
          selectedGenre={selectedGenre}
          searchTerm={searchTerm}
          setSelectedGenre={setSelectedGenre}
          fetchStations={fetchStations}
          handleSearchChange={handleSearchChange}
          handleSearchSubmit={handleSearchSubmit}
        />
        <StationsList key={selectedGenre || searchTerm} loading={loading} />
        <RecentlyPlayed recentlyPlayed={recentlyPlayed} playStream={playStream} />
      </div>
    </RadioContext.Provider>
  );
};

export default App;
