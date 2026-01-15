import { getSocket } from "../socket/Socket";

export const joinChatRoom = (chatId) => {
    const socket = getSocket()
    if(!socket) return;

    socket.emit("join-chat", chatId)
};

export const leaveChatRoom = (chatId) => {
    const socket = getSocket()
    if(!socket) return;

    socket.emit("leave-chat", chatId)
}