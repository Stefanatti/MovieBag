import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = { _id: "", username: "" };

export const userSlice = createSlice({
  name: "user",
  initialState: { value: { ...initialStateValue }, isAuthenticated: false },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.value = initialStateValue;
      state.isAuthenticated = false;
    },
  },
});
export const userReducer = userSlice.reducer;

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
