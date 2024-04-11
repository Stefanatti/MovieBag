import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetchData from "../../Hooks/useFetchData";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import ClipLoader from "react-spinners/ClipLoader";

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
  CardContent,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const WatchlistMovies = () => {
  const url = process.env.REACT_APP_URL;
  const navigate = useNavigate();
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [pageloaded, setPageLoaded] = useState(true);
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const moviesPerPage = 10;
  const startIndex = (page - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  let user = useSelector((state) => state.user.value);

  const StyledTypography = styled(Typography)(({ variant, fontFamily }) => ({
    fontFamily: { fontFamily },
    variant: { variant },
    color: "rgb(234, 204, 231)",
    textShadow: `0 3 10 rgba(0, 0, 0, 0.7)`,
  }));

  const { data, loading } = useFetchData(`${url}/watchlist/movie/`, user._id);

  useEffect(() => {
    if (data) {
      const allWatchlistMovies = data;
      setWatchlistMovies(allWatchlistMovies);
      setPageLoaded(loading);
    }
  }, [data]);

  const displayedMovies = watchlistMovies.slice(startIndex, endIndex);

  console.log(watchlistMovies);

  const removeWatchlistMovie = async (id) => {
    try {
      await axios.delete(url + `/watchlist/movie/${id}`);
      setWatchlistMovies((WatchlistMovies) =>
        WatchlistMovies.filter((movie) => movie._id !== id)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container>
      {pageloaded ? (
        <ClipLoader
          color={"  var(--basic-color)"}
          className="loading"
          loading={loading}
          cssOverride={{ marginLeft: " 50vw", marginTop: " 10vw" }}
          size={50}
        />
      ) : (
        <>
          <Typography
            variant="h4"
            sx={{
              color: "var(--basic-color)",
              fontFamily: "Limelight",
              mb: 3,
            }}
          >
            Your Movies Watchlist:
          </Typography>
          {displayedMovies.length === 0 ? (
            <Typography
              variant="h5"
              sx={{
                color: "var(--basic-color)",
                fontFamily: "Limelight",
              }}
            >
              No movies in your watchlist yet!
            </Typography>
          ) : (
            <Box>
              <Grid
                container
                direction={"column"}
                spacing={2}
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: "100vh" }}
              >
                {displayedMovies.map((watchlistMovie) => (
                  <Grid key={watchlistMovie._id} item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        maxWidth: 745,
                        display: "flex",
                        backgroundColor: "rgb(46, 46, 42)",
                        borderRadius: "30px",
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
                        <StyledTypography
                          gutterBottom
                          variant="h5"
                          component="div"
                          onClick={() =>
                            navigate(`/movie?id=${watchlistMovie.id}`)
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          {watchlistMovie.title}
                        </StyledTypography>
                        <StyledTypography
                          gutterBottom
                          variant="h7"
                          component="div"
                        >
                          Director: {watchlistMovie.director}
                        </StyledTypography>
                        <StyledTypography
                          variant="body2"
                          color="text.secondary"
                        >
                          {watchlistMovie.plot}
                        </StyledTypography>
                      </CardContent>
                      <CardActions>
                        <DeleteIcon
                          onClick={() => {
                            removeWatchlistMovie(watchlistMovie._id);
                          }}
                          sx={{
                            cursor: "pointer",
                            color: "var(--basic-color)",
                          }}
                        />
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
                <Stack spacing={2}>
                  <Pagination
                    count={Math.ceil(watchlistMovies.length / moviesPerPage)} // Calculate number of pages
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
          )}
        </>
      )}
    </Container>
  );
};

export default WatchlistMovies;
