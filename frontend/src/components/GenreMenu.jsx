import { React, useContext } from 'react';
import GenrePieChart from './GenrePieChart';
import RadioContext from '../contexts/RadioContext';

const GenreMenu = ({
  genres,
  selectedGenre,
  searchTerm,
  setSelectedGenre,
  fetchStations,
  handleSearchChange,
  handleSearchSubmit,
}) => {
  const { history, setHistory } = useContext(RadioContext);

  return (
    <div className="side-menu open">
      <GenrePieChart history={history} setHistory={setHistory} />
      <h3>Genres</h3>
      <form onSubmit={handleSearchSubmit} className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for stations or genres..."
        />
        <button type="submit">Search</button>
      </form>
      <ul className="genre-list">
        {(genres?.value ?? [])
          .filter((genre) =>
            genre.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 50)
          .map((genre) => (
            <li
              key={genre.name}
              className={`genre-item ${
                selectedGenre === genre.name ? 'active' : ''
              }`}
              onClick={() => {
                fetchStations(genre.name);
                setSelectedGenre(genre.name);
              }}
            >
              {genre.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default GenreMenu;
