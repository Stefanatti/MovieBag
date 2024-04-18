import axios from "axios";
import { useEffect, useState } from "react";
import useFetchData from "../../Hooks/useFetchData";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import WatchlistCard from "../../Components/WatchlistCard";
import {
  Grid,
  Typography,
  Container,
  Pagination,
  PaginationItem,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const WatchlistMovies = () => {
  const url = process.env.REACT_APP_URL;
  let user = useSelector((state) => state.user.value);

  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [pageloaded, setPageLoaded] = useState(true);
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const moviesPerPage = 20;
  const startIndex = (page - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;

  const { data, loading } = useFetchData(`${url}/watchlist/movie/`, user._id);

  useEffect(() => {
    if (data) {
      const allWatchlistMovies = data;
      setWatchlistMovies(allWatchlistMovies);
      setPageLoaded(loading);
    }
  }, [data, loading]);

  const displayedMovies = watchlistMovies.slice(startIndex, endIndex);

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
  console.log(displayedMovies);
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
                direction={"row"}
                spacing={5}
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: "100vh" }}
              >
                {displayedMovies.map((movie) => (
                  <Grid key={movie.id} item xs={12} sm={6} md={6} lg={6}>
                    <Box>
                      <WatchlistCard
                        show={movie}
                        removeShow={removeWatchlistMovie}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={Math.ceil(watchlistMovies.length / moviesPerPage)}
                  page={page}
                  onChange={handleChange}
                  size="large"
                  shape="rounded"
                  boundaryCount={2}
                  renderItem={(item) => (
                    <PaginationItem
                      sx={{
                        background: "var(--basic-color)",
                      }}
                      {...item}
                      icon={
                        item.type === "previous" ? (
                          <ArrowBackIcon color="var(--basic-color)" />
                        ) : (
                          <ArrowForwardIcon color="var(--basic-color)" />
                        )
                      }
                    />
                  )}
                  sx={{ mt: 5 }}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default WatchlistMovies;
