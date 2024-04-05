import useQueryParams from "../../Hooks/useQueryParams";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../Components/MovieCard";
import { useSelector, useDispatch } from "react-redux";
import { Container, Box } from "@mui/material";
import useFetchData from "../../Hooks/useFetchData";
// import { addMovie } from "../../Features/movies";
import { lazy, Suspense } from "react";

const RenderMovie = () => {
  const url = process.env.REACT_APP_URL;
  const HaveToSignupModal = lazy(() =>
    import("../../Components/HaveToSignupModal")
  );
  const params = useQueryParams();
  const movieID = params.get("id");
  const navigate = useNavigate();
  const [movie, setMovie] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggleForList, setToggleForList] = useState(false);
  const [toggleForWatchlist, setToggleForWatchlist] = useState(false);
  const [movieRates, setMovieRates] = useState([]);
  const [moviesIds, setMoviesIds] = useState([]);
  const [watchlistMoviesIds, setWatchlistMoviesIds] = useState([]);

  const dispatch = useDispatch();

  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  let user = useSelector((state) => state.user.value);

  const { data: moviesData } = useFetchData(`${url}/movie/`, user._id);
  const { data: watchlistMoviesData } = useFetchData(
    `${url}/watchlist/movie/`,
    user._id
  );

  useEffect(() => {
    if (moviesData) {
      const allMoviesIds = moviesData.map((value) => value.id);
      if (allMoviesIds.includes(movieID)) setToggleForList(true);
      setMoviesIds(allMoviesIds);
    }
  }, [moviesData]);

  useEffect(() => {
    if (watchlistMoviesData) {
      const allWatchlistMoviesIds = watchlistMoviesData.map(
        (value) => value.id
      );
      if (allWatchlistMoviesIds.includes(movieID)) setToggleForWatchlist(true);
      setWatchlistMoviesIds(allWatchlistMoviesIds);
    }
  }, [watchlistMoviesData, movieID]);

  useEffect(() => {
    if (!movieID) return;

    const getMovieDetails = async () => {
      try {
        const response = await axios.get(url + `/api/id/${movieID}`);
        setMovie(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (movieID) {
      getMovieDetails();
    }
  }, [movieID]);

  const AddToYourMovies = async (id, title, year, type, director) => {
    try {
      await axios
        .post(url + `/movie/`, {
          id: id,
          title: title,
          year: year,
          type: type,
          director: director,
          owner: user._id,
        })
        .then((response) => {
          setMoviesIds([...moviesIds, id]);
          setToggleForList(true);
          //dispatch(addMovie({ id: String(id), title: title, director: director }));
        });
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };

  const AddToYourMoviesWatchlist = async (
    id,
    title,
    year,
    type,
    director,
    poster,
    plot
  ) => {
    if (!watchlistMoviesIds.includes(id)) {
      await axios
        .post(url + `/watchlist/movie/`, {
          id: id,
          title: title,
          year: year,
          type: type,
          director: director,
          poster: poster,
          plot: plot,
          owner: user._id,
        })
        .catch((err) => console.log(err));
      // dispatch(addMovie({ id: id, title: title, director: director }));

      setWatchlistMoviesIds([...watchlistMoviesIds, id]);
      setToggleForWatchlist(true);
    } else {
      alert("This movie already has been added.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <ClipLoader
            color={"  var(--basic-color)"}
            className="loading"
            loading={loading}
            //cssOverride={{ marginBottom: " 10vw" }}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <MovieCard
            movie={movie}
            movieRates={movieRates}
            user={user}
            toggleForList={toggleForList}
            toggleForWatchlist={toggleForWatchlist}
            AddToYourMovies={AddToYourMovies}
            AddToYourWatchlist={AddToYourMoviesWatchlist}
            setOpenHaveToSignupModal={setOpenHaveToSignupModal}
          />
        )}
      </Box>
      <Suspense>
        <HaveToSignupModal
          open={openHaveToSignupModal}
          onClose={() => {
            setOpenHaveToSignupModal(false);
          }}
        />
      </Suspense>
    </Container>
  );
};

export default RenderMovie;
