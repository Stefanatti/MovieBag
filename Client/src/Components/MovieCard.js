import * as React from "react";
import { useState, useEffect } from "react";
import TrailerModal from "./Modal";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MouseOverPopover from "../Components/PopOver";
import {
  Grid,
  Card,
  useMediaQuery,
  Typography,
  CardMedia,
  CardContent,
  Stack,
  Box,
  styled,
  Avatar,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { useTheme } from "@mui/material/styles";

const MovieCard = ({
  show,
  user,
  toggleForList,
  toggleForWatchlist,
  AddToYourShows,
  AddToYourWatchlist,
  setOpenHaveToSignupModal,
}) => {
  const [director, setDirector] = useState("");
  const [writer, setWriter] = useState("");
  const [actors, setActors] = useState("");
  const [movieYear, setMovieYear] = useState("");
  const [trailer, setTrailer] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
    setTrailer(
      movie.videos.results.filter(
        (video) =>
          (video.type === "Trailer" &&
            video.site === "YouTube" &&
            video.name.includes("Official")) ||
          video.name.includes("Trailer")
      )
    );
  }, [movie]);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverOpen2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handlePopoverClose2 = () => {
    setAnchorEl2(null);
  };

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);

  return (
    <>
      <Card
        sx={{
          background: "var(--main-card-color)",
          borderRadius: "12px",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Grid container direction={isSmallScreen ? "column" : "row"}>
          <Grid item xs={4} sm={6} md={4}>
            <CardMedia
              component="img"
              max-height="444"
              image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt="Show Image"
            />
          </Grid>
          <Grid item xs={8} sm={6} md={8}>
            <CardContent>
              <Stack spacing={1}>
                <Typography
                  variant="h2"
                  component="div"
                  sx={{
                    color: "rgb(234, 204, 231)",
                    fontFamily: "'Rubik', Sans-serif",
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
                        "::before": {
                          content: '"\\2022"',
                          marginRight: "0.5em",
                        },
                      }}
                    >
                      {genre.name}
                    </StyledTypography>
                  ))}
                </Box>
                <Box>
                  <Stack spacing={1}>
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
                  </Stack>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "20px",

                    alignItems: "baseline",
                    marginBottom: 5,
                  }}
                >
                  {user._id ? (
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
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                      >
                        {toggleForList ? (
                          <PlaylistAddCheckIcon sx={{ color: "white" }} />
                        ) : (
                          <ListIcon sx={{ color: "white" }} />
                        )}
                      </Avatar>
                      <Avatar
                        onClick={() => {
                          AddToYourWatchlist(
                            movie.id,
                            movie.title,
                            movieYear,
                            `movie`,
                            director == "N/A" ? "-" : `${director.name}`,
                            movie.poster_path,
                            movie.overview
                          );
                        }}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: "var(--basic-color)",
                          width: 60,
                          height: 60,
                          marginTop: 5,
                        }}
                        onMouseEnter={handlePopoverOpen2}
                        onMouseLeave={handlePopoverClose2}
                      >
                        {toggleForWatchlist ? (
                          <BookmarkAddedIcon sx={{ color: "white" }} />
                        ) : (
                          <BookmarkAddIcon sx={{ color: "white" }} />
                        )}
                      </Avatar>
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
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                      >
                        <ListIcon style={{ color: "white" }} />
                      </Avatar>

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
                        onMouseEnter={handlePopoverOpen2}
                        onMouseLeave={handlePopoverClose2}
                      >
                        <BookmarkAddIcon sx={{ color: "white" }} />
                      </Avatar>
                    </>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <PlayCircleIcon sx={{ color: "var(--basic-color)" }} />
                    <StyledTypography
                      variant={"h6"}
                      fontFamily={"lato"}
                      onClick={handleOpen}
                    >
                      Play Trailer
                    </StyledTypography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      <MouseOverPopover
        open={open}
        anchorEl={anchorEl}
        handlePopoverOpen={handlePopoverOpen}
        handlePopoverClose={handlePopoverClose}
        popOverText={toggleForList ? "In your List!" : "Add to list"}
      />
      <MouseOverPopover
        open={open2}
        anchorEl={anchorEl2}
        handlePopoverOpen={handlePopoverOpen2}
        handlePopoverClose={handlePopoverClose2}
        popOverText={
          toggleForWatchlist ? "In your Watchlist!" : "Add to Watchlist"
        }
      />
      <TrailerModal open={openModal} onClose={handleClose} trailer={trailer} />
    </>
  );
};

export default MovieCard;
