import "../Styles/MovieSearch.scss";
import useQueryParams from "../Hooks/useQueryParams";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import useFetchData from "../Hooks/useFetchData";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Grid,
  Typography,
  Container,
  Stack,
  Pagination,
  PaginationItem,
  Box,
  Card,
  CardMedia,
  CardActions,
  Button,
  CardContent,
  Paper,
  styled,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const WatchlistTvShows = () => {
  const navigate = useNavigate();

  //   const params = useQueryParams();
  //   const movieTitle = params.get("title");
  //   const navigate = useNavigate();
  const [watchlistTvShows, setWatchlistTvShows] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   let user = useSelector((state) => state.user.value);
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const TvShowsPerPage = 10; // Number of movies per page
  const startIndex = (page - 1) * TvShowsPerPage;
  const endIndex = startIndex + TvShowsPerPage;
  //   useEffect(() => {
  //     if (!movieTitle) return null;
  //     axios
  //       .get(`http://localhost:3636/api/${movieTitle}`)
  //       .then(({ data }) => {
  //         console.log(data);
  //         setMovies(data.results);
  //       })
  //       .catch((err) => console.log(err))
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }, [movieTitle]);

  let user = useSelector((state) => state.user.value);

  const { data } = useFetchData(
    `http://localhost:3636/watchlist/tvShow/`,
    user._id
  );

  useEffect(() => {
    if (data) {
      console.log(data);
      const allWatchlistTvShows = data;
      setWatchlistTvShows(allWatchlistTvShows);
    }
    //   const moviesssIds = data.map((value) => +value.id);
    //   setMoviesIds(moviesssIds);
    //   if (moviesssIds.includes(+movieID)) setToggle(true);
    // }
  }, [data]);
  const displayedTvShows = watchlistTvShows.slice(startIndex, endIndex);

  console.log(watchlistTvShows);

  const removeWatchlistTvShow = async (id) => {
    try {
      await axios.delete(`http://localhost:3636/watchlist/TvShow/${id}`);
      setWatchlistTvShows((WatchlistTvShows) =>
        WatchlistTvShows.filter((TvShow) => TvShow._id !== id)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container>
      <Typography
        variant="h1"
        sx={{
          color: "var(--basic-color)",
          fontFamily: "Limelight",
          fontSize: "32px",
          marginBottom: "50px",
        }}
      >
        Your Tv Shows Watchlist:
      </Typography>
      <Box>
        <Grid
          container
          direction={"column"}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "100vh" }}
        >
          {displayedTvShows.map((watchlistTvShow) => (
            <Grid key={watchlistTvShow._id} item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  maxWidth: 745,
                  display: "flex",
                  backgroundColor: "#c2edda",
                }}
              >
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${watchlistTvShow.poster}`}
                  title={watchlistTvShow.title}
                  sx={{
                    height: 250,
                    objectFit: "contain",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    onClick={() => navigate(`/TvShow?id=${watchlistTvShow.id}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    {watchlistTvShow.name}
                  </Typography>
                  <Typography gutterBottom variant="h7" component="div">
                    Director: {watchlistTvShow.director}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {watchlistTvShow.plot}
                  </Typography>
                </CardContent>
                <CardActions>
                  <DeleteIcon
                    onClick={() => {
                      removeWatchlistTvShow(watchlistTvShow._id);
                    }}
                    sx={{ cursor: "pointer" }}
                  />
                  {/* <Button size="small">Share</Button>
                  <Button size="small">Learn More</Button> */}
                </CardActions>
              </Card>
            </Grid>
          ))}
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(watchlistTvShows.length / TvShowsPerPage)} // Calculate number of pages
              page={page}
              onChange={handleChange}
              size="large"
              shape="rounded"
              color="primary"
              boundaryCount={2}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  icon={
                    item.type === "previous" ? (
                      <ArrowBackIcon />
                    ) : (
                      <ArrowForwardIcon />
                    )
                  }
                />
              )}
              sx={{ marginTop: 5 }}
            />
          </Stack>
        </Grid>
      </Box>
    </Container>
  );
};

export default WatchlistTvShows;
