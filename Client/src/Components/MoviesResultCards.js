import React from "react";
import {
  Card,
  Container,
  CardContent,
  CardMedia,
  Typography,
  Box,
  styled,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MoviesResultCards = ({ movies, navigate }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const StyledTypography = styled(Typography)(({ variant, fontFamily }) => ({
    fontFamily: "Montserrat",
    fontWeight: "bold",
    variant: { variant },
    color: "rgb(234, 204, 231)",
    textShadow: `0 3 10 rgba(0, 0, 0, 0.7)`,
  }));

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {movies.length != 0 ? (
          movies.map((movie) => {
            return (
              <Card
                key={movie.id}
                spacing={5}
                sx={{
                  borderRadius: "15px",
                  background: "var(--cards-color)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px) scale(1.1)",
                  },
                  boxShadow: "0 4px 8px 0 rgba(0,0,0,2)",
                }}
                onClick={() =>
                  navigate(
                    movie.media_type === "movie"
                      ? `/movie?id=${movie.id}`
                      : `/tvShow?id=${movie.id}`
                  )
                }
              >
                <Grid container direction={isSmallScreen ? "column" : "row"}>
                  <Grid item xs={12} sm={6} md={5}>
                    <CardMedia
                      component="img"
                      height="254"
                      image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt="Sample Image"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={7}>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        textAlign: "center",
                        alignItems: "stretch",
                      }}
                    >
                      <StyledTypography
                        variant="h4"
                        component="div"
                        fontFamily={"Montserrat"}
                      >
                        {movie.title || movie.name}
                      </StyledTypography>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <StyledTypography
                          variant="body1"
                          color="text.secondary"
                        >
                          {movie.media_type}
                        </StyledTypography>
                        <StyledTypography
                          variant="body1"
                          color="text.secondary"
                        >
                          {movie.release_date?.slice(0, 4) ||
                            movie.first_air_date?.slice(0, 4)}
                        </StyledTypography>
                      </Box>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            );
          })
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color={"var(--basic-color)"}>
              No results found
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MoviesResultCards;
