import useQueryParams from "../../Hooks/useQueryParams";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import HaveToSignupModal from "../../Components/HaveToSignupModal";
import ShowCard from "../../Components/ShowCard";
import { useSelector } from "react-redux";
import { Container, Box } from "@mui/material";
import useFetchData from "../../Hooks/useFetchData";

const RenderTvShowCard = () => {
  const params = useQueryParams();
  const tvShowID = params.get("id");
  const url = process.env.REACT_APP_URL;
  const navigate = useNavigate();

  const [tvShow, setTvShow] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggleForList, setToggleForList] = useState(false);
  const [toggleForWatchlist, setToggleForWatchlist] = useState(false);
  const [tvShowIds, setTvShowIds] = useState([]);
  const [watchlistTvShowsIds, setWatchlistTvShowsIds] = useState([]);
  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  let user = useSelector((state) => state.user.value);

  const { data: tvShowsData } = useFetchData(url + `/tvShow/`, user._id);

  const { data: watchlistTvShowsData } = useFetchData(
    url + `/watchlist/tvShow/`,
    user._id
  );

  useEffect(() => {
    if (tvShowsData) {
      const allTvShowIds = tvShowsData.map((value) => value.id);
      setTvShowIds(allTvShowIds);
      if (allTvShowIds.includes(tvShowID)) setToggleForList(true);
    }
  }, [tvShowsData]);

  useEffect(() => {
    if (watchlistTvShowsData) {
      const allWatchlistTvShowsIds = watchlistTvShowsData.map(
        (value) => value.id
      );
      if (allWatchlistTvShowsIds.includes(tvShowID))
        setToggleForWatchlist(true);
      setWatchlistTvShowsIds(allWatchlistTvShowsIds);
    }
  }, [watchlistTvShowsData, tvShowID]);

  useEffect(() => {
    if (!tvShowID) return;

    const getTvShowDetails = async () => {
      try {
        const response = await axios.get(url + `/api/tv/id/${tvShowID}`);
        setTvShow(response.data);
      } catch (err) {
        console.log(err);
        navigate("/error_page");
      } finally {
        setLoading(false);
      }
    };
    if (tvShowID) {
      getTvShowDetails();
    }
  }, [tvShowID]);

  const AddToYourTvShows = async (id, name, year, type, creator) => {
    try {
      await axios
        .post(url + `/tvShow/`, {
          id: id,
          name: name,
          year: year,
          type: type,
          creator: creator,
          owner: user._id,
        })
        .then((response) => {
          setTvShowIds([...tvShowIds, id]);
          setToggleForList(true);
          toast.success(response.data.message);
        });
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };
  const AddToTvShowsWatchlist = async (
    id,
    name,
    year,
    type,
    creator,
    poster,
    plot
  ) => {
    try {
      if (!watchlistTvShowsIds.includes(id)) {
        const response = await axios.post(url + `/watchlist/tvShow/`, {
          id: id,
          name: name,
          year: year,
          type: type,
          creator: creator,
          poster: poster,
          plot: plot,
          owner: user._id,
        });
        // dispatch(addMovie({ id: id, title: title, director: director }));
        setWatchlistTvShowsIds([...watchlistTvShowsIds, id]);
        setToggleForWatchlist(true);
        toast.success(response.data.message);
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
        {" "}
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
          <ShowCard
            show={tvShow}
            user={user}
            toggleForList={toggleForList}
            toggleForWatchlist={toggleForWatchlist}
            AddToYourShows={AddToYourTvShows}
            AddToYourWatchlist={AddToTvShowsWatchlist}
            setOpenHaveToSignupModal={setOpenHaveToSignupModal}
          />
        )}
      </Box>
      <ToastContainer
        theme="dark"
        toastStyle={{
          backgroundColor: "black",
          color: "white",
        }}
        progressStyle={{
          backgroundColor: "var(--basic-color)",
        }}
        closeButton={{ color: "var(--basic-color)", fontSize: "18px" }}
      />
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
