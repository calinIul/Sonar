import React from 'react';

const GenreMenu = ({
  genres,
  selectedGenre,
  searchTerm,
  setSelectedGenre,
  fetchStations,
  handleSearchChange,
  handleSearchSubmit
}) => (
  <div className="side-menu open">
    <h2>Search for a genre or country</h2>
    <form onSubmit={handleSearchSubmit} className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search for stations or genres..."
      />
      <button type="submit">Search</button>
    </form>
    <h3>A list of genres</h3>
    <ul className="genre-list">
      {genres = genres == undefined ? [] : genres
        .filter((genre) => genre.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((genre) => (
          <li
            key={genre}
            className={`genre-item ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => {
              fetchStations(genre);
              setSelectedGenre(genre);
            }}
          >
            {genre}
          </li>
        ))}
    </ul>
  </div>
);

export default GenreMenu;
