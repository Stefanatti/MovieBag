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
  const [toggle, setToggle] = useState(false);
  const [movieRates, setMovieRates] = useState([]);
  const [tvShowIds, setTvShowIds] = useState([]);

  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  let user = useSelector((state) => state.user.value);
  // let movies = useSelector((state) => state.movies.value);

  const { data } = useFetchData(`http://localhost:3636/tvShow/`, user._id);

  useEffect(() => {
    if (data) {
      const allTvShowIds = data.map((value) => +value.id);
      setTvShowIds(allTvShowIds);
      if (allTvShowIds.includes(+tvShowID)) setToggle(true);
    }
  }, [data]);
  // console.log(tvShowID);
  // useEffect(() => {
  //   if (!user._id) {
  //     return;
  //   }
  //   getTvShows();
  // }, [user._id]);

  // const getTvShows = () => {
  //   axios
  //     .get("http://localhost:3636/tvShow/" + user._id)
  //     .then(({ data }) => {
  //       console.log(data);
  //       setMyTvShows(data);
  //       setTvShowIds(data.map((mov) => mov.id));
  //     })
  //     .catch((err) => console.log(err));
  // };

  useEffect(() => {
    if (!tvShowID) return;
    axios
      .get(`http://localhost:3636/api/tv/id/${tvShowID}`)
      .then(({ data }) => {
        console.log(data);

        setTvShow(data);
        // setMovieRates(data.Ratings);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [tvShowID]);

  useEffect(() => {
    if (!tvShowID) return;

    toggleTheButton();
  }, [tvShowID]);

  const toggleTheButton = () => {
    if (tvShowIds.includes(tvShowID)) {
      setToggle(true);
    }
  };

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
          <TvShowCard
            tvShow={tvShow}
            //   movieRates={movieRates}
            user={user}
            toggle={toggle}
            AddToYourTvShows={AddToYourTvShows}
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
