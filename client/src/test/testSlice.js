import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: [],
  reducers: {
    setMessages: (state, action) => {
      return action.payload;
    },

    addTempMessage: (state, action) => {
      state.push(action.payload);
    },

    replaceMessage: (state, action) => {
    const realMsg = action.payload;

    const pendingMsg = state.find(
      (m) => m._id === realMsg.tempId
    );

    if (pendingMsg) {
      Object.assign(pendingMsg, realMsg);
    }
  },

  setClearMessage: () => {
    return [];
  },
  removeMessage: (state, action) => {
  const { messageId, tempId } = action.payload;

  return state.filter(
    (msg) =>
      msg._id !== messageId &&
      msg._id !== tempId
  );
}
},
});

export const {
  setMessages,
  addTempMessage,
  replaceMessage,
  setClearMessage,
  removeMessage
} = messageSlice.actions;

export default messageSlice.reducer;





import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../redux/selectedChatSlice";

const ChatPage = () => {
  const chats = useSelector((store) => store.chat);
  const selectedChat = useSelector((store) => store.selectedChat);
  const dispatch = useDispatch();

  return (
    <div
      className={`
        bg-white border-r border-gray-200 flex flex-col
        w-full md:w-72
        ${selectedChat ? "hidden md:flex" : "flex"}
      `}
      style={{
          backgroundImage: "url('/image8.png')",
          backgroundSize: "cover",
        }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-red-500">
          Chats
        </h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => dispatch(setSelectedChat(chat))}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer
                       hover:bg-gray-700 transition"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white
                            flex items-center justify-center font-semibold">
              {chat?.participants?.[0]?.name?.charAt(0)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">
                {chat?.participants?.[0]?.name}
              </p>
              <p className="text-sm text-white truncate">
                {
                  <span className="font-semibold text-white">{chat?.participants?.[0]?.name}:  </span>
                }
                {/* {
                  chat?.latestMessage?.text
                } */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
