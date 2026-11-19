import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MovieApp from "./MovieApp";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { combineReducers } from "redux";
import { userReducer } from "./Features/user";
import themeReducer from "./Features/theme";
import moviesReducer from "./Features/movies";

import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { movieApi } from "./Features/showsSlice";
import { syncExpiredSession } from "./api/axios";

const rootReducer = combineReducers({
  user: userReducer,
  movies: moviesReducer,
  theme: themeReducer,
  [movieApi.reducerPath]: movieApi.reducer,
});

const persistedKeys = ["movies", "theme"];
const persistConfig = {
  key: "root",
  storage,
  whitelist: persistedKeys,
  migrate: async (state) => state && Object.fromEntries(
    Object.entries(state).filter(([key]) => persistedKeys.includes(key)),
  ),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(movieApi.middleware),
});

export const persistor = persistStore(store);
syncExpiredSession(store);

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
