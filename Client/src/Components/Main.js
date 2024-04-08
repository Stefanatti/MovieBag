import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HaveToSignupModal from "./HaveToSignupModal";
import ClipLoader from "react-spinners/ClipLoader";
import { Typography, Container, Stack, Box, styled } from "@mui/material";
import * as React from "react";
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
  const [loading, setLoading] = useState(true);

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
    const fetchShowsData = async () => {
      try {
        const [
          popularMoviesResponse,
          popularTvShowsResponse,
          topRatedMoviesResponse,
          topRatedTvShowsResponse,
        ] = await Promise.all([
          axios.get(`${url}/api/popular`),
          axios.get(`${url}/api/tv/popular`),
          axios.get(`${url}/api/toprated`),
          axios.get(`${url}/api/tv/toprated`),
        ]);

        setPopularMovies(popularMoviesResponse.data);
        setPopularTvShows(popularTvShowsResponse.data);
        setTopRatedMovies(topRatedMoviesResponse.data);
        setTopRatedTvShows(topRatedTvShowsResponse.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false); // Ensure loading state is updated even if an error occurs
      }
    };

    fetchShowsData();
  }, []);

  return (
    <Container maxWidth="lg">
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ClipLoader
            color={"  var(--basic-color)"}
            className="loading"
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      ) : (
        <Stack spacing={2}>
          <Box>
            <Stack spacing={2}>
              <StyledTitleTypography
                variant="h5"
                bigfont="34px"
                smallfont="22px"
              >
                Popular Movies:
              </StyledTitleTypography>
              <Box>
                <Carusel data={popularMovies} path={`/movie?id=`} />
              </Box>
            </Stack>
          </Box>

          <Box>
            <Stack spacing={2}>
              <StyledTitleTypography
                variant="h5"
                bigfont="34px"
                smallfont="22px"
              >
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
              <StyledTitleTypography
                variant="h5"
                bigfont="34px"
                smallfont="22px"
              >
                Top Rated Movies:
              </StyledTitleTypography>
              <Box>
                <Carusel data={topRatedMovies} path={`/movie?id=`} />
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{ "& .css-1p5q5e5-MuiStack-root": { marginBottom: "100px" } }}
          >
            <Stack spacing={2}>
              <StyledTitleTypography
                variant="h5"
                bigfont="34px"
                smallfont="22px"
              >
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
      )}
    </Container>
  );
};

export default Main;
