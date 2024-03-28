import "./MovieApp.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Auth/Signup";
import Login from "./Pages/Auth/Login";
import MovieSearchResult from "./Pages/SearchResults";
import YourMoviesLibrary from "./Pages/MoviesPages/YourMoviesList";
import YourTvShowsList from "./Pages/TvShowsPages/YourTvShowsList";
import RenderMovie from "./Pages/MoviesPages/MovieCard";
import RenderTvShowCard from "./Pages/TvShowsPages/TvShowCard";
import Navbar from "./Components/Navbar";
import WatchlistMovies from "./Pages/MoviesPages/WatchlistMovies";
import WatchlistTvShows from "./Pages/TvShowsPages/WatchlistTvShows";
import WrongPage404 from "./Pages/WrongPage404";
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
            <Route path="/yourTvShows" element={<YourTvShowsList />} />
            <Route path="/watchlist/movies" element={<WatchlistMovies />} />
            <Route path="/watchlist/TvShows" element={<WatchlistTvShows />} />
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
