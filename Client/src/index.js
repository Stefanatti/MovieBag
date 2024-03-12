import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MovieApp from "./MovieApp";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userReducer from "./Features/user";
import themeReducer from "./Features/theme";
import moviesReducer from "./Features/movies";
const store = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    theme: themeReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MovieApp />
    </Provider>
  </React.StrictMode>
);
