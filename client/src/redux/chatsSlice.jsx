import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: [],
  reducers: {
    setMyChats: (state, action) => {
      return action.payload;
    },

    updateLatestMessage: (state, action) => {
      const { chatId, message } = action.payload;

      const index = state.findIndex((c) => c._id === chatId);

      if (index !== -1) {
        state[index].latestMessage = message;

        // 🔥 optional but recommended (move chat to top)
        const [chat] = state.splice(index, 1);
        state.unshift(chat);
      }
    },
    addChatIfNotExists: (state, action) => {
      const chat = action.payload;
      const exists = state.find((c) => c._id === chat._id);
      if (!exists) {
        state.unshift(chat);
      }
    },
  }
});

export const { setMyChats, updateLatestMessage, addChatIfNotExists } = chatSlice.actions;
export default chatSlice.reducer;
