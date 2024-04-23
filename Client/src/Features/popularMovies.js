import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = process.env.REACT_APP_URL;

const initialState = { popularMovies: [], error: null };

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
  },
});

export default popMoviesSlice.reducer;

export const fetchPopularMovies = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${url}/api/popular`);
      dispatch(popMoviesSlice.actions.getPopularMovies(response.data));
    } catch (error) {
      dispatch(popMoviesSlice.actions.hasError(error.message));
    }
  };
};
