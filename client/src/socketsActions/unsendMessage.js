import { getSocket } from "../socket/Socket";

/* ===== EMIT ===== */
export const unsendMessage = ({ chatId, messageId }) => {
  const socket = getSocket();
  if (!socket) return;
  socket.emit("unsend-message", { chatId, messageId });
};

/* ===== LISTEN ===== */
export const onMessageUnsent = (callback) => {
  const socket = getSocket();
  if (!socket) return;
  socket.on("message-unsent", callback);
};

/* ===== CLEANUP (SAFE) ===== */
export const offMessageUnsent = (callback) => {
  const socket = getSocket();
  if (!socket) return;
  socket.off("message-unsent", callback);
};
