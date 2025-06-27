// StationsList.jsx ------------ atm black metal on load error
import React, { useContext, useEffect, useState } from 'react';
import RadioContext from '../contexts/RadioContext';
import no_stations from '../assets/images/no_stations.png'
import UserContext from '../contexts/UserContext';
import GenrePieChart from '../components/GenrePieChart'; 

const StationsList = ({ loading }) => {
  const { stations, playStream, selectedGenre } = useContext(RadioContext);
  const { user, addFavorites, favorites } = useContext(UserContext);
  const [filtered, setFiltered] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [isAscending, setIsAscending] = useState(false);



  useEffect(() => {
    if (filtered.length === 0) { setFiltered(stations) }
  })


  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setFilterTerm(searchTerm);
    
    
    const dynamicFiltered = stations.filter((station) => {
      const tags = station.tags.split(",").map(tag => tag.trim().toLowerCase());
      return (
        station.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tags.includes(searchTerm.toLowerCase()) ||
        station.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  
    setFiltered(dynamicFiltered);
  };
  

  const searchBy_ = (event) => {
    event.preventDefault();
    if (filterTerm === "") {
      setFiltered(stations);
      return;
    }
    const filt = stations.filter((station) => {
      const tags = station.tags.split(",").map(tag => tag.trim().toLowerCase());
      return (
        station.country.toLowerCase().includes(filterTerm.toLowerCase()) || 
        tags.includes(filterTerm.toLowerCase()) || 
        station.name.toLowerCase().includes(filterTerm.toLowerCase())
      );
    });
    setFiltered(filt);
  };

  const sortByVotes = (event) => {
    event.preventDefault();

    const sorted = [...filtered].sort((a, b) => 
      b.votes - a.votes
    );

    setFiltered(sorted);
    
  };

  const sortByTrend = (event) => {
    event.preventDefault();

    const sorted = [...filtered].sort((a, b) => 
      b.clicktrend - a.clicktrend
    );
    console.log(stations)
    setFiltered(sorted);
    
  }

  const sortByClicks = (event) => {
    event.preventDefault();
  
    const sorted = [...filtered].sort((a, b) => 
      isAscending ? a.clickcount - b.clickcount : b.clickcount - a.clickcount
    );
    setFiltered(sorted);
    setIsAscending(!isAscending);
  };
  

  if (loading) {
    return <div className='main-content'><h2>Loading stations...</h2></div>
  }

  if (stations.length === 0) {
    return (
      <div className="main-content">
        <h2>Stations for {selectedGenre}</h2>
        <p>No stations found.</p>
        <p><img src={no_stations}></img></p>
      </div>
    );
  }

  return (
    <div className="main-content">
      

      <div className="stations-list">
        <h2>Stations for "{selectedGenre}"</h2>
        <form onSubmit={searchBy_} className="search-bar">
          <input
            type="text"
            value={filterTerm}
            onChange={handleSearchChange}
            placeholder="Search for stations or subgenres..."
          />
          <button type="submit">Search</button>
        </form>
        <button onClick={sortByClicks}>Sort by {isAscending ? 'least' : 'most'} popular all time</button>
        <button onClick={sortByVotes}>Sort by rating</button>
        <button onClick={sortByTrend}>Sort by trending</button>
        <button onClick={() =>{setFiltered(stations); setFilterTerm("");}}>Reset filters</button>
        <ul>
          {filtered.map((station) => (
            <li key={station.stationuuid}>
              <h3>{station.name}</h3>
              <h3><img src={station.image_url ? station.image_url : no_stations}></img></h3>
              <h3>{station.country}</h3>
              
              {user && (
                <button onClick={() => addFavorites(user, station)}>Save</button>
              )
              }
              <button onClick={() => playStream(station)}>Play</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StationsList;
