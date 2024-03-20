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
const WatchlistMovies = () => {
  const navigate = useNavigate();

  //   const params = useQueryParams();
  //   const movieTitle = params.get("title");
  //   const navigate = useNavigate();
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   let user = useSelector((state) => state.user.value);

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
    `http://localhost:3636/watchlist/movie/`,
    user._id
  );

  useEffect(() => {
    if (data) {
      console.log(data);
      const allWatchlistMovies = data;
      setWatchlistMovies(allWatchlistMovies);
    }
    //   const moviesssIds = data.map((value) => +value.id);
    //   setMoviesIds(moviesssIds);
    //   if (moviesssIds.includes(+movieID)) setToggle(true);
    // }
  }, [data]);
  console.log(watchlistMovies);

  const removeWatchlistMovie = async (id) => {
    try {
      await axios.delete(`http://localhost:3636/watchlist/movie/${id}`);
      setWatchlistMovies((WatchlistMovies) =>
        WatchlistMovies.filter((movie) => movie._id !== id)
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
        Your Movies Watchlist:
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
          {watchlistMovies.map((watchlistMovie) => (
            <Grid key={watchlistMovie._id} item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  maxWidth: 745,
                  display: "flex",
                  backgroundColor: "#c2edda",
                }}
              >
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${watchlistMovie.poster}`}
                  title={watchlistMovie.title}
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
                    onClick={() => navigate(`/movie?id=${watchlistMovie.id}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    {watchlistMovie.title}
                  </Typography>
                  <Typography gutterBottom variant="h7" component="div">
                    Director: {watchlistMovie.director}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {watchlistMovie.plot}
                  </Typography>
                </CardContent>
                <CardActions>
                  <DeleteIcon
                    onClick={() => {
                      removeWatchlistMovie(watchlistMovie._id);
                    }}
                    sx={{ cursor: "pointer" }}
                  />
                  {/* <Button size="small">Share</Button>
                  <Button size="small">Learn More</Button> */}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default WatchlistMovies;

{
  /* {loading ? (
        <ClipLoader
          color={"  var(--basic-color)"}
          className="loading"
          loading={loading}
          cssOverride={{ marginLeft: " 50vw", marginTop: " 10vw" }}
          size={50}
        />
      ) : (
        <div>
          <MoviesResultCards movies={movies} navigate={navigate} />
        </div>
      )} */
}
