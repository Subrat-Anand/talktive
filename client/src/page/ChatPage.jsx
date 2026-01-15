import { useDispatch, useSelector } from "react-redux";
import { openToggle } from "../redux/toggleSlice";
import AddChatPanel from "../components/AddChatPanel";
import { FiPlus } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import { setSelectedChat } from "../redux/selectedChatSlice";

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
            onClick={() => dispatch(setSelectedChat(chat))}
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
