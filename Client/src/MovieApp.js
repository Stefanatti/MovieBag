import "./MovieApp.scss";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Auth/Signup";
import Login from "./Pages/Auth/Login";
import MovieSearchResult from "./Pages/SearchResults";
import YourMoviesLibrary from "./Pages/MoviesPages/YourMoviesList";
import YourTvShowsList from "./Pages/TvShowsPages/YourTvShowsList";
import RenderMovie from "./Pages/MoviesPages/MovieCardPage";
import RenderTvShowCard from "./Pages/TvShowsPages/TvShowCardPage";
import Navbar from "./Components/Navbar";
import WatchlistMovies from "./Pages/MoviesPages/WatchlistMovies";
import WatchlistTvShows from "./Pages/TvShowsPages/WatchlistTvShows";
import WrongPage404 from "./Pages/WrongPage404";
import Footer from "./Components/Footer";
import { useSelector } from "react-redux";

function MovieApp() {
  let theme = useSelector((state) => state.theme.value);

  const PrivateRoute = ({ element, ...rest }) => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <div className={`App ${theme.theme}`}>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/yourmovies" element={<PrivateRoute />}>
              <Route index element={<YourMoviesLibrary />} />
            </Route>
            <Route path="/yourTvShows" element={<PrivateRoute />}>
              <Route index element={<YourTvShowsList />} />
            </Route>
            <Route path="/watchlist/movies" element={<PrivateRoute />}>
              <Route index element={<WatchlistMovies />} />
            </Route>
            <Route path="/watchlist/TvShows" element={<PrivateRoute />}>
              <Route index element={<WatchlistTvShows />} />
            </Route>
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
