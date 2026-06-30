import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import api from "../api/axios";
import Carusel from "./Carusel";

const SimilarShows = ({ showId, type }) => {
  const url = process.env.REACT_APP_URL;
  const [similarShows, setSimilarShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isMovie = type === "movie";
  const path = isMovie ? "/movie?id=" : "/tvShow?id=";

  useEffect(() => {
    if (!showId) return;

    const fetchSimilar = async () => {
      try {
        setLoading(true);
        setError(false);
        const endpoint = isMovie
          ? `${url}/api/id/${showId}/similar`
          : `${url}/api/tv/id/${showId}/similar`;
        const response = await api.get(endpoint);
        setSimilarShows(response.data);
      } catch (err) {
        console.error("Failed to fetch similar shows:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [showId, url, isMovie]);

  if (!loading && !error && similarShows.length === 0) {
    return null;
  }

  return (
    <Box className="similar-shows" sx={{ mt: 5, mb: 6 }}>
      <Typography
        variant="h5"
        sx={{
          color: "var(--basic-color)",
          fontFamily: "Limelight, cursive",
          textAlign: "center",
          mb: 3,
        }}
      >
        You May Also Like
      </Typography>
      <Carusel
        data={similarShows}
        path={path}
        error={error}
        loading={loading}
      />
    </Box>
  );
};

export default SimilarShows;
