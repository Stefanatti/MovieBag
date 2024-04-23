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
  },
});

export default topRatedTvShowsSlice.reducer;

export const fetchTopRatedTvShowsSlice = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${url}/api/toprated`);
      dispatch(topRatedTvShowsSlice.actions.getTopRatedTvShows(response.data));
    } catch (error) {
      dispatch(topRatedTvShowsSlice.actions.hasError(error.message));
    }
  };
};
