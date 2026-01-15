import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { FaRegPaperPlane } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";

import { clearSelectedChat } from "../redux/selectedChatSlice";
import {
  setMessages,
  addTempMessage,
  replaceMessage,
  setClearMessage,
  removeMessage,
} from "../redux/messageSlice";

import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import ChatLoading from "../components/ChatLoading";
import { ServerUrl } from "../App";

import { sendMessage } from "../socketsActions/sendMessage";
import {
  onReceiveMessage,
  offReceiveMessage,
} from "../socketsActions/receiveMessage";

import { updateLatestMessage } from "../redux/chatsSlice";
import {
  emitStopTyping,
  emitTyping,
  onStopTyping,
  onTyping,
} from "../socketsActions/typing";
import { offMessageUnsent, onMessageUnsent } from "../socketsActions/unsendMessage";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((s) => s.selectedChat);
  const messages = useSelector((s) => s.message);
  const user = useSelector((s) => s.user);

  const myId = user?._id;

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  

  /* ================= RECEIVE MESSAGE ================= */

  useEffect(() => {
    if (!selectedChat?._id) return;

    const handleReceive = (msg) => {
      const senderId = msg.senderId?._id || msg.senderId;

      // sidebar latest message
      dispatch(
        updateLatestMessage({
          chatId: msg.chatId,
          message: msg,
        })
      );

      // ignore own message
      if (senderId === myId) return;

      // ignore other chat
      if (msg.chatId !== selectedChat._id) return;

      dispatch(addTempMessage(msg));
      console.log(msg)
    };

    onReceiveMessage(handleReceive);
    return () => offReceiveMessage();
  }, [selectedChat?._id, myId, dispatch]);

  /* ================= FETCH MESSAGES ================= */

  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${ServerUrl}/api/message/${selectedChat._id}`,
          { withCredentials: true }
        );
        dispatch(setMessages(res.data));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat?._id, dispatch]);

    /* ================= LISTEN UNSEND MESSAGE ================= */

useEffect(() => {
  if (!selectedChat?._id) return;

  const handleUnsend = ({ chatId, messageId, tempId }) => {
    console.log("listen chatId: ", chatId)
    console.log("listen msgId: ", messageId)
    // ✅ sirf active chat me delete
    if (chatId === selectedChat._id) {
      dispatch(removeMessage({
        messageId,
        tempId
      }));
    }
  };

  onMessageUnsent(handleUnsend);

  return () => {
    offMessageUnsent(handleUnsend);
  };
}, [selectedChat?._id, dispatch]);

  /* ================= SEND MESSAGE ================= */

  const handleSendMessage = async () => {
    if (!text.trim()) return;

    const tempId = `temp-${Date.now()}`;

    const tempMessage = {
      _id: tempId,
      tempId,
      chatId: selectedChat._id,
      senderId: myId,
      text,
      status: "pending",
    };

    // optimistic UI
    dispatch(addTempMessage(tempMessage));

    dispatch(
      updateLatestMessage({
        chatId: selectedChat._id,
        message: tempMessage,
      })
    );

    sendMessage({
      chatId: selectedChat._id,
      senderId: myId,
      text,
      _id: tempId,
    });

    setText("");

    try {
      const res = await axios.post(
        `${ServerUrl}/api/message/send`,
        { chatId: selectedChat._id, text },
        { withCredentials: true }
      );

      dispatch(
        replaceMessage({
          tempId,
          ...res.data.data,
          status: "sent",
        })
      );
    } catch (err) {
      dispatch(replaceMessage({
      _id: tempId,
      tempId,
      chatId: selectedChat._id,
      senderId: myId,
      text,
      status: "failed",
      }))
      console.log(err);
    }
  };

  /* ================= TYPING ================= */

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!selectedChat?._id) return;

    emitTyping(selectedChat._id);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(selectedChat._id);
    }, 1000);
  };

  useEffect(() => {
    if (!selectedChat?._id) return;

    onTyping(() => setIsTyping(true));
    onStopTyping(() => setIsTyping(false));

    return () => setIsTyping(false);
  }, [selectedChat?._id]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ================= CLOSE CHAT ================= */

  const handleCloseChat = () => {
    dispatch(setClearMessage());
    dispatch(clearSelectedChat());
    setText("");
  };

  /* ================= UI ================= */

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* HEADER */}
      <div className="p-4 bg-black fixed w-full z-20 flex items-center gap-3">
        <button onClick={handleCloseChat} className="md:hidden">
          <IoMdArrowRoundBack size={22} color="red" />
        </button>
        <span className="text-white font-semibold">
          {selectedChat?.participants?.[0]?.name}
        </span>
      </div>

      {/* MESSAGES */}
      <div
        className="flex-1 pt-20 pb-24 px-2 overflow-y-auto scrollbar-none"
        style={{
          backgroundImage: "url('/image2.png')",
          backgroundSize: "cover",
        }}
      >
        {loading ? (
          <ChatLoading />
        ) : (
          messages.map((msg) =>
            msg.senderId === myId ? (
              <SenderMessage
                key={msg._id}
                msg={msg}
                text={msg.text}
                status={msg.status}
              />
            ) : (
              <ReceiverMessage key={msg._id} text={msg.text} />
            )
          )
        )}

        {isTyping && (
         <div className="fixed bottom-20 left-0 right-0 flex justify-start px-4 z-30">
            <p className="text-sm text-blue-500 px-3 py-1 rounded-full font-bold">
             typing...
            </p>
         </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 fixed bottom-0 w-full flex gap-3 bg-black">
        <input
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 outline-none"
        />
        <button
          onClick={handleSendMessage}
          className={`w-11 h-11 rounded-full ${
            text.trim() ? "bg-blue-600" : "bg-gray-600"
          } flex items-center justify-center`}
        >
          <FaRegPaperPlane className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;




import { useDispatch, useSelector } from "react-redux";
import { openToggle } from "../redux/toggleSlice";
import AddChatPanel from "../components/AddChatPanel";
import { FiPlus } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";

const ChatPage = () => {
  const chats = useSelector((s) => s.chat);
  const selectedChat = useSelector((s) => s.selectedChat);
  const isOpen = useSelector((s) => s.toggle.isOpen);
  const dispatch = useDispatch();

  return (
    <div
      className={`bg-white border-r w-full md:w-72 flex flex-col
        ${selectedChat ? "hidden md:flex" : "flex"}
      `}
      style={{
        backgroundImage: "url('/image8.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Header */}
      <div className="p-4 border-b sticky top-0 z-10 flex justify-between">
        <h2 className="text-lg font-semibold text-red-500">Chats</h2>

        <button
          onClick={() => dispatch(openToggle())}
          className="text-white text-3xl font-bold"
        >
          <FiPlus />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && <AddChatPanel />}
      </AnimatePresence>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-700"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              {chat?.participants?.[0]?.name?.charAt(0)}
            </div>

            <div className="flex-1">
              <p className="font-bold text-white">
                {chat?.participants?.[0]?.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
