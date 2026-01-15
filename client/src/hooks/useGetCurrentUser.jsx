import { useEffect } from "react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(
          `${ServerUrl}/api/user/me`,
          { withCredentials: true }
        );

        dispatch(setUserData(res?.data?.user));
      } catch (error) {
        console.log("Current user fetch error:", error);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);
};

export default useGetCurrentUser;
