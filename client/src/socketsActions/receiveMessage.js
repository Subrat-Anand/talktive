// src/socketActions/receiveMessage.js
import { getSocket } from "../socket/Socket";

/**
 * Listen for incoming messages
 * @param {(msg: any) => void} callback
 */
export const onReceiveMessage = (callback) => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("receive-message", callback);
};

/**
 * Stop listening (important to avoid duplicate listeners)
 * @param {(msg: any) => void} callback
 */
export const offReceiveMessage = (callback) => {
  const socket = getSocket();
  if (!socket) return;

  socket.off("receive-message", callback);
};
