import { useState, useEffect } from "react";
import { useGetPopularMoviesQuery } from "../Features/showsSlice";
import { useGetPopularTvShowsQuery } from "../Features/showsSlice";
import { useGetTopRatedMoviesQuery } from "../Features/showsSlice";
import { useGetTopRatedTvShowsQuery } from "../Features/showsSlice";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { Typography, Container, Stack, Box, styled } from "@mui/material";
import * as React from "react";
import { lazy, Suspense } from "react";
import Carusel from "./Carusel";
const HaveToSignupModal = lazy(() => import("./HaveToSignupModal"));

const Main = ({ user }) => {
  const navigate = useNavigate();

  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const {
    data: popularMovies,
    isLoading: isPopularMoviesLoading,
    error: popularMoviesError,
  } = useGetPopularMoviesQuery("movieApi", {
    pollingInterval: 24 * 60 * 60 * 1000,
  });

  const {
    data: popularTvShows,
    isLoading: isPopularTvShowsLoading,
    error: popularTvShowsError,
  } = useGetPopularTvShowsQuery("movieApi", {
    pollingInterval: 24 * 60 * 60 * 1000,
  });
  const {
    data: topRatedMovies,
    isLoading: isTopRatedMoviesLoading,
    error: topRatedMoviesError,
  } = useGetTopRatedMoviesQuery("movieApi", {
    pollingInterval: 24 * 60 * 60 * 1000,
  });

  const {
    data: topRatedTvShows,
    isLoading: isTopRatedTvShowsLoading,
    error: topRatedTvShowsError,
  } = useGetTopRatedTvShowsQuery("movieApi", {
    pollingInterval: 24 * 60 * 60 * 1000,
  });

  useEffect(() => {
    const loadMovies = async () => {
      if (
        !isPopularMoviesLoading &&
        !isPopularTvShowsLoading &&
        !isTopRatedMoviesLoading &&
        !isTopRatedTvShowsLoading
      ) {
        setLoading(false);
      }
    };
    loadMovies();
  }, [
    isPopularMoviesLoading,
    isPopularTvShowsLoading,
    isTopRatedMoviesLoading,
    isTopRatedTvShowsLoading,
  ]);

  return (
    <Container maxWidth="xl">
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
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
          <StyledTitleTypography sx={{ textAlign: "center" }}>
            {" "}
            Please note, this may take a minute as we're fetching the latest
            movie data for the first time.
            <br /> Thank you for your patience!
          </StyledTitleTypography>
        </Box>
      ) : (
        <Stack spacing={2}>
          <Box>
            <Stack spacing={3}>
              <StyledTitleTypography
                variant="h5"
                bigfont="34px"
                smallfont="22px"
              >
                Popular Movies:
              </StyledTitleTypography>
              <Box>
                <Carusel
                  data={popularMovies}
                  error={popularMoviesError}
                  loading={isPopularMoviesLoading}
                  path={`/movie?id=`}
                />
              </Box>
            </Stack>
          </Box>

          <Box>
            <Stack spacing={5}>
              <StyledTitleTypography
                variant="h5"
                bigfont="34px"
                smallfont="22px"
              >
                Popular Tv Shows:
              </StyledTitleTypography>
              <Box>
                <Carusel
                  data={popularTvShows}
                  error={popularTvShowsError}
                  loading={isPopularTvShowsLoading}
                  path={`/tvShow?id=`}
                />
              </Box>
            </Stack>
          </Box>
          <Stack spacing={3}>
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
            <Stack spacing={5}>
              <StyledTitleTypography
                variant="h5"
                bigfont="34px"
                smallfont="22px"
              >
                Top Rated Movies:
              </StyledTitleTypography>
              <Box>
                <Carusel
                  data={topRatedMovies}
                  loading={isTopRatedMoviesLoading}
                  error={topRatedMoviesError}
                  path={`/movie?id=`}
                />
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{ "& .css-1p5q5e5-MuiStack-root": { marginBottom: "100px" } }}
          >
            <Stack spacing={5}>
              <StyledTitleTypography
                variant="h5"
                bigfont="34px"
                smallfont="22px"
              >
                Top Rated Tv Shows:
              </StyledTitleTypography>
              <Box>
                <Carusel
                  data={topRatedTvShows}
                  error={topRatedTvShowsError}
                  loading={isTopRatedTvShowsLoading}
                  path={`/tvShow?id=`}
                />
              </Box>
            </Stack>
          </Box>
          <Suspense>
            <HaveToSignupModal
              open={openHaveToSignupModal}
              onClose={() => {
                setOpenHaveToSignupModal(false);
              }}
            />
          </Suspense>
        </Stack>
      )}
    </Container>
  );
};

export default Main;
