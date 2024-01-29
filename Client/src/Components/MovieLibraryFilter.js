import React from 'react';
import { SearchOutlined } from "@ant-design/icons";

function MovieLibraryFilter({setMyMovies,myMovies,setSearch, search, filterFunction}) {

    // const filterMovies = () => {
    //     setMyMovies( 
    //       myMovies.filter((myMovie) => {
    //         return search.toLowerCase() === ""
    //           ? myMovie
    //           : myMovie.title.toLowerCase().includes(search);
    //       })
    //     );
    //   };
    
    //   const filterDirectors = () => {
    //     setMyMovies(
    //       myMovies.filter((myMovie) => {
    //         return search.toLowerCase() === ""
    //           ? myMovie
    //           : myMovie.director.toLowerCase().includes(search);
    //       })
    //     );
    //   };

    return (
        <div>
            <form
              onChange={() => {filterFunction()}}
              className="d-flex"
              role="search"
            >
              <input
                onChange={(e) => setSearch(e.target.value)}
                className="form-control me-2 search"
                value={search}
                type="text"
                placeholder="Search for a movie"
                aria-label="Search"
                title="Type in a name"
              />

              <button className="btn nav-link" type="submit">
                <SearchOutlined className="search-icon" />
              </button>
            </form>
            
        </div>
    );
}

export default MovieLibraryFilter;