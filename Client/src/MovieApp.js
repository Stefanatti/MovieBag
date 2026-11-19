import "./MovieApp.scss";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./Features/user";
import { verifyAccountSession } from "./api/auth";
import SessionRoutes from "./Pages/Auth/SessionRoutes";
import { Box } from "@mui/material";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy-loaded pages
const Home = lazy(() => import("./Pages/Home"));
const Signup = lazy(() => import("./Pages/Auth/Signup"));
const Login = lazy(() => import("./Pages/Auth/Login"));
const ForgotPassword = lazy(() => import("./Pages/Auth/ForgotPassword"));
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
const MyReviews = lazy(() => import("./Pages/MyReviews"));

function MovieApp() {
  let theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  const [session, setSession] = useState("checking");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const verifySession = async () => {
      try {
        const { data } = await verifyAccountSession(controller.signal);
        if (controller.signal.aborted) return;
        if (!data?._id) throw new Error("Missing session user");
        dispatch(login(data));
        setSession("ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err.response?.status === 401) {
          dispatch(logout());
          setSession("ready");
        } else {
          setSession("unavailable");
        }
      }
    };
    verifySession();
    return () => controller.abort();
  }, [dispatch, attempt]);

  const retrySession = () => {
    setSession("checking");
    setAttempt((value) => value + 1);
  };

  // Sync theme class on <body> so MUI portals (Dialogs) inherit CSS variables
  useEffect(() => {
    document.body.className = theme.theme || "";
  }, [theme.theme]);

  return (
    <div className={`App ${theme.theme}`}>
      <Router>
        <Navbar />
        <Box component="main" sx={{ flex: 1 }}>
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
              <Route element={<SessionRoutes session={session} />}>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot_password" element={<ForgotPassword />} />
                <Route path="/reset_password/:token?" element={<ResetPassword />} />
              </Route>
              <Route element={<SessionRoutes privateOnly session={session} retry={retrySession} />}>
                <Route path="/yourmovies" element={<YourMoviesLibrary />} />
                <Route path="/yourTvShows" element={<YourTvShowsList />} />
                <Route path="/myreviews" element={<MyReviews />} />
                <Route path="/watchlist/movies" element={<WatchlistMovies />} />
                <Route path="/watchlist/TvShows" element={<WatchlistTvShows />} />
              </Route>
              <Route path="/movieSearch" element={<MovieSearchResult />} />
              <Route path="/movie" element={<RenderMovie />} />
              <Route path="/tvShow" element={<RenderTvShowCard />} />
              <Route path="/*" element={<WrongPage404 />} />
              <Route path="/error_page" element={<ErrorPage />} />
            </Routes>
          </Suspense>
        </Box>
      </Router>
      <Footer />
      <ToastContainer
        position="bottom-left"
        theme="dark"
        toastStyle={{
          backgroundColor: "black",
          color: "white",
        }}
        progressStyle={{
          backgroundColor: "var(--basic-color)",
        }}
        closeButton={{ color: "var(--basic-color)", fontSize: "18px" }}
      />
    </div>
  );
}

export default MovieApp;
