import "../Styles/Movie.scss";
import useQueryParams from "../Hooks/useQueryParams";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HaveToSignupModal from "../Components/HaveToSignupModal";
import MovieCard from "../Components/MovieCard";
import { useSelector } from "react-redux";

const RenderMovie = () => {
  const params = useQueryParams();
  const movieTitle = params.get("title");
  const navigate = useNavigate();
  const [myMovies, setMyMovies] = useState([]);
  const [movie, setMovie] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [movieRates, setMovieRates] = useState([]);
  const [movieTitles, setMovieTitles] = useState([]);
  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  let user = useSelector((state) => state.user.value);

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
        setMyMovies(data);
        setMovieTitles(data.map((mov) => mov.title));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!movieTitle) return null;

    axios
      .get(`http://localhost:3636/api/title/${movieTitle}`)
      .then(({ data }) => {
        console.log(data);
        setMovie(data);
        setMovieRates(data.Ratings);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [movieTitle]);

  useEffect(() => {
    if (!movieTitle) return;

    toggleTheButton();
  }, [movieTitles]);

  const toggleTheButton = () => {
    if (movieTitles.includes(movieTitle)) {
      setToggle(true);
    }
  };

  const AddToYourMovies = async (title, year, type, director) => {
    if (!movieTitles.includes(title)) {
      await axios
        .post("http://localhost:3636/movie/", {
          title: title,
          year: year,
          type: type,
          director: director,
          owner: user._id,
        })
        .catch((err) => console.log(err));
      setMovieTitles([...movieTitles, title]);
      console.log(movieTitles);
      setToggle(true);
    } else {
      alert("This movie already has been added.");
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default RenderMovie;
