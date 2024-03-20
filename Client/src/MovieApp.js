import "./MovieApp.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import MovieSearchResult from "./Pages/MovieSearch";
import YourMoviesLibrary from "./Pages/YourMoviesLibrary";
import YourTvShowsList from "./Pages/YourTvShowsList";
import RenderMovie from "./Pages/Movie";
import RenderTvShowCard from "./Pages/TvShowCardPage";
import Navbar from "./Components/Navbar";
import WatchlistMovies from "./Pages/WatchlistMovies";
import WrongPage404 from "./Pages/WrongPage404";
import Footer from "./Components/Footer";
import { useSelector } from "react-redux";

import { lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./Features/user";
import axios from "axios";
import { useState, useEffect } from "react";
import { getUserMovies } from "./Features/movies";
import useFetchData from "./Hooks/useFetchData";

function MovieApp() {
  let theme = useSelector((state) => state.theme.value);
  let user = useSelector((state) => state.user.value);
  // console.log(user);
  // const dispatch = useDispatch();
  // const [myMovies, setMyMovies] = useState([]);

  // const { data } = useFetchData(`http://localhost:3636/movie/`, user._id);

  // useEffect(() => {
  //   setMyMovies(data);
  //   console.log(myMovies);
  //   dispatch(
  //     getUserMovies({
  //       id: myMovies.map((myMovie) => myMovie.id),
  //       title: myMovies.map((myMovie) => myMovie.title),
  //       director: myMovies.map((myMovie) => myMovie.director),
  //     })
  //   );
  // }, [data]);

  return (
    <div className={`App ${theme.theme}`}>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/yourmovies" element={<YourMoviesLibrary />} />
            <Route path="/yourTvShows" element={<YourTvShowsList />} />
            <Route path="/watchlist/movies" element={<WatchlistMovies />} />

            <Route path="/movieSearch" element={<MovieSearchResult />} />
            <Route path="/movie" element={<RenderMovie />} />
            <Route path="/tvShow" element={<RenderTvShowCard />} />

            <Route path="/*" element={<WrongPage404 />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default MovieApp;
