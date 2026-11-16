import api from "../api/axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchData from "./../Hooks/useFetchData";
import { useSelector } from "react-redux";
import WatchlistCard from "../Components/WatchlistCard";
import {
  Grid,
  Typography,
  Container,
  Pagination,
  PaginationItem,
  Box,
  Skeleton,
  Chip,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkIcon from "@mui/icons-material/Bookmark";

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
  const showsPerPage = 12;
  const startIndex = (page - 1) * showsPerPage;
  const endIndex = startIndex + showsPerPage;

  const { data, loading, error } = useFetchData(
    `${url}/watchlist/${showType}/`,
    user._id,
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
  }, [data, loading, error, navigate]);

  const displayedShows = watchlistShows.slice(startIndex, endIndex);
  const pageCount = Math.max(1, Math.ceil(watchlistShows.length / showsPerPage));

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const [markingIds, setMarkingIds] = useState([]);
  const markingRef = useRef(new Set());
  const [feedback, setFeedback] = useState(null);
  const libraryLabel = showType === "movie" ? "Your Movies" : "Your Tv Shows";
  const libraryPath = showType === "movie" ? "/yourmovies" : "/yourTvShows";

  const markShowWatched = async (id) => {
    if (markingRef.current.has(id)) return;
    markingRef.current.add(id);
    setMarkingIds((ids) => [...ids, id]);
    try {
      const { data: result } = await api.post(
        `${url}/watchlist/${showType}/${id}/watched`,
      );
      setWatchlistShows((shows) => shows.filter((show) => show._id !== id));
      setFeedback({
        severity: "success",
        message: result?.alreadyInLibrary
          ? `Already in ${libraryLabel}, removed from your watchlist.`
          : `Moved to ${libraryLabel}.`,
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setWatchlistShows((shows) => shows.filter((show) => show._id !== id));
      }
      setFeedback({
        severity: "error",
        message:
          error.response?.data?.message ||
          "Could not move this title. Please try again.",
      });
    } finally {
      markingRef.current.delete(id);
      setMarkingIds((ids) => ids.filter((markingId) => markingId !== id));
    }
  };

  const removeWatchlistShow = async (id) => {
    try {
      await api.delete(url + `/watchlist/${showType}/${id}`);
      setWatchlistShows((watchlistShow) =>
        watchlistShow.filter((show) => show._id !== id),
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const pageTitle =
    showType === "movie" ? "Movies Watchlist" : "TV Shows Watchlist";

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {pageloaded ? (
        /* Skeleton loading state */
        <Box>
          <Skeleton
            variant="text"
            width={260}
            height={50}
            sx={{ bgcolor: "rgba(255,255,255,0.08)", mb: 3 }}
          />
          <Grid container spacing={2.5}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid key={i} item xs={6} sm={4} md={3} lg={2.4}>
                <Skeleton
                  variant="rounded"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.06)",
                    borderRadius: "14px",
                    aspectRatio: "2/3",
                    width: "100%",
                  }}
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  sx={{ bgcolor: "rgba(255,255,255,0.05)", mt: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <>
          {/* Page header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
              flexWrap: "wrap",
            }}
          >
            <BookmarkIcon sx={{ color: "var(--basic-color)", fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                color: "var(--basic-color)",
                fontFamily: "Limelight",
              }}
            >
              {pageTitle}
            </Typography>
            {watchlistShows.length > 0 && (
              <Chip
                label={`${watchlistShows.length} ${watchlistShows.length === 1 ? "title" : "titles"}`}
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                }}
              />
            )}
          </Box>

          {displayedShows.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 10,
                gap: 2,
              }}
            >
              <BookmarkIcon
                sx={{
                  fontSize: 64,
                  color: "var(--basic-color)",
                  opacity: 0.4,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  color: "var(--basic-color)",
                  fontFamily: "Limelight",
                }}
              >
                Your watchlist is empty
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255,255,255,0.4)", textAlign: "center" }}
              >
                Search for a {showType === "movie" ? "movie" : "TV show"} and
                add it to your watchlist!
              </Typography>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={2.5}>
                {displayedShows.map((show) => (
                  <Grid key={show.id} item xs={6} sm={4} md={3} lg={2.4}>
                    <WatchlistCard
                      show={show}
                      removeShow={removeWatchlistShow}
                      markWatched={markShowWatched}
                      marking={markingIds.includes(show._id)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {watchlistShows.length > showsPerPage && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5,
                  }}
                >
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
                          backgroundColor: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.7)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          "&.Mui-selected": {
                            backgroundColor: "var(--basic-color)",
                            color: "#fff",
                          },
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.15)",
                          },
                        }}
                        {...item}
                        icon={
                          item.type === "previous" ? (
                            <ArrowBackIcon sx={{ cursor: "pointer" }} />
                          ) : (
                            <ArrowForwardIcon />
                          )
                        }
                      />
                    )}
                  />
                </Box>
              )}
            </Box>
          )}
        </>
      )}
      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={5000}
        onClose={(event, reason) => {
          if (reason !== "clickaway") setFeedback(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {feedback ? (
          <Alert
            severity={feedback.severity}
            variant="filled"
            onClose={() => setFeedback(null)}
            action={
              feedback.severity === "success" ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => navigate(libraryPath)}
                >
                  View
                </Button>
              ) : undefined
            }
          >
            {feedback.message}
          </Alert>
        ) : (
          <span />
        )}
      </Snackbar>
    </Container>
  );
};

export default ShowsWatchlist;
