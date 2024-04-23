import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MovieApp from "./MovieApp";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { combineReducers } from "redux"; // Import combineReducers

import { userReducer, userSlice } from "./Features/user";
import themeReducer from "./Features/theme";
import moviesReducer from "./Features/movies";
import popularMoviesReducer from "./Features/popularMovies";
import popularTvShowsReducer from "./Features/popularTvShows";
import topRatedMoviesReducer from "./Features/topRatedMovies";
import topRatedTvShowsReducer from "./Features/topRatedTvShows";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const rootReducer = combineReducers({
  user: userReducer,
  movies: moviesReducer,
  popularMovies: popularMoviesReducer,
  popularTvShows: popularTvShowsReducer,
  topRatedMovies: topRatedMoviesReducer,
  topRatedTvShows: topRatedTvShowsReducer,

  theme: themeReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MovieApp />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
