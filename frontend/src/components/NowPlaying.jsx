import React, { useState, useContext, useEffect } from 'react';
import no_stations from '../assets/images/generated_image.png'
import UserContext from '../contexts/UserContext';



const NowPlaying = ({ currentStation, stopStream, volume, handleVolumeChange, identifySong, handleLogout, loadingSong }) => {
  const [songs, setSongs] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const { user, refreshSongs } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      getUserSongs(user);
    }
    else {
      setSongs([]);
    }
  }, [refreshSongs]);

  const handleIdentifySong = async () => {
    console.log(user)
    if (currentStation) {
      await identifySong(currentStation, user);
    }
  };

  const getUserSongs = async (user) => {
    if (user) {
      try {
        const res = await fetch(`/user/Songs?$filter=user_ID eq '${user.ID}'&$orderby=createdAt desc`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.status == 204) { setNotFound(true) }
        setSongs(data.value);
        
      } catch (error) {
        console.error("Error fetching user songs:", error);
      }
    }
  };

  return (
    <div className="now-playing-top">
      <div className="now-playing-left">
        <div className="now-playing-sr">
          
          <h3>Now Playing: </h3>
          <p>{currentStation?.name}</p>
          
        </div>
        {loadingSong && (
          <div className='now-playing-sr'>
            <h3>Searching...</h3>
          </div>
        )}

        {notFound && (
          <div className='now-playing-sr'>
            <h3>Couldn't identify song</h3>
          </div>
        )}

        <div className="now-playing-sr">
          <label><h3>Volume: </h3></label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
          <p>
            {currentStation && <button onClick={stopStream}>Stop</button>}
            {currentStation && <button onClick={handleIdentifySong}>Find song</button>}


          </p>
        </div>
        
      </div>

      <div className="now-playing-right">
        {user && (
          <div className='now-playing-sr-row'>
            <div>
              
              <h3>Playa {user.email}</h3>
              <button onClick={handleLogout}>Log Out</button>
              
            </div>
            <img src={no_stations} />
            
          </div>
          
          ) ||
          <div className='now-playing-sr'>
            <p>
              <button><a href='/login'>Login</a></button>
              <button><a href='/signup'>Sign Up</a></button>
            </p>
          </div>
        }

        {songs && songs.length > 0 && (
          <div className="now-playing-sr songs-list">
            <h3>Past search results:</h3>
            <div className="songs-scroll-container">
              <ul className="songs-ul">
                {songs.map((song, index) => (
                  <li
                    key={song.title}
                    className={index >= 2 ? "hidden-song" : ""}
                  >
                    {song.title} - {song.artist}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NowPlaying;
