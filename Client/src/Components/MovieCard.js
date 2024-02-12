import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const MovieCard = ({
  movie,
  movieRates,
  MovieRatings,
  user,
  toggle,
  AddToYourMovies,
  setOpenHaveToSignupModal,
}) => {
  // const theme = useTheme();

  return (


    <div className="movie-card">
    <div className="movie-poster">
      <img className="movie-img" src={movie.Poster} alt="movie-poster" />
    </div>
    <div className="card-body">
      <div className="movie-details">
        <h1>{movie.Title}</h1>{" "}
        <h3>
          {movie.Runtime == "1 min" ? "" : `${movie.Runtime}`}
          {"   "} {movie.Year}{" "}
        </h3>
        <h3>{movie.Genre}</h3>
        <h3>
          {movie.Director == "N/A" ? "" : `Director: ${movie.Director}`}
        </h3>
        <h3>Writer: {movie.Writer}</h3>
        <h3>Actors: {movie.Actors}</h3>
        <h4>Plot: {movie.Plot}</h4>{" "}
      </div>
      <div className="reviews">
        <div className="imdb rating">
          <a href={`https://www.imdb.com/title/${movie.imdbID}/`}>
            IMDB: {movie.imdbRating}
          </a>
        </div>
        <div>
        {movieRates && <MovieRatings movieRates={movieRates} />}
        </div>
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
                movie.Title,
                movie.Year,
                movie.Type,
                movie.Director == "N/A" ? "-" : movie.Director
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


{/* <Card sx={{ display: 'flex',flexWrap: 'wrap' }}>
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
    */}