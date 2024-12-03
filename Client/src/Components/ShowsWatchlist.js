import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchData from "./../Hooks/useFetchData";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import WatchlistCard from "../Components/WatchlistCard";
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

const ShowsWatchlist = ({ showType }) => {
  const url = process.env.REACT_APP_URL;
  let user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  const [watchlistShows, setWatchlistShows] = useState([]);
  const [pageloaded, setPageLoaded] = useState(true);
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const showsPerPage = 10;
  const startIndex = (page - 1) * showsPerPage;
  const endIndex = startIndex + showsPerPage;

  const { data, loading, error } = useFetchData(
    `${url}/watchlist/${showType}/`,
    user._id
  );

  useEffect(() => {
    if (error) {
      console.log(error);
      navigate("/error_page");
    }
    if (data) {
      const allWatchlistShows = data;
      setWatchlistShows(allWatchlistShows);
      setPageLoaded(loading);
    }
  }, [data, loading, error]);

  const displayedShows = watchlistShows.slice(startIndex, endIndex);

  const removeWatchlistShow = async (id) => {
    try {
      await axios.delete(url + `/watchlist/${showType}/${id}`);
      setWatchlistShows((watchlistShow) =>
        watchlistShow.filter((show) => show._id !== id)
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
            {showType === `movie`
              ? `Your Movies Watchlist:`
              : `Your Tv Shows Watchlist:`}
          </Typography>
          {displayedShows.length === 0 ? (
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
                {displayedShows.map((show) => (
                  <Grid key={show.id} item xs={12} sm={6} md={6} lg={6}>
                    <Box>
                      <WatchlistCard
                        show={show}
                        removeShow={removeWatchlistShow}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={Math.ceil(watchlistShows.length / showsPerPage)}
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
                          <ArrowBackIcon
                            color="var(--basic-color)"
                            sx={{ cursor: "pointer" }}
                          />
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

export default ShowsWatchlist;
