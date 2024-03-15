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

const TvShowCard = ({
  tvShow,
  movieRates,
  user,
  toggle,
  AddToYourTvShows,
  setOpenHaveToSignupModal,
}) => {
  const [creator, setCreator] = useState("");
  const [writer, setWriter] = useState("");
  const [actors, setActors] = useState("");
  const [tvShowYear, setTvShowYear] = useState("");

  const StyledTypography = styled(Typography)(({ variant, fontFamily }) => ({
    fontFamily: { fontFamily },
    variant: { variant },
    color: "rgb(234, 204, 231)",
    textShadow: `0 3 10 rgba(0, 0, 0, 0.7)`,
  }));

  useEffect(() => {
    setCreator(tvShow.created_by.map((obj) => obj.name).join(", "));
    setActors(
      tvShow.credits.cast
        .map((obj) => obj.name)
        .slice(0, 4)
        .join(", ")
    );
    setTvShowYear(tvShow.first_air_date.slice(0, 4));
  }, [tvShow]);

  return (
    <Grid container>
      <Grid item xs={12} sm={4}>
        <Paper
          sx={{
            height: { xs: 400, sm: 650, md: 650, lg: 650 },
            backgroundImage: `url(${`https://image.tmdb.org/t/p/w500/${tvShow.poster_path}`})`,
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
                {tvShow.name}
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
                  {tvShowYear}{" "}
                </StyledTypography>
                <StyledTypography variant={"h5"} fontFamily={"lato"}>
                  {`Seasons: ${tvShow.number_of_seasons}`}{" "}
                </StyledTypography>
                {/* <a
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
                </a> */}
              </Box>
              <Box sx={{ display: "flex", gap: "8px" }}>
                {tvShow.genres.map((genre, index) => (
                  <StyledTypography
                    key={genre.id}
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
                {` Creator: ${creator}`}{" "}
              </StyledTypography>
              {/* <StyledTypography variant={"h5"} fontFamily={"lato"}>
                {` Writer: ${writer}`}{" "}
              </StyledTypography> */}
              <StyledTypography variant={"h6"} fontFamily={"lato"}>
                {` Actors: ${actors}`}{" "}
              </StyledTypography>
              <StyledTypography variant={"h7"} fontFamily={"lato"}>
                {`${tvShow.overview}`}{" "}
              </StyledTypography>

              <Box sx={{ display: "flex" }}>
                {user ? (
                  <>
                    <Avatar
                      onClick={() => {
                        AddToYourTvShows(
                          tvShow.id,
                          tvShow.name,
                          tvShowYear,
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
  );
};

export default TvShowCard;
