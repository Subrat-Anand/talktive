import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { closeToggle } from "../redux/toggleSlice";
import { motion } from "framer-motion";
import axios from "axios";
import { ServerUrl } from "../App";
import { setSelectedChat } from "../redux/selectedChatSlice";
import { addChatIfNotExists } from "../redux/chatsSlice";
import { ClipLoader } from 'react-spinners'

const AddChatPanel = () => {
  const panelRef = useRef(null);
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false)
  const [loadingUserId, setLoadingUserId] = useState(null);

  /* outside click close */
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        dispatch(closeToggle());
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dispatch]);

  /* debounce search */
  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${ServerUrl}/api/user/search?q=${query}`,
          { withCredentials: true }
        );
        setUsers(res?.data?.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /* ✅ create OR open chat */
  const createChat = async (userId) => {
    setLoadingUserId(userId)
    setShowLoading(true)
    try {
      const res = await axios.post(
        `${ServerUrl}/api/chat/create`,
        { userId },
        { withCredentials: true }
      );

      const chat = res.data; // 🔥 existing OR new chat

      dispatch(addChatIfNotExists(chat)); // sidebar update
      dispatch(setSelectedChat(chat));    // open chat
      dispatch(closeToggle());             // close panel
    } catch (err) {
      setShowLoading(false)
      console.log(err);
    }
    finally{
      setShowLoading(false)
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 bg-black/50">
      <motion.div
        ref={panelRef}
        className="absolute top-0 right-0 h-full w-full max-w-sm bg-[#111]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700">
          <button onClick={() => dispatch(closeToggle())}>
            <IoMdClose className="text-white text-2xl" />
          </button>
          <h3 className="text-white font-semibold">Search people</h3>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            autoFocus
            placeholder="Search username or email..."
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className="px-4 space-y-2">
          {loading && <p className="text-gray-400">Searching...</p>}

          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => createChat(u._id)}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                {u.name.charAt(0)}
              </div>

              {/* Name + Loading wrapper */}
              <div className="flex justify-between items-center flex-1">
                <p className="text-white font-medium">{u.name}</p>
                <p className="text-white text-sm">
                  {loadingUserId === u._id && <ClipLoader size={12} color="white"/>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddChatPanel;
