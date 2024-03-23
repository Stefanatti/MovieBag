import useQueryParams from "../Hooks/useQueryParams";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HaveToSignupModal from "../Components/HaveToSignupModal";
import TvShowCard from "../Components/TvShowCard";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import useFetchData from "../Hooks/useFetchData";

const RenderTvShowCard = () => {
  const params = useQueryParams();
  const tvShowID = params.get("id");

  const navigate = useNavigate();
  const [myTvShows, setMyTvShows] = useState([]);
  const [movie, setMovie] = useState("");
  const [tvShow, setTvShow] = useState("");

  const [loading, setLoading] = useState(true);
  const [toggleForList, setToggleForList] = useState(false);
  const [toggleForWatchlist, setToggleForWatchlist] = useState(false);

  const [movieRates, setMovieRates] = useState([]);
  const [tvShowIds, setTvShowIds] = useState([]);
  const [watchlistTvShowsIds, setWatchlistTvShowsIds] = useState([]);

  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  let user = useSelector((state) => state.user.value);
  // let movies = useSelector((state) => state.movies.value);

  const { data: tvShowsData } = useFetchData(
    `http://localhost:3636/tvShow/`,
    user._id
  );

  const { data: watchlistTvShowsData } = useFetchData(
    `http://localhost:3636/watchlist/tvShow/`,
    user._id
  );

  useEffect(() => {
    if (tvShowsData) {
      const allTvShowIds = tvShowsData.map((value) => +value.id);
      setTvShowIds(allTvShowIds);
      if (allTvShowIds.includes(+tvShowID)) setToggleForList(true);
    }
  }, [tvShowsData]);

  useEffect(() => {
    if (watchlistTvShowsData) {
      const allWatchlistTvShowsIds = watchlistTvShowsData.map(
        (value) => +value.id
      );
      setWatchlistTvShowsIds(allWatchlistTvShowsIds);
      if (watchlistTvShowsIds.includes(+tvShowID)) setToggleForWatchlist(true);
    }
  }, [watchlistTvShowsData]);

  useEffect(() => {
    if (!tvShowID) return;

    const getTvShowDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3636/api/tv/id/${tvShowID}`
        );
        console.log(response.data);
        setTvShow(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (tvShowID) {
      getTvShowDetails();
    }
  }, [tvShowID]);

  const AddToYourTvShows = async (id, name, year, type, creator) => {
    if (!tvShowIds.includes(id)) {
      await axios
        .post("http://localhost:3636/tvShow/", {
          id: id,
          name: name,
          year: year,
          type: type,
          creator: creator,
          owner: user._id,
        })
        .catch((err) => console.log(err));
      setTvShowIds([...tvShowIds, id]);
      setToggleForList(true);
    } else {
      alert("This TV Show already has been added.");
    }
  };

  const AddToYouTvShowsWatchlist = async (
    id,
    name,
    year,
    type,
    creator,
    poster,
    plot
  ) => {
    if (!watchlistTvShowsIds.includes(id)) {
      await axios
        .post("http://localhost:3636/watchlist/tvShow/", {
          id: id,
          name: name,
          year: year,
          type: type,
          creator: creator,
          poster: poster,
          plot: plot,
          owner: user._id,
        })
        .catch((err) => console.log(err));
      // dispatch(addMovie({ id: id, title: title, director: director }));

      setWatchlistTvShowsIds([...watchlistTvShowsIds, id]);
      setToggleForWatchlist(true);
    } else {
      alert("This TV Show already has been added.");
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
          <TvShowCard
            tvShow={tvShow}
            //   movieRates={movieRates}
            user={user}
            toggleForList={toggleForList}
            toggleForWatchlist={toggleForWatchlist}
            AddToYourTvShows={AddToYourTvShows}
            AddToYouTvShowsWatchlist={AddToYouTvShowsWatchlist}
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

export default RenderTvShowCard;
