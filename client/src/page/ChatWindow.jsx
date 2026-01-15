import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaRegPaperPlane } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

import { ServerUrl } from "../App";
import {
  addMessage,
  removeMessage,
  replaceMessage,
  setClearMessage,
  setMessage,
} from "../redux/messageSlice";
import { clearSelectedChat } from "../redux/selectedChatSlice";

import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import ChatLoading from "../components/ChatLoading";

import { sendMessageSocket } from "../socketsActions/sendMessage";
import { onReceiveMessage, offReceiveMessage } from "../socketsActions/receiveMessage";
import {
  emitTyping,
  emitStopTyping,
  onTyping,
  onStopTyping,
} from "../socketsActions/typing";
import { offMessageUnsent, onMessageUnsent } from "../socketsActions/unsendMessage";
import EmojiPickerBox from "../components/emojiPickerBox";
import EmojiPicker from "../components/emojiPickerBox";

const ChatWindow = () => {
  const dispatch = useDispatch();

  const selectedChat = useSelector((s) => s.selectedChat);
  const MESSAGES = useSelector((s) => s.message);
  const user = useSelector((s) => s.user);
  const myId = user?._id;

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef(null);
  const emojiBtnRef = useRef(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${ServerUrl}/api/message/${selectedChat._id}`,
          { withCredentials: true }
        );
        dispatch(setMessage(res.data));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat?._id, dispatch]);

  /* ================= Unsend Listener ================= */
  /* ================= REAL-TIME UNSEND LISTENER ================= */

  useEffect(() => {
    if (!selectedChat?._id) return;

    const handleUnsend = ({ chatId, messageId }) => {

      // ✅ sirf active chat ke messages delete
      if (chatId === selectedChat._id) {
        dispatch(removeMessage(messageId));
      }

      // ✅ sidebar latest message update
      // dispatch(
      //   updateLatestMessage({
      //     chatId,
      //     message: {
      //       _id: messageId,
      //       text: "Message deleted",
      //       deleted: true,
      //     },
      //   })
      // );
    };

    onMessageUnsent(handleUnsend);

    return () => {
      offMessageUnsent(handleUnsend);
    };
  }, [selectedChat?._id, dispatch]);

  /* ================= RECEIVE ================= */
  useEffect(() => {
    if (!selectedChat?._id) return;

    const handleReceive = (msg) => {
      const senderId =
        typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

      if (senderId === myId) return;
      if (msg.chatId !== selectedChat._id) return;

      dispatch(addMessage(msg));
    };

    onReceiveMessage(handleReceive);
    return () => offReceiveMessage(handleReceive);
  }, [selectedChat?._id, myId, dispatch]);

  /* ================= SEND ================= */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const messageText = text;
    setText("");

    const tempId = Date.now().toString();

    // 🔥 optimistic UI
    dispatch(
      addMessage({
        tempId,
        chatId: selectedChat._id,
        senderId: myId,
        text: messageText,
        status: "pending",
      })
    );

    try {
      const res = await axios.post(
        `${ServerUrl}/api/message/send`,
        {
          chatId: selectedChat._id,
          text: messageText,
        },
        { withCredentials: true }
      );

      const realMessage = res.data.data;

      dispatch(
        replaceMessage({
          tempId,
          realMessage,
        })
      );

      // 🔥 real-time broadcast
      sendMessageSocket({
        chatId: selectedChat._id,
        ...realMessage,
      });
    } catch (err) {
      console.log(err);

      dispatch(
        replaceMessage({
          tempId,
          realMessage: {
            tempId,
            chatId: selectedChat._id,
            senderId: myId,
            text: messageText,
            status: "failed",
          },
        })
      );
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
  }, [MESSAGES]);

  /* ================= CLOSE ================= */
  const handleCloseChat = () => {
    dispatch(setClearMessage());
    dispatch(clearSelectedChat());
    setText("");
  };

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
  };


  /* ================= UI ================= */
  return (
    <div className="flex-1 flex flex-col h-screen"
    style={{
          backgroundImage: "url('/image2.png')",
          backgroundSize: "cover",
        }}
    >
      {/* HEADER */}
      <div className="p-4 bg-black fixed w-full z-20 flex items-center gap-3">
        <button className="md:hidden" onClick={handleCloseChat}>
          <IoMdArrowRoundBack size={22} color="red" />
        </button>
        <span className="text-white font-semibold"> {selectedChat?.participants?.[0]?.name} </span>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 pt-20 pb-24 px-2 overflow-y-auto scrollbar-none">
        {loading ? (
          <ChatLoading />
        ) : (
          MESSAGES.map((msg) =>
            msg.senderId === myId ? (
              <SenderMessage
                key={msg._id || msg.tempId}
                msg={msg}
                text={msg.text}
                status={msg.status}
              />
            ) : (
              <ReceiverMessage
                key={msg._id || msg.tempId}
                text={msg.text}
              />
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

      {showEmoji && (
        <EmojiPicker
          onSelect={handleEmojiSelect}
          onClose={() => setShowEmoji(false)}
          ignoreRef={emojiBtnRef}
        />
      )}

      <button
        ref={emojiBtnRef}
        onClick={() => setShowEmoji((p) => !p)}
        className="text-2xl"
      >
        😀
      </button>

        <input
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 outline-none"
        />
       <button
          onClick={sendMessage}
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
