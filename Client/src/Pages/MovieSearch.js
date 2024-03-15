import "../Styles/MovieSearch.scss";
import useQueryParams from "../Hooks/useQueryParams";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import MoviesResultCards from "../Components/MoviesResultCards";
import { useSelector } from "react-redux";

const MovieSearchResult = () => {
  const params = useQueryParams();
  const movieTitle = params.get("title");
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  let user = useSelector((state) => state.user.value);

  useEffect(() => {
    if (!movieTitle) return null;
    axios
      .get(`http://localhost:3636/api/${movieTitle}`)
      .then(({ data }) => {
        console.log(data);
        setMovies(data.results);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [movieTitle]);

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
