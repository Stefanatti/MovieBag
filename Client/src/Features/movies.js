import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = { id: null, title: null, director: null };

export const moviesSlice = createSlice({
  name: "movies",
  initialState: { value: { initialStateValue } },
  reducers: {
    getUserMovies: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { getUserMovies } = moviesSlice.actions;

export default moviesSlice.reducer;
