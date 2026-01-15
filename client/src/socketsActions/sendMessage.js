// src/socketActions/sendMessage.js
import { getSocket } from "../socket/Socket";

export const sendMessageSocket = (message) => {
  const socket = getSocket();
  if (!socket || !socket.connected) return;

  /*
    message example:
    {
      chatId: "123",
      senderId: "456",
      text: "Hello",
      tempId: "abc123" // optional (optimistic UI ke liye)
    }
  */

  socket.emit("send-message", message);
};
