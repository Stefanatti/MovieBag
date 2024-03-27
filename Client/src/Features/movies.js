import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = { id: "", title: "", director: "" };

export const moviesSlice = createSlice({
  name: "movies",
  initialState: { value: initialStateValue },
  reducers: {
    getUserMovies: (state, action) => {
      state.value = action.payload;
    },
    addMovie: (state, action) => {
      state.value = [...state.value, action.payload];
    },
  },
});

export const { getUserMovies, addMovie } = moviesSlice.actions;

export default moviesSlice.reducer;
