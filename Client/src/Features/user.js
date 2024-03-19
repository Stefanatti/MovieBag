import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = { _id: "", username: "" };

export const userSlice = createSlice({
  name: "user",
  initialState: { value: { initialStateValue } },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = initialStateValue;
    },
  },
});
export const userReducer = userSlice.reducer;

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
