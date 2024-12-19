import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import RadioContext from '../contexts/RadioContext';

const UserFavorites = () => {
  const { user, favorites, setFavorites, addFavorites, refreshFavorites, setRefreshFavorites } = useContext(UserContext);
  const { playStream } = useContext(RadioContext);
  const [loading, setLoading] = useState(true);
  const normalize = function (station_list) {
    const normalized_stations = [];
    
    for (const station of station_list) {
      const normalizedStation = {};
      for (const [key, value] of Object.entries(station)) {
        normalizedStation[key.toLowerCase()] = value;
      }
      normalized_stations.push(normalizedStation);
    }
    
    return normalized_stations;
  }
  

  const getUserFavorites = async () => {

    if (user) {
      try {

        const response = await fetch(`/user/getUserStations(user_ID='${user.ID}')`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
        });
        const data = await response.json();

        setFavorites(normalize(data.value));
        

      } catch (error) {
        console.error("Failed to fetch user's favorite stations:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeFavorites = async (station) => {
    try {
      const res = await fetch(`stations/SavedStations?$search=user_ID='${user.ID}'&$filter=station_ID eq '${station.station_id}'`);
      const ss = await res.json();
      console.log(ss);
      await fetch(`/stations/SavedStations(ID='${ss.value[0].ID}')`, {
        method: 'DELETE'
      });
      setRefreshFavorites((prev) => prev + 1);
    } catch (error) {
      console.log("Failed to remove favorite station: ", error);
    }
  }



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
    <div >
      {user && (
        <h2>Favorite Stations</h2>)
      }
      {favorites.length === 0 ? (
        <p>No stations saved yet.</p>
      ) : (
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite.station_id}>
              
              {favorite.name}
              <p><button onClick={() => playStream(favorite)}>Play </button>
              <button onClick={() => removeFavorites(favorite)}> Remove </button>
              </p>
              
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserFavorites;

