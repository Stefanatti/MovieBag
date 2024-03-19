// import "../Styles/Movie.scss";
import useQueryParams from "../Hooks/useQueryParams";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HaveToSignupModal from "../Components/HaveToSignupModal";
import MovieCard from "../Components/MovieCard";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "@mui/material";
import useFetchData from "../Hooks/useFetchData";
import { getUserMovies, addMovie } from "../Features/movies";

const RenderMovie = () => {
  const params = useQueryParams();
  const movieID = params.get("id");
  const navigate = useNavigate();
  const [myMovies, setMyMovies] = useState([]);
  const [movie, setMovie] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [movieRates, setMovieRates] = useState([]);
  const [moviesIds, setMoviesIds] = useState([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  let user = useSelector((state) => state.user.value);

  const { data } = useFetchData(`http://localhost:3636/movie/`, user._id);

  useEffect(() => {
    if (data) {
      const moviesssIds = data.map((value) => +value.id);
      setMoviesIds(moviesssIds);
      if (moviesssIds.includes(+movieID)) setToggle(true);
    }
  }, [data]);

  useEffect(() => {
    if (!movieID) return;

    const getMovieDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3636/api/id/${movieID}`
        );
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
      setToggle(true);
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
            toggle={toggle}
            AddToYourMovies={AddToYourMovies}
            setOpenHaveToSignupModal={setOpenHaveToSignupModal}
          />
        )}
      </div>
      <HaveToSignupModal
        open={openHaveToSignupModal}
        onClose={() => {
          setOpenHaveToSignupModal(false);
        }}
      />
    </Container>
  );
};

export default RenderMovie;
