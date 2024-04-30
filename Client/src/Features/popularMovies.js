import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = process.env.REACT_APP_URL;

const initialState = { popularMovies: [], error: null, loading: false };

export const popMoviesSlice = createSlice({
  name: "popularMovies",
  initialState,
  reducers: {
    getPopularMovies: (state, action) => {
      state.popularMovies = action.payload;
    },
    hasError: (state, action) => {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearData: (state) => {
      state.popularMovies = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export default popMoviesSlice.reducer;

export const fetchPopularMovies = () => {
  return async (dispatch) => {
    dispatch(popMoviesSlice.actions.setLoading(true));
    try {
      const response = await axios.get(`${url}/api/popular`);
      dispatch(popMoviesSlice.actions.getPopularMovies(response.data));
    } catch (error) {
      dispatch(popMoviesSlice.actions.hasError(error.message));
    } finally {
      dispatch(popMoviesSlice.actions.setLoading(false));
    }
  };
};

export const clearPopularMoviesData = () => {
  return (dispatch) => {
    dispatch(popMoviesSlice.actions.clearData());
  };
};
