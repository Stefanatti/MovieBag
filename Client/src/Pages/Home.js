import { lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../Features/user";
import { useState, useEffect } from "react";
import { getUserMovies } from "../Features/movies";
import useFetchData from "../Hooks/useFetchData";

function Home() {
  const url = process.env.REACT_APP_URL;
  const Main = lazy(() => import("../Components/Main"));
  let user = useSelector((state) => state.user.value);
  const [myMovies, setMyMovies] = useState([]);
  const dispatch = useDispatch();

  const { data } = useFetchData(url + `/movie/`, user._id);

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
      <Suspense>
        <Main user={user} />
      </Suspense>
    </div>
  );
}

export default Home;
