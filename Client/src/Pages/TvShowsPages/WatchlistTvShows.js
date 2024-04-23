import axios from "axios";
import { useEffect, useState } from "react";
import useFetchData from "../../Hooks/useFetchData";
import { useSelector } from "react-redux";
import WatchlistCard from "../../Components/WatchlistCard";
import ClipLoader from "react-spinners/ClipLoader";

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
const WatchlistTvShows = () => {
  const url = process.env.REACT_APP_URL;
  let user = useSelector((state) => state.user.value);

  const [pageloaded, setPageLoaded] = useState(true);
  const [watchlistTvShows, setWatchlistTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const TvShowsPerPage = 10; // Number of movies per page
  const startIndex = (page - 1) * TvShowsPerPage;
  const endIndex = startIndex + TvShowsPerPage;

  const { data, loading } = useFetchData(url + `/watchlist/tvShow/`, user._id);

  useEffect(() => {
    if (data) {
      console.log(data);
      const allWatchlistTvShows = data;
      setWatchlistTvShows(allWatchlistTvShows);
      setPageLoaded(loading);
    }
  }, [data, loading]);
  const displayedTvShows = watchlistTvShows.slice(startIndex, endIndex);

  console.log(watchlistTvShows);

  const removeWatchlistTvShow = async (id) => {
    try {
      await axios.delete(url + `/watchlist/TvShow/${id}`);
      setWatchlistTvShows((WatchlistTvShows) =>
        WatchlistTvShows.filter((TvShow) => TvShow._id !== id)
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
            Your Tv Shows Watchlist:
          </Typography>
          {displayedTvShows.length === 0 ? (
            <Typography
              variant="h5"
              sx={{
                color: "var(--basic-color)",
                fontFamily: "Limelight",
              }}
            >
              No Tv Shows in your watchlist yet!
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
                {displayedTvShows.map((tvShow) => (
                  <Grid key={tvShow.id} item xs={12} sm={6} md={6} lg={6}>
                    <Box>
                      <WatchlistCard
                        show={tvShow}
                        removeShow={removeWatchlistTvShow}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={Math.ceil(watchlistTvShows.length / TvShowsPerPage)} // Calculate number of pages
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
                  sx={{ marginTop: 5 }}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default WatchlistTvShows;
