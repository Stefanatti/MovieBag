import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = process.env.REACT_APP_URL;

const initialState = { topRatedMovies: [], error: null };

export const topRatedMoviesSlice = createSlice({
  name: "topRatedMovies",
  initialState,
  reducers: {
    getTopRatedMovies: (state, action) => {
      state.topRatedMovies = action.payload;
    },
    hasError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export default topRatedMoviesSlice.reducer;

export const fetchTopRatedMoviesSlice = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${url}/api/toprated`);
      dispatch(topRatedMoviesSlice.actions.getTopRatedMovies(response.data));
    } catch (error) {
      dispatch(topRatedMoviesSlice.actions.hasError(error.message));
    }
  };
};
