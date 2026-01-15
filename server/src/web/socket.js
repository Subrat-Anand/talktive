// socket.js
const http = require("http");
const { Server } = require("socket.io");

const createSocketServer = (app) => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "https://frontdms.onrender.com",
      credentials: true,
    },
    pingTimeout: 60000,   // 🔥 strong
    pingInterval: 25000, // 🔥 strong
  });

  // 🔥 track user state
  const userSocketMap = new Map(); // userId -> socket.id
  const socketRoomsMap = new Map(); // socket.id -> Set(chatIds)

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socketRoomsMap.set(socket.id, new Set());

    // =====================
    // USER REGISTER
    // =====================
    socket.on("myId", (myId) => {
      socket.userId = myId;
      userSocketMap.set(myId, socket.id);

      socket.join(myId); // personal room
      console.log("User online:", myId);
    });

    // =====================
    // JOIN CHAT
    // =====================
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      socketRoomsMap.get(socket.id).add(chatId);

      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    // =====================
    // LEAVE CHAT
    // =====================
    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
      socketRoomsMap.get(socket.id).delete(chatId);

      console.log(`Socket ${socket.id} left chat ${chatId}`);
    });

    // =====================
    // SEND MESSAGE
    // =====================
    socket.on("send-message", (msg) => {
      io.to(msg.chatId).emit("receive-message", msg);
    });

    // =====================
    // TYPING
    // =====================
    socket.on("typing", (chatId) => {
      socket.to(chatId).emit("typing", {
        chatId,
        userId: socket.userId,
      });
    });

    socket.on("stop-typing", (chatId) => {
      socket.to(chatId).emit("stop-typing", {
        chatId,
        userId: socket.userId,
      });
    });

    // =====================
    // UNSEND MESSAGE
    // =====================
    socket.on("unsend-message", ({ chatId, messageId, tempId}) => {
      if (!chatId || !messageId) return;

      console.log("chatId: ", chatId, "messageId: ", messageId, "tempId: ", tempId)

      // optional: ensure socket joined this chat
      // if (!socketRoomsMap.get(socket.id)?.has(chatId)) return;

      io.to(chatId).emit("message-unsent", {
        chatId,
        messageId,
        tempId
      });
    });

    // =====================
    // DISCONNECT
    // =====================
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      // cleanup
      if (socket.userId) {
        userSocketMap.delete(socket.userId);
      }

      socketRoomsMap.delete(socket.id);
    });
  });

  return { server, io };
};

module.exports = createSocketServer;
