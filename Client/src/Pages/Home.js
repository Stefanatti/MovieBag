import { lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../Features/user";
import axios from "axios";
import { useState, useEffect } from "react";
import { getUserMovies } from "../Features/movies";
import useFetchData from "../Hooks/useFetchData";

function Home() {
  const [myMovies, setMyMovies] = useState([]);
  const [user, setUser] = useState([]);
  // let user = useSelector((state) => state.user.value);

  const Main = lazy(() => import("../Components/Main"));
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .post("http://localhost:3636/user/verify", {
          token: localStorage.getItem("token"),
        })
        .then(({ data }) => {
          console.log(data);
          dispatch(login({ _id: data._id, username: data.username }));
          setUser(data);
        })

        .catch((err) => console.log(err));
    } else {
      dispatch(logout());
    }
  }, [localStorage.getItem("token")]);

  const { data } = useFetchData(`http://localhost:3636/movie/`, user._id);

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

  return (
    <div>
      <Suspense fallback={<div> Please Wait... </div>}>
        <Main />
      </Suspense>
    </div>
  );
}

export default Home;
