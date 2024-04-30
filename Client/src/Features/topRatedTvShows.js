import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = process.env.REACT_APP_URL;

const initialState = { topRatedTvShows: [], error: null };

export const topRatedTvShowsSlice = createSlice({
  name: "topRatedTvShows",
  initialState,
  reducers: {
    getTopRatedTvShows: (state, action) => {
      state.topRatedTvShows = action.payload;
    },
    hasError: (state, action) => {
      state.error = action.payload;
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

export default topRatedTvShowsSlice.reducer;

export const fetchTopRatedTvShows = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${url}/api/tv/toprated`);
      dispatch(topRatedTvShowsSlice.actions.getTopRatedTvShows(response.data));
    } catch (error) {
      dispatch(topRatedTvShowsSlice.actions.hasError(error.message));
    }
  };
};

export const clearTopRatedTvShowsData = () => {
  return (dispatch) => {
    dispatch(topRatedTvShowsSlice.actions.clearData());
  };
};
