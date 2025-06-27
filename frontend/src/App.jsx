// App.js
import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './assets/css/App.css';
import GenreMenu from './components/GenreMenu';
import NowPlaying from './components/NowPlaying';
import StationsList from './components/StationsList';
import RecentlyPlayed from './components/RecentlyPlayed';
import RadioContext from './contexts/RadioContext';
import UserContext from './contexts/UserContext';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import GenrePieChart from './components/GenrePieChart';


const App = () => {


  const [genres, setGenres] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentStation, setCurrentStation] = useState(null);
  const [audio, setAudio] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    const rplayed = sessionStorage.getItem('recentlyPlayed');
    return rplayed ? JSON.parse(rplayed) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [favorites, setFavorites] = useState(null);
  const [refreshFavorites, setRefreshFavorites] = useState(0);
  const [refreshSongs, setRefreshSongs] = useState(0);
  const [history, setHistory] = useState(() => ({}));
  const [loadingSong, setLoadingSong] = useState(false);


  useEffect(() => {
  fetch('/stations/getGenres')
    .then(res => res.json())
    .then(setGenres)
    .catch(err => console.error("Error fetching genres:", err));
}, []);


  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      
    }
  }, []);

  const fetchStations = async (term) => {
    setLoading(true);
    setStations([]);
    try {
      const res = await fetch(`/stations/getStations(genre='${term}')`);
      const data = await res.json();
      setStations(data.value || []);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const playStream = (station) => {
    if (audio) audio.pause();

    const newAudio = new Audio(station.url_resolved);
    newAudio.volume = volume;
    newAudio.play();
    newAudio.addEventListener('ended', () => setAudio(null));

    setAudio(newAudio);
    setCurrentStation(station);

    setRecentlyPlayed((prev) => {
      if (!prev.find((item) => item.name === station.name)) {
        sessionStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed))
        return [...prev, station];
      }
      sessionStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
      return prev;
      
    });

    addToHistory(station);
    
  };

  const stopStream = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
      setCurrentStation(null);
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

  
  
  const handleLogin = (user) => {
    
    setUser(user);
    sessionStorage.setItem('user', JSON.stringify(user));
    
  }

  const handleLogout = (user) => {
    if (user) setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('recentlyPlayed');
    setRefreshFavorites((prev) => prev + 1);
    setRefreshSongs((prev) => prev + 1);
  }

  const addToHistory = (station) => {
    
    if (station.tags) {
      const tags = station.tags.split(",").map(tag => tag.trim().replace(/^#/, "").toLowerCase());
      const first_tags = tags.slice(0, 2);
      setHistory(prevHistory => {
        const updatedHistory = { ...prevHistory };
        first_tags.forEach(tag => {
          if (tag != "")
          updatedHistory[tag] = (updatedHistory[tag] || 0) + 1;
        });
        return updatedHistory;
      });
    }
    return history;
  };
  
  const addFavorites = async (user, station) => {
    
    await fetch(`/user/saveStation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({user_ID: user.ID, stationuuid: station.stationuuid, name: station.name, url_resolved: station.url_resolved, country: station.country})
    });
    setRefreshFavorites((prev) => prev + 1);
    
    
  }

  

  const identifySong = async (station, user) => {
    setLoadingSong(true)
    try {
      await fetch(`/ar/getSong`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ streamUrl: station.url_resolved, user_ID: user.ID })
      });
      setRefreshSongs((prev) => prev + 1);
    } catch (error) {
      console.log("Error identifying song: ", error);
      return null;
    } finally {
      setLoadingSong(false);
    }
  };

  

  return (
    <RadioContext.Provider value={{ stations, setStations, selectedGenre, playStream, history, setHistory}}>
      <UserContext.Provider value = {{ user, addFavorites, favorites, setFavorites, refreshFavorites, setRefreshFavorites, refreshSongs}}>
      <Router>
      {user && <Navigate to="/" replace />}

        <Routes>
          {/* Route for the main app */}
          <Route
            path="/"
            element={
              <div className="app-container">
                <NowPlaying
                  currentStation={currentStation}
                  stopStream={stopStream}
                  volume={volume}
                  handleVolumeChange={handleVolumeChange}
                  identifySong={identifySong}
                  handleLogout={handleLogout}
                  loadingSong={loadingSong}
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
                <StationsList 
                  key={selectedGenre || searchTerm}
                  loading={loading}
                  history={history}
                  
                  />
                <RecentlyPlayed 
                recentlyPlayed={recentlyPlayed} 
                playStream={playStream}
                history={history} 
                />
              </div>
            }
          />

          {/* Route for the signup page */}
          <Route path="/signup" element={<SignUp handler={handleLogin}/>} />
          <Route path="/login" element={<LogIn onLogin={handleLogin} />}>
          
          </Route>
          
        </Routes>
      </Router>
      </UserContext.Provider>
    </RadioContext.Provider>
  );
};

export default App;
