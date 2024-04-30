import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = process.env.REACT_APP_URL;

const initialState = { popularTvShows: [], error: null };

export const popularTvShowsSlice = createSlice({
  name: "popularTvShows",
  initialState,
  reducers: {
    getPopularTvShows: (state, action) => {
      state.popularTvShows = action.payload;
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

export default popularTvShowsSlice.reducer;

export const fetchPopularTvShows = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${url}/api/tv/popular`);
      dispatch(popularTvShowsSlice.actions.getPopularTvShows(response.data));
    } catch (error) {
      dispatch(popularTvShowsSlice.actions.hasError(error.message));
    }
  };
};

export const clearPopularTvShowsData = () => {
  return (dispatch) => {
    dispatch(popularTvShowsSlice.actions.clearData());
  };
};
