const MoviesResultCards = ({ movies, navigate }) => {
  return (
    <div className="cards-container">
      {movies ? (
        movies.map((movie) => {
          return (
            <div
              key={movie.id}
              className="movie-cards"
              onClick={() => navigate(`/movie?id=${movie.id}`)}
            >
              {movie.Poster !== "N/A" ? (
                <div className="movie-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt="poster"
                  />
                </div>
              ) : (
                ""
              )}
              <div className="card-bodies">
                <div className="movie-details-div">
                  <h1 className="movie-title">Movie: {movie.title}</h1>
                  <h3>{movie.release_date}</h3>
                  {/* <h5>{movie.Type}</h5> */}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-results-label">
          <h1>No results found</h1>
        </div>
      )}
    </div>
  );
};

export default MoviesResultCards;
