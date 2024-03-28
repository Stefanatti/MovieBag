import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetchData from "../../Hooks/useFetchData";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Grid,
  Typography,
  Container,
  Stack,
  Pagination,
  PaginationItem,
  Box,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const WatchlistTvShows = () => {
  const navigate = useNavigate();
  const [watchlistTvShows, setWatchlistTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const TvShowsPerPage = 10; // Number of movies per page
  const startIndex = (page - 1) * TvShowsPerPage;
  const endIndex = startIndex + TvShowsPerPage;
  let user = useSelector((state) => state.user.value);

  const StyledTypography = styled(Typography)(({ variant, fontFamily }) => ({
    fontFamily: { fontFamily },
    variant: { variant },
    color: "rgb(234, 204, 231)",
    textShadow: `0 3 10 rgba(0, 0, 0, 0.7)`,
  }));

  const { data } = useFetchData(
    `http://localhost:3636/watchlist/tvShow/`,
    user._id
  );

  useEffect(() => {
    if (data) {
      console.log(data);
      const allWatchlistTvShows = data;
      setWatchlistTvShows(allWatchlistTvShows);
    }
  }, [data]);
  const displayedTvShows = watchlistTvShows.slice(startIndex, endIndex);

  console.log(watchlistTvShows);

  const removeWatchlistTvShow = async (id) => {
    try {
      await axios.delete(`http://localhost:3636/watchlist/TvShow/${id}`);
      setWatchlistTvShows((WatchlistTvShows) =>
        WatchlistTvShows.filter((TvShow) => TvShow._id !== id)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container>
      <Typography
        variant="h1"
        sx={{
          color: "var(--basic-color)",
          fontFamily: "Limelight",
          fontSize: "32px",
          marginBottom: "50px",
        }}
      >
        Your Tv Shows Watchlist:
      </Typography>
      <Box>
        <Grid
          container
          direction={"column"}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "100vh" }}
        >
          {displayedTvShows.map((watchlistTvShow) => (
            <Grid key={watchlistTvShow._id} item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  maxWidth: 745,
                  display: "flex",
                  backgroundColor: "rgb(46, 46, 42)",
                  borderRadius: "30px",
                }}
              >
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${watchlistTvShow.poster}`}
                  title={watchlistTvShow.title}
                  sx={{
                    height: 250,
                    objectFit: "contain",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardContent>
                  <StyledTypography
                    gutterBottom
                    variant="h5"
                    component="div"
                    onClick={() => navigate(`/TvShow?id=${watchlistTvShow.id}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    {watchlistTvShow.name}
                  </StyledTypography>
                  <StyledTypography gutterBottom variant="h7" component="div">
                    Director: {watchlistTvShow.director}
                  </StyledTypography>
                  <StyledTypography variant="body2" color="text.secondary">
                    {watchlistTvShow.plot}
                  </StyledTypography>
                </CardContent>
                <CardActions>
                  <DeleteIcon
                    onClick={() => {
                      removeWatchlistTvShow(watchlistTvShow._id);
                    }}
                    sx={{ cursor: "pointer", color: "var(--basic-color)" }}
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(watchlistTvShows.length / TvShowsPerPage)} // Calculate number of pages
              page={page}
              onChange={handleChange}
              size="large"
              shape="rounded"
              color="primary"
              boundaryCount={2}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  icon={
                    item.type === "previous" ? (
                      <ArrowBackIcon />
                    ) : (
                      <ArrowForwardIcon />
                    )
                  }
                />
              )}
              sx={{ marginTop: 5 }}
            />
          </Stack>
        </Grid>
      </Box>
    </Container>
  );
};

export default WatchlistTvShows;
