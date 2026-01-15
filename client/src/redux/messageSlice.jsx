import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: [],
  reducers: {
    setMessage: (state, action) => {
      return action.payload;
    },

    addMessage: (state, action) => {
      state.push(action.payload);
    },

    replaceMessage: (state, action) => {
      const { tempId, realMessage } = action.payload;

      const index = state.findIndex((m) => m.tempId === tempId);

      if (index !== -1) {
        state[index] = {
          ...realMessage,
          status: realMessage.status || "sent", // 🔥 VERY IMPORTANT
        };
      }
    },

    removeMessage: (state, action) => {
      const messageId = action.payload;
      return state.filter(
        (m) => String(m._id) !== String(messageId)
      );
    },

    setClearMessage: () => {
      return [];
    },
  },
});

export const {
  setMessage,
  addMessage,
  replaceMessage,
  removeMessage,
  setClearMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
