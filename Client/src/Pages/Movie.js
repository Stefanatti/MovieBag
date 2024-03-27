// import "../Styles/Movie.scss";
import useQueryParams from "../Hooks/useQueryParams";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../Components/MovieCard";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "@mui/material";
import useFetchData from "../Hooks/useFetchData";
import { getUserMovies, addMovie } from "../Features/movies";
import { lazy, Suspense } from "react";

const RenderMovie = () => {
  const HaveToSignupModal = lazy(() =>
    import("../Components/HaveToSignupModal")
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

  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  let user = useSelector((state) => state.user.value);

  const { data: moviesData } = useFetchData(
    `http://localhost:3636/movie/`,
    user._id
  );
  const { data: watchlistMoviesData } = useFetchData(
    `http://localhost:3636/watchlist/movie/`,
    user._id
  );

  useEffect(() => {
    if (moviesData) {
      const allMoviesIds = moviesData.map((value) => +value.id);
      setMoviesIds(allMoviesIds);
      if (allMoviesIds.includes(+movieID)) setToggleForList(true);
    }
  }, [moviesData]);

  useEffect(() => {
    if (watchlistMoviesData) {
      const allWatchlistMoviesIds = watchlistMoviesData.map(
        (value) => +value.id
      );
      setWatchlistMoviesIds(allWatchlistMoviesIds);
      if (watchlistMoviesIds.includes(+movieID)) setToggleForWatchlist(true);
    }
  }, [watchlistMoviesData]);

  useEffect(() => {
    if (!movieID) return;

    const getMovieDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3636/api/id/${movieID}`
        );
        console.log(response.data);
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
    if (!moviesIds.includes(id)) {
      await axios
        .post("http://localhost:3636/movie/", {
          id: id,
          title: title,
          year: year,
          type: type,
          director: director,

          owner: user._id,
        })
        .catch((err) => console.log(err));
      // dispatch(addMovie({ id: id, title: title, director: director }));

      setMoviesIds([...moviesIds, id]);
      setToggleForList(true);
    } else {
      alert("This movie already has been added.");
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
        .post("http://localhost:3636/watchlist/movie/", {
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
      <div className="movie-card-container">
        {loading ? (
          <ClipLoader
            color={"  var(--basic-color)"}
            className="loading"
            loading={loading}
            cssOverride={{ marginBottom: " 10vw" }}
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
      </div>
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
