import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import Home from "./page/Home";
import ChatPage from "./page/ChatPage";
import Login from "./page/Login";
import Signup from "./page/SignUp";

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetMyChat from "./hooks/useGetMyChat";

import { initSocket } from "./socket/Socket";

export const ServerUrl = "http://localhost:5000";

const App = () => {
  // 🔹 fetch user & chats
  useGetCurrentUser();
  useGetMyChat();

  const user = useSelector((state) => state.user);

  // 🔥 SOCKET INIT (ONLY ON LOGIN)
  useEffect(() => {
    if (!user?._id) return;

    // ✅ ek hi baar socket banta hai
    initSocket(user._id);

    // ❌ YAHAN KABHI disconnect MAT KARNA
    // socket app lifetime tak alive rahega

  }, [user?._id]);

  return (
    <Routes>
      {/* 🔒 PROTECTED HOME */}
      <Route
        path="/"
        element={user ? <Home /> : <Navigate to="/login" replace />}
      />

      {/* 🔐 AUTH */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <Signup />}
      />

      {/* 💬 CHAT PAGE */}
      <Route
        path="/chats"
        element={user ? <ChatPage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default App;
