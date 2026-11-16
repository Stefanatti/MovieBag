import { useMemo } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import {
  useGetPopularMoviesQuery,
  useGetPopularTvShowsQuery,
  useGetTopRatedMoviesQuery,
  useGetTopRatedTvShowsQuery,
} from "../Features/showsSlice";
import HomeHero from "./Home/HomeHero";
import QuickAccess from "./Home/QuickAccess";
import DiscoverWall from "./Home/DiscoverWall";

const DAY = 24 * 60 * 60 * 1000;

const withType = (data, mediaType) =>
  (Array.isArray(data) ? data : [])
    .filter((item) => item && item.poster_path)
    .map((item) => ({ ...item, mediaType }));

const Main = ({ user }) => {
  const popularMovies = useGetPopularMoviesQuery("movieApi", { pollingInterval: DAY });
  const popularTvShows = useGetPopularTvShowsQuery("movieApi", { pollingInterval: DAY });
  const topRatedMovies = useGetTopRatedMoviesQuery("movieApi", { pollingInterval: DAY });
  const topRatedTvShows = useGetTopRatedTvShowsQuery("movieApi", { pollingInterval: DAY });
  const queries = [popularMovies, popularTvShows, topRatedMovies, topRatedTvShows];

  const lists = useMemo(
    () => ({
      popular: {
        movie: withType(popularMovies.data, "movie"),
        tv: withType(popularTvShows.data, "tv"),
      },
      top: {
        movie: withType(topRatedMovies.data, "movie"),
        tv: withType(topRatedTvShows.data, "tv"),
      },
    }),
    [popularMovies.data, popularTvShows.data, topRatedMovies.data, topRatedTvShows.data],
  );

  // Feature the top trending titles that have artwork wide enough for the hero.
  const heroItems = useMemo(() => {
    const movies = lists.popular.movie.filter((item) => item.backdrop_path).slice(0, 3);
    const shows = lists.popular.tv.filter((item) => item.backdrop_path).slice(0, 2);
    return [movies[0], shows[0], movies[1], shows[1], movies[2]].filter(Boolean);
  }, [lists]);

  return (
    <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 10 } }}>
      <Typography
        component="h1"
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        MovieBag — discover movies and TV shows
      </Typography>
      <Stack spacing={{ xs: 4, md: 6 }}>
        <HomeHero
          items={heroItems}
          loading={popularMovies.isLoading || popularTvShows.isLoading}
        />
        <QuickAccess user={user} />
        <Box>
          <DiscoverWall
            lists={lists}
            loading={queries.some((query) => query.isLoading)}
            error={queries.some((query) => query.error)}
            onRetry={() => queries.filter((query) => query.error).forEach((query) => query.refetch())}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default Main;
