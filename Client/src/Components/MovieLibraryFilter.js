import React from 'react';

function MovieLibraryFilter({setSearch, search}) {
 
return (
   <form
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
            </form>     
)
}
   

export default MovieLibraryFilter;
