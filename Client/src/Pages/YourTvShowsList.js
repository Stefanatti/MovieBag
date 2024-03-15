import "../Styles/YourMoviesLibrary.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import Pagination from "../Components/Pagination";
import MoviesTable from "../Components/MoviesTable";
import { useSelector, useDispatch } from "react-redux";
import { Container, Box, TableContainer } from "@mui/material";
import MovieLibraryFilter from "../Components/MovieLibraryFilter";
import { getUserMovies } from "../Features/movies";

const YourTvShowsList = () => {
  const navigate = useNavigate();
  let user = useSelector((state) => state.user.value);

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
    console.log(user._id);

    getTvShows();
  }, [user._id]);

  const getTvShows = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3636/tvShow/" + user._id
      );
      console.log(response.data);
      //   dispatch(
      //     getUserMovies({
      //       id: response.data.id,
      //       title: response.data.title,
      //       director: response.data.director,
      //     })
      //   );

      setMyTvShows(response.data);

      //   setMyUnwatchedMovies(response.data.filter((mov) => !mov.watched));
    } catch (err) {
      console.log(err);
    }
  };

  const removeTvShow = async (id) => {
    const data = await axios
      .delete("http://localhost:3636/tvShow/" + id)
      .then((res) => {
        getTvShows();
        return res;
      });
    getTvShows();
    setMyTvShows((myTvShows) =>
      myTvShows.filter((myTvShow) => myTvShow.id !== data.id)
    );
  };

  const watchedTvShow = async (id) => {
    const data = await fetch("http://localhost:3636/movie/watched/" + id, {
      method: "PUT",
    })
      .then((res) => res.json())
      .catch((err) => console.error("Error:", err));
    setMyTvShows((myTvShows) =>
      myTvShows.map((myTvShow) => {
        if (myTvShow.id === data.id) {
          myTvShow.watched = data.watched;
        }
        console.log(myTvShows);
        return myTvShow;
      })
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
      : myTvShow.title.toLowerCase().includes(search);
  });
  const currentMyTvShows = filterTvShows.slice(
    firstTvShowIndex,
    lastTvShowIndex
  );

  // const filterDirectors = () => {
  //   setMyMovies(
  //     myMovies.filter((myMovie) => {
  //       return search.toLowerCase() === ""
  //         ? myMovie
  //         : myMovie.director.toLowerCase().includes(search);
  //     })
  //   );
  // };

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
              <MovieLibraryFilter setSearch={setSearch} search={search} />

              {/* <MovieLibraryFilter 
            filterFunction={filterDirectors}
            setMyMovies={setMyMovies} 
            myMovies={myMovies} 
            setSearch={setSearch} 
            search={search}/> */}
            </div>

            <TableContainer>
              <MoviesTable
                search={search}
                myMovies={myTvShows}
                filterMovies={filterTvShows}
                path={`/tvShow?id=`}
                currentMyMovies={currentMyTvShows}
                watchedMovie={watchedTvShow}
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
