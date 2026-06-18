import { useState, useEffect } from "react";
import { useGetPopularMoviesQuery } from "../Features/showsSlice";
import { useGetPopularTvShowsQuery } from "../Features/showsSlice";
import { useGetTopRatedMoviesQuery } from "../Features/showsSlice";
import { useGetTopRatedTvShowsQuery } from "../Features/showsSlice";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Stack,
  Box,
  styled,
  Skeleton,
  Card,
  CardActionArea,
} from "@mui/material";
import * as React from "react";
import { lazy, Suspense } from "react";
import Carusel from "./Carusel";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
const HaveToSignupModal = lazy(() => import("./HaveToSignupModal"));

const Main = ({ user }) => {
  const navigate = useNavigate();

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
    }),
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
        <Stack spacing={4} sx={{ mt: 2 }}>
          {[1, 2].map((section) => (
            <Box key={section}>
              <Skeleton
                variant="text"
                width={220}
                height={45}
                sx={{ bgcolor: "rgba(255,255,255,0.08)", borderRadius: 1 }}
              />
              <Box sx={{ display: "flex", gap: 2, mt: 2, overflow: "hidden" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Box key={i} sx={{ minWidth: "18%" }}>
                    <Skeleton
                      variant="rounded"
                      width="100%"
                      height={280}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                      }}
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.06)",
                        mt: 1,
                        mx: "auto",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
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
                justifyContent: "center",
                gap: { xs: 2, sm: 4 },
                my: 5,
                flexWrap: "wrap",
                px: 2,
              }}
            >
              {[
                {
                  label: "Your Movies",
                  icon: <MovieIcon sx={{ fontSize: { xs: 40, md: 56 } }} />,
                  route: "/yourmovies",
                },
                {
                  label: "Your TV Shows",
                  icon: <TvIcon sx={{ fontSize: { xs: 40, md: 56 } }} />,
                  route: "/yourTvShows",
                },
              ].map((cta) => (
                <Card
                  key={cta.label}
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    width: { xs: "100%", sm: 280 },
                    maxWidth: 320,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "var(--basic-color)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={
                      user._id
                        ? () => navigate(cta.route)
                        : () => setOpenHaveToSignupModal(true)
                    }
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: { xs: 4, md: 6 },
                      gap: 2,
                      color: "var(--basic-color)",
                    }}
                  >
                    {cta.icon}
                    <StyledTitleTypography
                      variant="h4"
                      bigfont="32px"
                      smallfont="22px"
                      sx={{ textAlign: "center" }}
                    >
                      {cta.label}
                    </StyledTitleTypography>
                  </CardActionArea>
                </Card>
              ))}
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

          <Box sx={{ mb: 8 }}>
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
