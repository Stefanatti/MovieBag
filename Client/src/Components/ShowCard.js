import * as React from "react";
import { useState, useEffect } from "react";
import TrailerModal from "./Modal";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MouseOverPopover from "./PopOver";

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

const ShowCard = ({
  show,
  user,
  toggleForList,
  toggleForWatchlist,
  AddToYourShows,
  AddToYourWatchlist,
  setOpenHaveToSignupModal,
}) => {
  const [director, setDirector] = useState("");
  const [creator, setCreator] = useState("");
  const [writer, setWriter] = useState("");
  const [actors, setActors] = useState("");
  const [showYear, setShowYear] = useState("");
  const [trailer, setTrailer] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const StyledTypography = styled(Typography)(({ variant, fontFamily }) => ({
    fontFamily: "Montserrat, Sans-serif",
    variant: { variant },
    color: "rgb(234, 204, 231)",
    textShadow: `0 3 10 rgba(0, 0, 0, 0.7)`,
  }));

  useEffect(() => {
    setDirector(show.credits?.crew.find((obj) => obj.job === "Director"));
    setCreator(show.created_by?.map((obj) => obj.name).join(", "));
    setWriter(
      show.credits.crew
        .filter((obj) => obj.job === "Writer" || obj.job === "Screenplay")
        .map((writer) => writer.name)
        .join(", ")
    );
    setActors(
      show.credits.cast
        .map((obj) => obj.name)
        .slice(0, 4)
        .join(", ")
    );
    setShowYear(
      show.release_date
        ? show.release_date.slice(0, 4)
        : show.first_air_date.slice(0, 4)
    );
    setTrailer(
      show.videos.results.filter(
        (video) =>
          (video.type === "Trailer" &&
            video.site === "YouTube" &&
            video.name.includes("Official")) ||
          video.name.includes("Trailer")
      )
    );
  }, [show]);

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
              image={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
              alt="Show Image"
            />
          </Grid>
          <Grid item xs={8} sm={6} md={8}>
            <CardContent>
              <Stack spacing={1}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    color: "rgb(234, 204, 231)",
                    fontFamily: "Montserrat, Sans-serif",

                    fontWeight: 500,
                    textShadow: "0 3 10 rgba(0, 0, 0, 0.7)",
                  }}
                >
                  {show.title ? show.title : show.name}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    alignContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <StyledTypography variant={"h4"}>
                    {showYear}{" "}
                  </StyledTypography>
                  <StyledTypography variant={"h5"}>
                    {show.runtime
                      ? `${show.runtime} min`
                      : `Seasons: ${show.number_of_seasons}`}
                  </StyledTypography>
                  {show.imdb_id && (
                    <a
                      href={`https://www.imdb.com/title/${show.imdb_id}/?ref_=fn_al_tt_1`}
                    >
                      <StyledTypography
                        sx={{ color: "gold", underLine: "none" }}
                        variant={"body1"}
                        component="span"
                      >
                        IMDB
                      </StyledTypography>
                    </a>
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: "8px" }}>
                  {show.genres.map((genre, index) => (
                    <StyledTypography
                      key={index}
                      variant={"h6"}
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
                    <StyledTypography variant={"h5"}>
                      {director
                        ? ` Director: ${director.name}`
                        : ` Creator: ${creator}`}
                    </StyledTypography>
                    {writer && (
                      <StyledTypography variant={"h5"}>
                        {` Writer: ${writer}`}{" "}
                      </StyledTypography>
                    )}
                    <StyledTypography variant={"h6"}>
                      {` Actors: ${actors}`}{" "}
                    </StyledTypography>
                    <StyledTypography variant={"h7"}>
                      {`${show.overview}`}{" "}
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
                          show.title
                            ? AddToYourShows(
                                show.id,
                                show.title,
                                showYear,
                                `movie`,
                                director == "N/A" ? "-" : `${director.name}`
                              )
                            : AddToYourShows(
                                show.id,
                                show.name,
                                showYear,
                                `Tv Show`,
                                creator == "N/A" ? "-" : `${creator}`
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
                          show.title
                            ? AddToYourWatchlist(
                                show.id,
                                show.title,
                                showYear,
                                `movie`,
                                director == "N/A" ? "-" : `${director.name}`
                              )
                            : AddToYourWatchlist(
                                show.id,
                                show.name,
                                showYear,
                                `Tv Show`,
                                creator == "N/A" ? "-" : `${creator}`,
                                show.poster_path,
                                show.overview
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
                    <StyledTypography variant={"h6"} onClick={handleOpen}>
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

export default ShowCard;
