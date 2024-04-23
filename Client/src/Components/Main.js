import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPopularMovies } from "../Features/popularMovies";
import { fetchPopularTvShows } from "../Features/popularTvShows";
import { fetchTopRatedMovies } from "../Features/topRatedMovies";
import { fetchTopRatedTvShows } from "../Features/topRatedTvShows";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { Typography, Container, Stack, Box, styled } from "@mui/material";
import * as React from "react";
import { lazy, Suspense } from "react";
const Carusel = lazy(() => import("./Carusel"));
const HaveToSignupModal = lazy(() => import("./HaveToSignupModal"));

const Main = ({ user }) => {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_URL;

  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

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

  const popularMovies = useSelector(
    (state) => state.popularMovies.popularMovies
  );
  const popularTvShows = useSelector(
    (state) => state.popularTvShows.popularTvShows
  );
  const topRatedMovies = useSelector(
    (state) => state.topRatedMovies.topRatedMovies
  );
  const topRatedTvShows = useSelector(
    (state) => state.topRatedTvShows.topRatedTvShows
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (popularMovies.length === 0) dispatch(fetchPopularMovies());
        if (popularTvShows.length === 0) dispatch(fetchPopularTvShows());
        if (topRatedMovies.length === 0) dispatch(fetchTopRatedMovies());
        if (topRatedTvShows.length === 0) dispatch(fetchTopRatedTvShows());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

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
                <Suspense>
                  <Carusel data={popularMovies} path={`/movie?id=`} />
                </Suspense>
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
                <Suspense>
                  <Carusel data={popularTvShows} path={`/tvShow?id=`} />
                </Suspense>
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
                <Suspense>
                  <Carusel data={topRatedMovies} path={`/movie?id=`} />
                </Suspense>
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
                <Suspense>
                  <Carusel data={topRatedTvShows} path={`/tvShow?id=`} />
                </Suspense>
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
