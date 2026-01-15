import { getSocket } from "../socket/Socket";

// user typing
export const emitTyping = (chatId) => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit("typing", chatId);
};

// user stopped typing
export const emitStopTyping = (chatId) => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit("stop-typing", chatId);
};

// listen typing
export const onTyping = (callback) => {
  const socket = getSocket();
  if (!socket) return;

  socket.off("typing");
  socket.on("typing", callback);
};

// listen stop typing
export const onStopTyping = (callback) => {
  const socket = getSocket();
  if (!socket) return;

  socket.off("stop-typing");
  socket.on("stop-typing", callback);
};
