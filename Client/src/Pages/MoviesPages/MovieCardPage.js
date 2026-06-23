import useQueryParams from "../../Hooks/useQueryParams";
import api from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import ShowCard from "../../Components/ShowCard";
import { useSelector } from "react-redux";
import { Container, Box } from "@mui/material";
import useFetchData from "../../Hooks/useFetchData";
import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { toast } from "react-toastify";
const HaveToSignupModal = lazy(
  () => import("../../Components/HaveToSignupModal"),
);

const RenderMovie = () => {
  const url = process.env.REACT_APP_URL;
  const navigate = useNavigate();

  const params = useQueryParams();
  const movieID = params.get("id");
  const [movie, setMovie] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggleForList, setToggleForList] = useState(false);
  const [toggleForWatchlist, setToggleForWatchlist] = useState(false);
  const [, setMoviesIds] = useState([]);
  const [watchlistMoviesIds, setWatchlistMoviesIds] = useState([]);
  const [, setShowRatings] = useState("");

  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  let user = useSelector((state) => state.user.value);

  const { data: moviesData } = useFetchData(`${url}/movie/`, user._id);
  const { data: watchlistMoviesData } = useFetchData(
    `${url}/watchlist/movie/`,
    user._id,
  );

  useEffect(() => {
    if (moviesData) {
      const allMoviesIds = moviesData.map((value) => value.id);
      if (allMoviesIds.includes(movieID)) setToggleForList(true);
      setMoviesIds(allMoviesIds);
    }
  }, [moviesData, movieID]);

  useEffect(() => {
    if (watchlistMoviesData) {
      const allWatchlistMoviesIds = watchlistMoviesData.map(
        (value) => value.id,
      );
      if (allWatchlistMoviesIds.includes(movieID)) setToggleForWatchlist(true);
      setWatchlistMoviesIds(allWatchlistMoviesIds);
    }
  }, [watchlistMoviesData, movieID]);

  useEffect(() => {
    if (!movieID) return;

    const getMovieDetails = async () => {
      try {
        const response = await api.get(url + `/api/id/${movieID}`);
        setMovie(response.data);
      } catch (err) {
        console.log(err);
        navigate("/error_page");
      } finally {
        setLoading(false);
      }
    };
    if (movieID) {
      getMovieDetails();
    }
  }, [movieID, navigate, url]);

  const AddToYourMovies = async (id, title, year, type, director, poster) => {
    try {
      const response = await api.post(url + `/movie/`, {
        id: id,
        title: title,
        year: year,
        type: type,
        director: director,
        poster: poster,
        owner: user._id,
      });
      setMoviesIds((prevMoviesIds) => [...prevMoviesIds, id]);
      toast.success(response.data.message);
      setToggleForList(true);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const AddToYourMoviesWatchlist = async (
    id,
    title,
    year,
    type,
    director,
    poster,
    plot,
  ) => {
    try {
      if (!watchlistMoviesIds.includes(id)) {
        const response = await api.post(url + `/watchlist/movie/`, {
          id: id,
          title: title,
          year: year,
          type: type,
          director: director,
          poster: poster,
          plot: plot,
          owner: user._id,
        });
        setWatchlistMoviesIds((prevWatchlistMoviesIds) => [
          ...prevWatchlistMoviesIds,
          id,
        ]);
        toast.success(response.data.message);

        setToggleForWatchlist(true);
      }
    } catch (err) {
      toast.error(err.response.data.message);
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
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <ShowCard
            show={movie}
            user={user}
            toggleForList={toggleForList}
            toggleForWatchlist={toggleForWatchlist}
            AddToYourShows={AddToYourMovies}
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
