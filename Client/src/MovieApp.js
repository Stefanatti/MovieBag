import "./MovieApp.scss";
import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./Features/user";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

// Lazy-loaded pages
const Home = lazy(() => import("./Pages/Home"));
const Signup = lazy(() => import("./Pages/Auth/Signup"));
const Login = lazy(() => import("./Pages/Auth/Login"));
const ResetPassword = lazy(() => import("./Pages/Auth/ResetPassword"));
const MovieSearchResult = lazy(() => import("./Pages/SearchResults"));
const YourMoviesLibrary = lazy(
  () => import("./Pages/MoviesPages/YourMoviesList"),
);
const YourTvShowsList = lazy(
  () => import("./Pages/TvShowsPages/YourTvShowsList"),
);
const RenderMovie = lazy(() => import("./Pages/MoviesPages/MovieCardPage"));
const RenderTvShowCard = lazy(
  () => import("./Pages/TvShowsPages/TvShowCardPage"),
);
const WatchlistMovies = lazy(
  () => import("./Pages/MoviesPages/WatchlistMovies"),
);
const WatchlistTvShows = lazy(
  () => import("./Pages/TvShowsPages/WatchlistTvShows"),
);
const WrongPage404 = lazy(() => import("./Pages/WrongPage404"));
const ErrorPage = lazy(() => import("./Pages/ErrorPage"));

function MovieApp() {
  let theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  const url = process.env.REACT_APP_URL || "http://localhost:3000";

  // Verify session on app load using HttpOnly cookie
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axios.get(`${url}/user/verify`, {
          withCredentials: true,
        });
        dispatch(
          login({ _id: response.data._id, username: response.data.username }),
        );
      } catch (err) {
        dispatch(logout());
      }
    };
    verifySession();
  }, [dispatch, url]);

  const PrivateRoute = ({ element, ...rest }) => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <div className={`App ${theme.theme}`}>
      <Router>
        <div>
          <Navbar />
          <Suspense
            fallback={
              <ClipLoader
                color={"var(--basic-color)"}
                cssOverride={{ display: "block", margin: "20vh auto" }}
                size={50}
              />
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/reset_password/:token?"
                element={<ResetPassword />}
              />
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
              <Route path="/error_page" element={<ErrorPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default MovieApp;
