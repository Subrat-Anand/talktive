import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
  name: "toggle",
  initialState: {
    isOpen: false,
  },
  reducers: {
    openToggle: (state) => {
      state.isOpen = true;
    },
    closeToggle: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openToggle, closeToggle } = toggleSlice.actions;
export default toggleSlice.reducer;
