import React from "react";
import {
  Card,
  Container,
  Typography,
  Box,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";

const MoviesResultCards = ({ movies, navigate }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {movies.length !== 0 ? (
          movies.map((movie) => (
            <Card
              key={movie.id}
              onClick={() =>
                navigate(
                  movie.media_type === "movie"
                    ? `/movie?id=${movie.id}`
                    : `/tvShow?id=${movie.id}`,
                )
              }
              sx={{
                display: "flex",
                flexDirection: "row",
                borderRadius: "12px",
                background: "rgba(30, 28, 28, 0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.25s ease",
                willChange: "transform",
                "&:hover": {
                  transform: "translateX(6px)",
                  borderColor: "var(--basic-color)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                },
              }}
            >
              {/* Poster */}
              <Box
                sx={{
                  width: isSmallScreen ? 100 : 130,
                  minHeight: isSmallScreen ? 150 : 195,
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                {movie.poster_path ? (
                  <Box
                    component="img"
                    src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <Typography
                      sx={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}
                    >
                      No Image
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Info */}
              <Box
                sx={{
                  flex: 1,
                  p: isSmallScreen ? 1.5 : 2.5,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 0.8,
                  overflow: "hidden",
                }}
              >
                {/* Title + Year */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant={isSmallScreen ? "body1" : "h6"}
                    sx={{
                      color: "#fff",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {movie.title || movie.name}
                  </Typography>
                  {(movie.release_date || movie.first_air_date) && (
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.45)", flexShrink: 0 }}
                    >
                      (
                      {movie.release_date?.slice(0, 4) ||
                        movie.first_air_date?.slice(0, 4)}
                      )
                    </Typography>
                  )}
                </Box>

                {/* Type + Rating row */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={movie.media_type === "movie" ? "Movie" : "TV Show"}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      backgroundColor:
                        movie.media_type === "movie"
                          ? "var(--basic-color)"
                          : "rgba(139, 92, 246, 0.8)",
                      color: "#fff",
                    }}
                  />
                  {movie.vote_average > 0 && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.3 }}
                    >
                      <StarIcon
                        sx={{ fontSize: 16, color: "var(--basic-color)" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          fontWeight: 500,
                        }}
                      >
                        {movie.vote_average.toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Overview (truncated to 2 lines) */}
                {movie.overview && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.4,
                      mt: 0.5,
                    }}
                  >
                    {movie.overview}
                  </Typography>
                )}
              </Box>
            </Card>
          ))
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "var(--basic-color)", fontFamily: "Limelight" }}
            >
              No results found
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255,255,255,0.4)", mt: 1 }}
            >
              Try a different spelling or search term
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MoviesResultCards;
