import { io } from "socket.io-client";
import { ServerUrl } from "../App";

let socket = null;
let myUserId = null;
let joinedChats = new Set(); // 🔥 track joined chat rooms

export const initSocket = (userId) => {
  myUserId = userId;

  if (socket?.connected) return socket;

  socket = io(ServerUrl, {
    autoConnect: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on("connect", () => {

    if (myUserId) {
      socket.emit("myId", myUserId);
    }

    // 🔥 REJOIN ALL PREVIOUSLY JOINED CHAT ROOMS
    joinedChats.forEach((chatId) => {
      socket.emit("join-chat", chatId);
    });
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 socket disconnected:", reason);
  });

  socket.on("reconnect", () => {

    // 🔁 Rejoin all chats after reconnect
    joinedChats.forEach((chatId) => {
      console.log("Rejoining chat room after reconnect:", chatId);
      socket.emit("join-chat", chatId);
    });
  });

  return socket;
};


export const getSocket = () => socket;
