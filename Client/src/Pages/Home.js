import { lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../Features/user";
import axios from "axios";
import { useState, useEffect } from "react";

function Home() {
  // let user = useSelector((state) => state.user.value);
  const Main = lazy(() => import("../Components/Main"));
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     axios
  //       .post("http://localhost:3636/user/verify", {
  //         token: localStorage.getItem("token"),
  //       })
  //       .then(({ data }) => {
  //         console.log(data);
  //         dispatch(login({ _id: data._id, username: data.username }));
  //       })
  //       .catch((err) => console.log(err));
  //   } else {
  //     dispatch(logout());
  //   }
  // }, [localStorage.getItem("token")]);

  return (
    <div>
      <Suspense fallback={<div> Please Wait... </div>}>
        <Main />
      </Suspense>
    </div>
  );
}

export default Home;
