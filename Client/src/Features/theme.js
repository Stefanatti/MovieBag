import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = { theme: "" };

export const colorThemeSlice = createSlice({
  name: "theme",
  initialState: { value: { initialStateValue } },
  reducers: {
    themeSwich: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { themeSwich } = colorThemeSlice.actions;

export default colorThemeSlice.reducer;
