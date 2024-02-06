import "../Styles/YourMoviesLibrary.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import Pagination from "../Components/Pagination";
import MoviesTable from "../Components/MoviesTable";
import { useSelector  } from "react-redux";
import {Container, Box, TableContainer} from "@mui/material";
import MovieLibraryFilter from "../Components/MovieLibraryFilter";
import { useMediaQuery } from 'react-responsive'
import MoviesTableMobile from "../Components/MoviesTableMobile";


const YourMoviesLibrary = () => {
  const navigate = useNavigate();
  let user = useSelector((state) => state.user.value)

  const [myMovies, setMyMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(10);
  const [myUnwatchedMovies, setMyUnwatchedMovies] = useState([]);
  const [watched, setWatched] = useState(false);
  const lastMovieIndex = currentPage * moviesPerPage;
  const firstMovieIndex = lastMovieIndex - moviesPerPage;
  const currentMyMovies = myMovies.slice(firstMovieIndex, lastMovieIndex);
  const currentMyUnwatchedMovies = myUnwatchedMovies.slice(
    firstMovieIndex,
    lastMovieIndex
  );
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })
  
  useEffect(() => {
    if (!user._id) {
      return;
    }
    setLoading(false);
    console.log(user._id)

    getMovies();
  }, [user._id]);

  const getMovies = () => {
    axios
      .get("http://localhost:3636/movie/" + user._id)
      .then(({ data }) => {
        console.log(data);
        setMyMovies(data);
        setMyUnwatchedMovies(data.filter((mov) => !mov.watched));
      })
      .catch((err) => console.log(err));
  };


  const removeMovie = async (id) => {
    const data = axios
      .delete("http://localhost:3636/movie/" + id)
      .then((res) => {
        getMovies();
        return res;
      });
    getMovies();
    setMyMovies((myMovies) =>
      myMovies.filter((myMovie) => myMovie._id !== data._id)
    );
  };

  const watchedMovie = async (id) => {
    const data = await fetch("http://localhost:3636/movie/watched/" + id, {
      method: "PUT",
    })
      .then((res) => res.json())
      .catch((err) => console.error("Error:", err));
    setMyMovies((myMovies) =>
      myMovies.map((myMovie) => {
        if (myMovie._id === data._id) {
          myMovie.watched = data.watched;
        }
        console.log(myMovies);
        return myMovie;
      })
    );
  };

  useEffect(() => {
    if (!search) {
      setMyMovies(myMovies);
    }
  }, [search]);

  const filterMovies = () => {
    setMyMovies(
      myMovies.filter((myMovie) => {
        return search.toLowerCase() === ""
          ? myMovie
          : myMovie.title.toLowerCase().includes(search);
      })
    );
  };

  const filterDirectors = () => {
    setMyMovies(
      myMovies.filter((myMovie) => {
        return search.toLowerCase() === ""
          ? myMovie
          : myMovie.director.toLowerCase().includes(search);
      })
    );
  };

  return ( 
    <Container>
    <Box>
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
      ) : 
      (
        <div className="movies-table-div">
          <div className="input-div">

            <MovieLibraryFilter 
            filterFunction={filterMovies}
            setMyMovies={setMyMovies} 
            myMovies={myMovies} 
            setSearch={setSearch} 
            search={search}/>

             <MovieLibraryFilter 
            filterFunction={filterDirectors}
            setMyMovies={setMyMovies} 
            myMovies={myMovies} 
            setSearch={setSearch} 
            search={search}/>
            
          </div>



          {/*{isTabletOrMobile ? (<MoviesTableMobile search={search}*/}
          {/*                                        myMovies={myMovies}*/}
          {/*                                        currentMyUnwatchedMovies={currentMyUnwatchedMovies}*/}
          {/*                                        currentMyMovies={currentMyMovies}*/}
          {/*                                        watchedMovie={watchedMovie}*/}
          {/*                                        navigate={navigate}*/}
          {/*                                        removeMovie={removeMovie}*/}
          {/*                                        watched={watched}*/}
          {/*                                        setWatched={setWatched}/>*/}
          {/*):*/}
          {/*    (*/}
          <TableContainer >

                  <MoviesTable
              search={search}
              myMovies={myMovies}
              currentMyUnwatchedMovies={currentMyUnwatchedMovies}
              currentMyMovies={currentMyMovies}
              watchedMovie={watchedMovie}
              navigate={navigate}
              removeMovie={removeMovie}
              watched={watched}
              setWatched={setWatched}
          />
          

          </TableContainer>
          <Pagination
          className= "down-pages"
          style={{marginBottom: "60px"}}
            totalMovies={watched ? myUnwatchedMovies.length : myMovies.length}
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
