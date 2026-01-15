import { useEffect } from "react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyChats } from "../redux/chatsSlice";

const useGetMyChat = () => {
    const user = useSelector((store)=> store.user)
    const dispatch = useDispatch()
  useEffect(() => {
    const fetchMyChat = async () => {
      try {
        const res = await axios.get(
          `${ServerUrl}/api/chat/my`,
          { withCredentials: true }
        );
        dispatch(setMyChats(res?.data.chats))
      } catch (error) {
        console.log("Current user fetch error:", error);
      }
    };

    fetchMyChat();
  }, [user]);
};

export default useGetMyChat;
