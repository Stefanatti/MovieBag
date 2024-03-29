import "../../Styles/YourMoviesLibrary.scss";
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
import useFetchData from "../../Hooks/useFetchData";
const YourMoviesLibrary = () => {
  const navigate = useNavigate();
  let user = useSelector((state) => state.user.value);

  const [myMovies, setMyMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10);
  const [myUnwatchedMovies, setMyUnwatchedMovies] = useState([]);
  const [watched, setWatched] = useState(false);
  const lastMovieIndex = currentPage * moviesPerPage;
  const firstMovieIndex = lastMovieIndex - moviesPerPage;
  const dispatch = useDispatch();

  const { data, loading, error } = useFetchData(
    `http://localhost:3636/movie/`,
    user._id
  );

  useEffect(() => {
    if (data) setMyMovies(data);
    dispatch(
      getUserMovies({
        id: myMovies.map((myMovie) => myMovie.id),
        title: myMovies.map((myMovie) => myMovie.title),
        director: myMovies.map((myMovie) => myMovie.director),
      })
    );
  }, [data]);

  const removeMovie = async (id) => {
    try {
      await axios.delete(`http://localhost:3636/movie/${id}`);
      setMyMovies((MyMovies) => MyMovies.filter((movie) => movie._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!search) {
      setMyMovies(myMovies);
    }
  }, [search]);

  const filterMovies = myMovies.filter((myMovie) => {
    return search.toLowerCase() === ""
      ? myMovie
      : myMovie.title.toLowerCase().includes(search);
  });
  const currentMyMovies = filterMovies.slice(firstMovieIndex, lastMovieIndex);

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
        <h1 className="library-header">Your Movies:</h1>
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
                placeholder={"Search for a Movie"}
                setSearch={setSearch}
                search={search}
              />

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
                myMovies={myMovies}
                filterMovies={filterMovies}
                path={`/movie?id=`}
                currentMyMovies={currentMyMovies}
                // watchedMovie={watchedMovie}
                navigate={navigate}
                removeMovie={removeMovie}
                watched={watched}
                setWatched={setWatched}
              />
            </TableContainer>
            <Pagination
              className="down-pages"
              style={{ marginBottom: "60px" }}
              totalMovies={filterMovies.length}
              moviesPerPage={moviesPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        )}
      </Box>
    </Container>
  );
};

export default YourMoviesLibrary;
