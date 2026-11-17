import "../Styles/MovieSearch.scss";
import useQueryParams from "../Hooks/useQueryParams";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import MoviesResultCards from "../Components/MoviesResultCards";
import { Alert, Box, Button, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const MovieSearchResult = () => {
  const url = process.env.REACT_APP_URL;
  const params = useQueryParams();
  const movieTitle = params.get("title")?.trim() || "";
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!movieTitle) {
      setMovies([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setMovies([]);
    api
      .get(url + `/api/${encodeURIComponent(movieTitle)}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (!Array.isArray(data)) {
          throw new Error("Search response was not a list.");
        }
        setMovies(data);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Error fetching search results:", err);
        setMovies([]);
        setError("Search failed. Check your connection and try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [movieTitle, retryCount, url]);

  return (
    <div>
      {loading ? (
        <ClipLoader
          color={"var(--basic-color)"}
          className="loading"
          loading={loading}
          cssOverride={{ marginLeft: "50vw", marginTop: "10vw" }}
          size={50}
        />
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 2,
            px: 2,
          }}
        >
          <Alert severity="error">{error}</Alert>
          <Button
            variant="outlined"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Retry
          </Button>
        </Box>
      ) : !movieTitle ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 2,
            textAlign: "center",
            px: 2,
          }}
        >
          <SearchIcon
            sx={{ fontSize: 64, color: "var(--basic-color)", opacity: 0.6 }}
          />
          <Typography
            variant="h5"
            sx={{
              color: "var(--basic-color)",
              fontFamily: "Limelight",
            }}
          >
            Search for a Movie or TV Show
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.5)", maxWidth: 400 }}
          >
            Try searching for "Inception", "Breaking Bad", or "The Dark Knight"
          </Typography>
        </Box>
      ) : (
        <div>
          <MoviesResultCards movies={movies} navigate={navigate} />
        </div>
      )}
    </div>
  );
};

export default MovieSearchResult;
