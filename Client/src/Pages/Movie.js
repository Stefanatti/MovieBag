// import "../Styles/Movie.scss";
import useQueryParams from "../Hooks/useQueryParams";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HaveToSignupModal from "../Components/HaveToSignupModal";
import MovieCard from "../Components/MovieCard";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
const RenderMovie = () => {
  const params = useQueryParams();
  const movieTitle = params.get("title");

  const movieID = params.get("id");
  const navigate = useNavigate();
  const [myMovies, setMyMovies] = useState([]);
  const [movie, setMovie] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [movieRates, setMovieRates] = useState([]);
  const [movieIds, setMovieIds] = useState([]);
  const [movieIDS, setMovieIDs] = useState([]);

  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  let user = useSelector((state) => state.user.value);
  // let movies = useSelector((state) => state.movies.value);

  useEffect(() => {
    if (!user._id) {
      return;
    }
    getMovies();
  }, [user._id]);

  const getMovies = () => {
    axios
      .get("http://localhost:3636/movie/" + user._id)
      .then(({ data }) => {
        console.log(data);
        setMyMovies(data);
        setMovieIds(data.map((mov) => mov.id));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!movieID) return null;

    axios
      .get(`http://localhost:3636/api/id/${movieID}`)
      .then(({ data }) => {
        console.log(data);
        setMovie(data);
        setMovieRates(data.Ratings);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [movieID]);

  useEffect(() => {
    if (!movieID) return;

    toggleTheButton();
  }, [movieID]);

  const toggleTheButton = () => {
    if (movieID.includes(movieID)) {
      setToggle(true);
    }
  };

  const AddToYourMovies = async (id, title, year, type, director) => {
    if (!movieIds.includes(id)) {
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
      setMovieIds([...movieIds, id]);
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
