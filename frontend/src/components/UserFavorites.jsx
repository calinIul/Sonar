import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import RadioContext from '../contexts/RadioContext';

const UserFavorites = () => {
  const {
    user,
    favorites,
    setFavorites,
    addFavorites,
    refreshFavorites,
    setRefreshFavorites,
  } = useContext(UserContext);
  const { playStream } = useContext(RadioContext);
  const [loading, setLoading] = useState(true);
  

  const getUserFavorites = async () => {
    if (user) {
      try {
        const response = await fetch(
          `/user/getUserStations(user_ID='${user.ID}')`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        setFavorites(data.value);
      } catch (error) {
        console.error("Failed to fetch user's favorite stations:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeFavorites = async (station) => {
    try {
      await fetch(
        `user/UserStations(user_ID='${user.ID}', station_ID='${station.ID}')`,
        {
          method: 'DELETE',
        }
      );

      setRefreshFavorites((prev) => prev + 1);
    } catch (error) {
      console.log('Failed to remove favorite station: ', error);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserFavorites();
    } else {
      setFavorites([]);
    }
  }, [refreshFavorites]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user && <h2>Favorite Stations</h2>}
      {favorites.length === 0 ? (
        <p>No stations saved yet.</p>
      ) : (
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite.station.ID || favorite.station.stationuuid}>
              {favorite.station.name}
              <p>
                <button onClick={() => playStream(favorite.station)}>
                  Play{' '}
                </button>
                <button onClick={() => removeFavorites(favorite.station)}>
                  {' '}
                  Remove{' '}
                </button>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserFavorites;
