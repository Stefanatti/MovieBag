import * as React from "react";
import { useState, useEffect } from "react";

import {
  Grid,
  Typography,
  Container,
  Stack,
  Box,
  Paper,
  styled,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import MovieRatings from "../Components/MovieRatings";

const MovieCard = ({
  movie,
  movieRates,
  user,
  toggle,
  AddToYourMovies,
  setOpenHaveToSignupModal,
}) => {
  const [director, setDirector] = useState("");
  const [writer, setWriter] = useState("");
  const [actors, setActors] = useState("");
  const [movieYear, setMovieYear] = useState("");

  // console.log(movie);

  const StyledTypography = styled(Typography)(({ variant, fontFamily }) => ({
    fontFamily: { fontFamily },
    variant: { variant },
    color: "rgb(234, 204, 231)",
    textShadow: `0 3 10 rgba(0, 0, 0, 0.7)`,
  }));

  useEffect(() => {
    setDirector(movie.credits.crew.find((obj) => obj.job === "Director"));
    setWriter(
      movie.credits.crew
        .filter((obj) => obj.job === "Writer" || obj.job === "Screenplay")
        .map((writer) => writer.name)
        .join(", ")
    );
    setActors(
      movie.credits.cast
        .map((obj) => obj.name)
        .slice(0, 4)
        .join(", ")
    );
    setMovieYear(movie.release_date.slice(0, 4));
  }, [movie]);

  return (
    <Grid container>
      <Grid item xs={12} sm={4}>
        <Paper
          sx={{
            height: { xs: 400, sm: 650, md: 650, lg: 650 },
            backgroundImage: `url(${`https://image.tmdb.org/t/p/w500/${movie.poster_path}`})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "2px solid grey",
          }}
        ></Paper>
      </Grid>

      <Grid item xs={12} sm={8}>
        <Paper
          sx={{
            minHeight: 650,
            background: "var(--main-card-color)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container>
            <Stack spacing={1} direction={"column"}>
              <Typography
                variant="h2"
                sx={{
                  color: "rgb(234, 204, 231)",
                  fontFamily: "'Rubik', Sans-serif",
                  margin: "0",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  textShadow: "0 3 10 rgba(0, 0, 0, 0.7)",
                }}
              >
                {movie.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  alignContent: "flex-end",
                  gap: "10px",
                }}
              >
                <StyledTypography variant={"h4"} fontFamily={"lato"}>
                  {movieYear}{" "}
                </StyledTypography>
                <StyledTypography variant={"h5"} fontFamily={"lato"}>
                  {`${movie.runtime} min`}{" "}
                </StyledTypography>
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}/?ref_=fn_al_tt_1`}
                >
                  <StyledTypography
                    sx={{ color: "gold", underLine: "none" }}
                    variant={"body1"}
                    fontFamily={"lato"}
                    component="span"
                  >
                    IMDB
                  </StyledTypography>
                </a>
              </Box>
              <Box sx={{ display: "flex", gap: "8px" }}>
                {movie.genres.map((genre, index) => (
                  <StyledTypography
                    key={index}
                    variant={"h6"}
                    fontFamily={"lato"}
                    sx={{
                      listStyleType: "none",
                      "::before": { content: '"\\2022"', marginRight: "0.5em" },
                    }}
                  >
                    {genre.name}
                  </StyledTypography>
                ))}
              </Box>
              <StyledTypography variant={"h5"} fontFamily={"lato"}>
                {` Director: ${director.name}`}{" "}
              </StyledTypography>
              <StyledTypography variant={"h5"} fontFamily={"lato"}>
                {` Writer: ${writer}`}{" "}
              </StyledTypography>
              <StyledTypography variant={"h6"} fontFamily={"lato"}>
                {` Actors: ${actors}`}{" "}
              </StyledTypography>
              <StyledTypography variant={"h7"} fontFamily={"lato"}>
                {`${movie.overview}`}{" "}
              </StyledTypography>

              <Box sx={{ display: "flex" }}>
                {user ? (
                  <>
                    <Avatar
                      onClick={() => {
                        AddToYourMovies(
                          movie.id,
                          movie.title,
                          movieYear,
                          `movie`,
                          director == "N/A" ? "-" : `${director.name}`
                        );
                      }}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: "var(--basic-color)",
                        width: 60,
                        height: 60,
                        marginTop: 5,
                      }}
                    >
                      {toggle ? (
                        <PlaylistAddCheckIcon sx={{ color: "white" }} />
                      ) : (
                        <ListIcon sx={{ color: "white" }} />
                      )}
                    </Avatar>

                    <Typography variant="body1" component="span"></Typography>
                  </>
                ) : (
                  <>
                    <Avatar
                      onClick={() => {
                        setOpenHaveToSignupModal(true);
                      }}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: "var(--basic-color)",
                        width: 60,
                        height: 60,
                        marginTop: 5,
                      }}
                    >
                      <ListIcon style={{ color: "white" }} />
                    </Avatar>

                    <Typography variant="body1" component="span"></Typography>
                  </>
                )}
              </Box>
            </Stack>
          </Container>
        </Paper>
      </Grid>
    </Grid>
    // <Paper

    //   elevation={3}
    //   sx={{
    //     display: "flex",
    //     flexWrap: "wrap",
    //     backgroundColor: "white",
    //     m: 4,
    //     minWidth: "90%",
    //     height: 550,
    //   }}
    // >
    //   <Box sx={{ backgroundColor: "red", width: "30%" }}></Box>
    //   <Box sx={{ backgroundColor: "green", width: "70%" }}></Box>
    // </Paper>
  );
};

export default MovieCard;

{
  /* <div className="movie-card">
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
</div> */
}
