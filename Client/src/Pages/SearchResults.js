import "../Styles/MovieSearch.scss";
import useQueryParams from "../Hooks/useQueryParams";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import MoviesResultCards from "../Components/MoviesResultCards";
import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const MovieSearchResult = () => {
  const url = process.env.REACT_APP_URL;
  const params = useQueryParams();
  const movieTitle = params.get("title");
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieTitle) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get(url + `/api/${movieTitle}`)
      .then(({ data }) => {
        setMovies(data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [movieTitle, url]);

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
