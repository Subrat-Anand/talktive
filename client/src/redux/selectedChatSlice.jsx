import { createSlice } from "@reduxjs/toolkit";

const selectedChatSlice = createSlice({
  name: "selectedChat",
  initialState: null,
  reducers: {
    setSelectedChat: (state, action) => action.payload,
    clearSelectedChat: () => null,
  },
});

export const { setSelectedChat, clearSelectedChat } = selectedChatSlice.actions;

export default selectedChatSlice.reducer;
