import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HaveToSignupModal from "./HaveToSignupModal";
import {
  Grid,
  Typography,
  Container,
  Stack,
  Box,
  styled,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import Poster from "./Poster";
import axios from "axios";
import Carusel from "./Carusel";
const Main = ({ user }) => {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_URL;
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTvShows, setPopularTvShows] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState([]);

  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const StyledTitleTypography = styled(Typography)(
    ({ variant, theme, bigfont, smallfont }) => ({
      variant,
      color: "var(--basic-color)",
      fontFamily: "Limelight",
      fontSize: bigfont,
      overflow: "hidden",
      [theme.breakpoints.down("md")]: {
        fontSize: smallfont,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
    })
  );

  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        const response = await axios.get(`${url}/api/popular`);
        //console.log(response.data);
        setPopularMovies(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPopularMovies();
  }, []);

  useEffect(() => {
    const getPopularTvShows = async () => {
      try {
        const response = await axios.get(`${url}/api/tv/popular`);
        //console.log(response.data);
        setPopularTvShows(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPopularTvShows();
  }, []);

  useEffect(() => {
    const getTopRatedMovies = async () => {
      try {
        const response = await axios.get(`${url}/api/toprated`);
        //console.log(response.data);
        setTopRatedMovies(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getTopRatedMovies();
  }, []);

  useEffect(() => {
    const getTopRatedTvShows = async () => {
      try {
        const response = await axios.get(`${url}/api/tv/toprated`);
        //console.log(response.data);
        setTopRatedTvShows(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getTopRatedTvShows();
  }, []);

  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>
        <Box>
          <Stack spacing={2}>
            <StyledTitleTypography variant="h5" bigfont="34px" smallfont="22px">
              Popular Movies:
            </StyledTitleTypography>
            <Box>
              <Carusel data={popularMovies} path={`/movie?id=`} />
            </Box>
          </Stack>
        </Box>

        <Box>
          <Stack spacing={2}>
            <StyledTitleTypography variant="h5" bigfont="34px" smallfont="22px">
              Popular Tv Shows:
            </StyledTitleTypography>
            <Box>
              <Carusel data={popularTvShows} path={`/tvShow?id=`} />
            </Box>
          </Stack>
        </Box>
        <Stack spacing={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              my: 5,
            }}
          >
            <Box>
              <StyledTitleTypography
                sx={{ cursor: "pointer" }}
                variant="h1"
                bigfont="72px"
                smallfont="32px"
                onClick={
                  user._id
                    ? () => navigate(`/yourmovies`)
                    : () => {
                        setOpenHaveToSignupModal(true);
                      }
                }
              >
                Your <br /> Movies
              </StyledTitleTypography>
            </Box>
            <Box>
              <StyledTitleTypography
                sx={{ cursor: "pointer" }}
                variant="h1"
                bigfont="72px"
                smallfont="32px"
                onClick={
                  user._id
                    ? () => navigate(`/yourTvShows`)
                    : () => {
                        setOpenHaveToSignupModal(true);
                      }
                }
              >
                Your <br /> TV Shows
              </StyledTitleTypography>
            </Box>
          </Box>
        </Stack>

        <Box>
          <Stack spacing={2}>
            <StyledTitleTypography variant="h5" bigfont="34px" smallfont="22px">
              Top Rated Movies:
            </StyledTitleTypography>
            <Box>
              <Carusel data={topRatedMovies} path={`/movie?id=`} />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ "& .css-1p5q5e5-MuiStack-root": { marginBottom: "100px" } }}>
          <Stack spacing={2}>
            <StyledTitleTypography variant="h5" bigfont="34px" smallfont="22px">
              Top Rated Tv Shows:
            </StyledTitleTypography>
            <Box>
              <Carusel data={topRatedTvShows} path={`/tvShow?id=`} />
            </Box>
          </Stack>
        </Box>

        <HaveToSignupModal
          open={openHaveToSignupModal}
          onClose={() => {
            setOpenHaveToSignupModal(false);
          }}
        />
      </Stack>
    </Container>
  );
};

export default Main;
