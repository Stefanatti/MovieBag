import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from "../../Components/Pagination";
import MoviesTable from "../../Components/MoviesTable";
import { useSelector, useDispatch } from "react-redux";
import { Container, Box, TableContainer } from "@mui/material";
import MovieLibraryFilter from "../../Components/MovieLibraryFilter";
import { getUserMovies } from "../../Features/movies";
import useFetchData from "../../Hooks/useFetchData";

const YourTvShowsList = () => {
  let user = useSelector((state) => state.user.value);
  const url = process.env.REACT_APP_URL;

  const [myTvShows, setMyTvShows] = useState([]);
  const [pageloaded, setPageLoaded] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tvShowsPerPage] = useState(10);
  const lastTvShowIndex = currentPage * tvShowsPerPage;
  const firstTvShowIndex = lastTvShowIndex - tvShowsPerPage;
  const dispatch = useDispatch();

  const { data, loading, error } = useFetchData(`${url}/tvShow/`, user._id);

  useEffect(() => {
    if (data) {
      const fetchedTvShows = data;
      setMyTvShows(fetchedTvShows);
      dispatch(
        getUserMovies({
          id: fetchedTvShows.map((myTvShow) => myTvShow.id),
          title: fetchedTvShows.map((myTvShow) => myTvShow.title),
          director: fetchedTvShows.map((myTvShow) => myTvShow.director),
        })
      );
      setPageLoaded(loading);
    }
  }, [data, dispatch]);

  const removeTvShow = async (id) => {
    try {
      await axios.delete(url + `/tvShow/${id}`);
      setMyTvShows((MyTvShows) =>
        MyTvShows.filter((TvShow) => TvShow._id !== id)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

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

  const filterTvShows = myTvShows.filter((myTvShow) => {
    return search.toLowerCase() === ""
      ? myTvShow
      : myTvShow.name.toLowerCase().includes(search);
  });
  const currentMyTvShows = filterTvShows.slice(
    firstTvShowIndex,
    lastTvShowIndex
  );

  return (
    <Container>
      <Box sx={{ zIndex: "auto" }}>
        <h1 className="library-header">Your Tv Shows:</h1>
        {pageloaded ? (
          <ClipLoader
            color={"  var(--basic-color)"}
            className="loading"
            loading={pageloaded}
            cssOverride={{ marginLeft: " 50vw", marginTop: " 10vw" }}
            size={50}
            aria-label="Loading Spinner"
          />
        ) : myTvShows.length === 0 ? (
          <h2 className="library-header">
            Search for a tv show and added it to your list !
          </h2>
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
                path={`/tvShow?id=`}
                rateTheMovie={rateTheTvShow}
                currentMyMovies={currentMyTvShows}
                removeMovie={removeTvShow}
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
