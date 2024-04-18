import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Box,
  Stack,
  styled,
  Grid,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useTheme } from "@mui/material/styles";

const WatchlistCard = ({ show, removeShow }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const StyledTypography = styled(Typography)(({ variant, fontFamily }) => ({
    fontFamily: "Montserrat",
    variant: { variant },
    color: "rgb(234, 204, 231)",
    textShadow: `0 3 10 rgba(0, 0, 0, 0.7)`,
  }));
  return (
    <>
      <Card
        sx={{
          borderRadius: "15px",
          background: "#1d1919",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px) scale(1.1)",
          },
          boxShadow: "0 4px 8px 0 rgba(0,0,0,2)",
        }}
      >
        <Grid container direction={isSmallScreen ? "column" : "row"}>
          <Grid item xs={12} sm={6} md={4}>
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500/${show.poster}`}
              alt="Sample Image"
              sx={{
                width: "100%",
                height: { xs: "280px", sm: "100%" },
                objectFit: "cover",
                flexGrow: 1,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={7}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <StyledTypography
                  sx={{ color: "var(--basic-color)", cursor: "pointer" }}
                  variant="h4"
                  component="div"
                  fontWeight={500}
                  fontFamily={"Montserrat"}
                  onClick={() =>
                    navigate(
                      show.type === "movie"
                        ? `/movie?id=${show.id}`
                        : `/tvShow?id=${show.id}`
                    )
                  }
                >
                  {show.title || show.name}
                </StyledTypography>
                <CardActions>
                  <DeleteIcon
                    onClick={() => {
                      removeShow(show._id);
                    }}
                    sx={{
                      cursor: "pointer",
                      color: "var(--basic-color)",
                    }}
                  />
                </CardActions>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Stack spacing={1}>
                  <StyledTypography variant="body1" color="text.secondary">
                    {show.year}
                  </StyledTypography>
                  <StyledTypography variant="body1" color="text.secondary">
                    {/* Director: {show.director} */}
                    {show.type === "movie"
                      ? `Director: ${show.director}`
                      : `Creator: ${show.creator}`}
                  </StyledTypography>

                  <StyledTypography variant="caption" color="text.secondary">
                    {show.plot}
                  </StyledTypography>
                </Stack>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default WatchlistCard;
