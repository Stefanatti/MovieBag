import "./MovieApp.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import MovieSearchResult from "./Pages/MovieSearch";
import YourMoviesLibrary from "./Pages/YourMoviesLibrary";
import RenderMovie from "./Pages/Movie";
import Navbar from "./Components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import WrongPage404 from "./Pages/WrongPage404";
import { useState } from "react";
import Footer from "./Components/Footer";
import { useSelector } from "react-redux";

function MovieApp() {
  let theme = useSelector((state) => state.theme.value);

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
            <Route path="/movieSearch" element={<MovieSearchResult />} />
            <Route path="/movie" element={<RenderMovie />} />
            <Route path="/*" element={<WrongPage404 />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default MovieApp;
