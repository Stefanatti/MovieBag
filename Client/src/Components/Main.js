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

  // useEffect(() => {
  //   console.log("Component mounted");

  //   const loadMovies = async () => {
  //     try {
  //       console.log("Starting API calls");

  //       // Wait for all queries to complete
  //       await Promise.all([
  //         new Promise((resolve) => setTimeout(resolve, 5000)), // Add a small delay
  //         popularMovies,
  //         popularTvShows,
  //         topRatedMovies,
  //         topRatedTvShows,
  //       ]);

  //       console.log("API calls completed");

  //       if (
  //         !isPopularMoviesLoading &&
  //         !isPopularTvShowsLoading &&
  //         !isTopRatedMoviesLoading &&
  //         !isTopRatedTvShowsLoading
  //       ) {
  //         console.log("All data loaded successfully");
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("Error loading movies:", error);
  //       setLoading(false); // Ensure loading state is cleared even on error
  //     }
  //   };

  //   loadMovies();
  // }, [
  //   isPopularMoviesLoading,
  //   isPopularTvShowsLoading,
  //   isTopRatedMoviesLoading,
  //   isTopRatedTvShowsLoading,
  // ]);

  // const {
  //   data: popularMovies,
  //   isLoading: isPopularMoviesLoading,
  //   error: popularMoviesError,
  // } = useGetPopularMoviesQuery();

  // const {
  //   data: popularTvShows,
  //   isLoading: isPopularTvShowsLoading,
  //   error: popularTvShowsError,
  // } = useGetPopularTvShowsQuery();

  // const {
  //   data: topRatedMovies,
  //   isLoading: isTopRatedMoviesLoading,
  //   error: topRatedMoviesError,
  // } = useGetTopRatedMoviesQuery();

  // const {
  //   data: topRatedTvShows,
  //   isLoading: isTopRatedTvShowsLoading,
  //   error: topRatedTvShowsError,
  // } = useGetTopRatedTvShowsQuery();

  // useEffect(() => {
  //   if (
  //     !isPopularMoviesLoading &&
  //     !isPopularTvShowsLoading &&
  //     !isTopRatedMoviesLoading &&
  //     !isTopRatedTvShowsLoading
  //   ) {
  //     if (
  //       popularMoviesError ||
  //       popularTvShowsError ||
  //       topRatedMoviesError ||
  //       topRatedTvShowsError
  //     ) {
  //       // Handle error state
  //       setError(new Error("One or more queries failed"));
  //       setLoading(false);
  //     } else {
  //       // Data successfully loaded
  //       setError(null);
  //       setLoading(false);
  //       console.log(
  //         "Received Data:",
  //         popularMovies,
  //         popularTvShows,
  //         topRatedMovies,
  //         topRatedTvShows
  //       );
  //     }
  //   }
  // }, [
  //   isPopularMoviesLoading,
  //   isPopularTvShowsLoading,
  //   isTopRatedMoviesLoading,
  //   isTopRatedTvShowsLoading,
  //   popularMoviesError,
  //   popularTvShowsError,
  //   topRatedMoviesError,
  //   topRatedTvShowsError,
  //   popularMovies,
  //   popularTvShows,
  //   topRatedMovies,
  //   topRatedTvShows,
  // ]);

  console.log(
    "Received Data:",
    popularMovies,
    popularTvShows,
    topRatedMovies,
    topRatedTvShows
  );

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
            <Stack spacing={2}>
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
            <Stack spacing={2}>
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
