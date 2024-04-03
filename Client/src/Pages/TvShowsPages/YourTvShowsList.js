import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Components/Pagination";
import MoviesTable from "../../Components/MoviesTable";
import { useSelector, useDispatch } from "react-redux";
import { Container, Box, TableContainer } from "@mui/material";
import MovieLibraryFilter from "../../Components/MovieLibraryFilter";
import { getUserMovies } from "../../Features/movies";

const YourTvShowsList = () => {
  const navigate = useNavigate();
  let user = useSelector((state) => state.user.value);
  const url = process.env.REACT_APP_URL;

  const [myTvShows, setMyTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tvShowsPerPage] = useState(10);
  const [myUnwatchedTvShows, setMyUnwatchedTvShows] = useState([]);
  const [watched, setWatched] = useState(false);
  const lastTvShowIndex = currentPage * tvShowsPerPage;
  const firstTvShowIndex = lastTvShowIndex - tvShowsPerPage;
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user._id) {
      return;
    }
    setLoading(false);

    getTvShows();
  }, [user._id]);

  const getTvShows = async () => {
    try {
      const response = await axios.get(url + `/tvShow/` + user._id);
      dispatch(
        getUserMovies({
          id: response.data.id,
          title: response.data.title,
          director: response.data.director,
        })
      );
      setMyTvShows(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const removeTvShow = async (id) => {
    const data = await axios.delete(url + `/tvShow/` + id).then((res) => {
      getTvShows();
      return res;
    });
    getTvShows();
    setMyTvShows((myTvShows) =>
      myTvShows.filter((myTvShow) => myTvShow.id !== data.id)
    );
  };

  useEffect(() => {
    if (!search) {
      setMyTvShows(myTvShows);
    }
  }, [search]);

  const filterTvShows = myTvShows.filter((myTvShow) => {
    return search.toLowerCase() === ""
      ? myTvShow
      : myTvShow.name.toLowerCase().includes(search);
  });
  const currentMyTvShows = filterTvShows.slice(
    firstTvShowIndex,
    lastTvShowIndex
  );

  const handleRatingChange = (id, stars) => {
    setMyTvShows((prevTvShows) =>
      prevTvShows.map((tvShow) =>
        tvShow._id === id ? { ...tvShow, ratings: { stars: stars } } : tvShow
      )
    );
  };

  const rateTheTvShow = async (id, stars) => {
    handleRatingChange(id, stars);
    try {
      const data = {
        stars: stars,
      };
      await axios.put(url + `/tvShow/rate/${id}`, data).then((response) => {
        console.log("Success:", response.data);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container>
      <Box sx={{ zIndex: "auto" }}>
        <h1 className="library-header">Your Tv Shows:</h1>
        {loading ? (
          <ClipLoader
            color={"  var(--basic-color)"}
            className="loading"
            loading={loading}
            cssOverride={{ marginLeft: " 50vw", marginTop: " 10vw" }}
            size={50}
            aria-label="Loading Spinner"
          />
        ) : (
          <div className="movies-table-div">
            <div className="input-div">
              <MovieLibraryFilter
                placeholder={"Search for a Tv Show"}
                setSearch={setSearch}
                search={search}
              />
            </div>

            <TableContainer>
              <MoviesTable
                search={search}
                myMovies={myTvShows}
                filterMovies={filterTvShows}
                path={`/tvShow?id=`}
                rateTheMovie={rateTheTvShow}
                currentMyMovies={currentMyTvShows}
                navigate={navigate}
                removeMovie={removeTvShow}
                watched={watched}
                setWatched={setWatched}
              />
            </TableContainer>
            <Pagination
              className="down-pages"
              style={{ marginBottom: "60px" }}
              totalMovies={filterTvShows.length}
              moviesPerPage={tvShowsPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        )}
      </Box>
    </Container>
  );
};

export default YourTvShowsList;
