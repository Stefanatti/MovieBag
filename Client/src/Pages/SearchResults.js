import "../Styles/MovieSearch.scss";
import useQueryParams from "../Hooks/useQueryParams";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import MoviesResultCards from "../Components/MoviesResultCards";
import { useSelector } from "react-redux";

const MovieSearchResult = () => {
  const url = process.env.REACT_APP_URL;
  const params = useQueryParams();
  const movieTitle = params.get("title");
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieTitle) return null;
    axios
      .get(url + `/api/${movieTitle}`)
      .then(({ data }) => {
        setMovies(data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [movieTitle]);
  console.log(movies);
  return (
    <div>
      {loading ? (
        <ClipLoader
          color={"  var(--basic-color)"}
          className="loading"
          loading={loading}
          cssOverride={{ marginLeft: " 50vw", marginTop: " 10vw" }}
          size={50}
        />
      ) : (
        <div>
          <MoviesResultCards movies={movies} navigate={navigate} />
        </div>
      )}
    </div>
  );
};

export default MovieSearchResult;
