import * as React from "react";
// import { useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import SkipNextIcon from '@mui/icons-material/SkipNext';
import MovieRatings from "../Components/MovieRatings";

const MovieCard = ({
  movie,
  movieRates,
  user,
  toggle,
  AddToYourMovies,
  setOpenHaveToSignupModal,
}) => {
  // const findCrew = (job) => {
  //   const member = movie.credits.crew.find((obj) => obj.job === `${job}`);
  //   if (job === "Director") return member.name;
  //   else if (job === "Writer" || job === "Screenplay") return member.name;
  // };
  // console.log(findCrew(`Writer`));
  const director = movie.credits.crew.find((obj) => obj.job === "Director");
  const writer = movie.credits.crew.find((obj) => obj.department === "Writing");
  const actors = movie.credits.cast
    .map((obj) => obj.name)
    .slice(0, 4)
    .join(", ");
  const movieYear = movie.release_date.slice(0, 4);

  // console.log(actors);
  // console.log(movie.credits.cast);

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          className="movie-img"
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt="movie-poster"
        />
      </div>
      <div className="card-body">
        <div className="movie-details">
          <h1>{movie.title}</h1>{" "}
          <h3>
            {movie.runtime == "1 min" ? "" : `${movie.runtime} min`}
            {"   "} {movieYear}{" "}
          </h3>
          <h3>{movie.genres[0].name}</h3>
          <h3>{movie.director == "N/A" ? "" : `Director: ${director.name}`}</h3>
          <h3>Writer: {writer.name}</h3>
          <h3>Actors: {actors}</h3>
          <h4>Plot: {movie.overview}</h4>{" "}
        </div>
        <div className="reviews">
          <div className="imdb rating">
            <a href={`https://www.imdb.com/title/${movie.imdbID}/`}>
              IMDB: {movie.imdbRating}
            </a>
          </div>
          <div>{movieRates && <MovieRatings movieRates={movieRates} />}</div>
        </div>
        {user ? (
          <div className="button-div">
            <button
              style={
                toggle
                  ? { backgroundColor: " var(--movie-card-button-added)" }
                  : { backgroundColor: "var(--movie-card-button-add)" }
              }
              className="addMovie-button"
              onClick={() => {
                AddToYourMovies(
                  movie.id,
                  movie.title,
                  movieYear,
                  `movie`,
                  director == "N/A" ? "-" : `${director.name}`
                );
              }}
            >
              {toggle ? "In your movies!" : "Add to your movies"}
            </button>
          </div>
        ) : (
          <div className="button-div">
            <button
              style={{ backgroundColor: "var(--movie-card-button-add)" }}
              className="addMovie-button"
              onClick={() => {
                setOpenHaveToSignupModal(true);
              }}
            >
              Add to your movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

{
  /* <Card sx={{ display: 'flex',flexWrap: 'wrap' }}>
<CardMedia
        component="img"
        sx={{ maxWidth: 115 }}
        image={movie.Poster}
        alt="Live from space album cover"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto',minWidth: 400 }}>
          <Typography component="div" variant="h5">
            Live From Space
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            Mac Miller
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </Box>
      </Box>
      
    </Card>
    */
}
