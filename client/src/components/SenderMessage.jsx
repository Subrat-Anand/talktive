import React, { useState, useRef, useEffect } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { clearUnsendMessage, setOnMessageId } from "../redux/oneMessageIdSlice";
import {unsendMessage } from "../socketsActions/unsendMessage";
import { TbXboxX } from "react-icons/tb";

/**
 * Shared ref across all SenderMessage instances
 */
let activeCloserRef = { current: null };

const SenderMessage = ({ text, status, msg }) => {
  const [showDots, setShowDots] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const timerRef = useRef(null);
  const dispatch = useDispatch();
  const msgId = useSelector((s)=> s.onSingleMessageId)
  const selectedChat = useSelector((s)=> s.selectedChat)

  const closeSelf = () => {
    setShowDots(false);
    setShowBox(false);
    clearTimeout(timerRef.current);
  };

  const handleMsg = () => {
    // 🔁 Same message clicked → toggle off
    if (activeCloserRef.current === closeSelf) {
      activeCloserRef.current = null;
      closeSelf();
      return;
    }

    // 🔴 Close previous active message
    if (activeCloserRef.current) {
      activeCloserRef.current();
    }

    // 🟢 Open this message
    setShowDots(true);
    setShowBox(false);
    activeCloserRef.current = closeSelf;

    // ⏱ Auto hide
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      closeSelf();
      activeCloserRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      if (activeCloserRef.current === closeSelf) {
        activeCloserRef.current = null;
      }
    };
  }, []);

  const handleCloseBox = () => {
    setShowBox(false)
    setShowDots(false)
    dispatch(clearUnsendMessage())
  }

  const handleSaveMsgId = (id) => {
    dispatch(setOnMessageId(id))
  }

  const deleteMsg = async () => {
  setShowBox(false);
  setShowDots(false);

  try {
    await axios.delete(
      `${ServerUrl}/api/message/unsend/${msgId}`,
      { withCredentials: true }
    );

          // 🔥 socket emit
   unsendMessage({
    chatId: selectedChat?._id,
    messageId: msg?._id,
  });

  } catch (err) {
    setShowBox(false);
    setShowDots(false);
    console.log(err);
  }
};




  return (
    <div className="flex justify-end mb-2 px-2 items-center gap-2 relative">
      <div
        className="max-w-[75%] px-4 py-2 text-white text-sm
        rounded-2xl rounded-br-md
        bg-gradient-to-br from-pink-500 to-purple-600
        break-words whitespace-pre-wrap leading-relaxed
        flex items-end gap-2 shadow-md"
        onClick={handleMsg}
      >
        <span>{text}</span>
      </div>

        {status === "pending" && (
          <FaRegPaperPlane size={14} className="opacity-70 animate-pulse text-white" />
        )}
        {
          status === "failed" && (
            <TbXboxX size={14} className="text-red-500 text-xs"/>
          )
        }

      {status !== "pending" && showDots && (
        <BsThreeDots
          className="text-white cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // message click trigger na ho
            clearTimeout(timerRef.current);
            setShowBox(true);
            handleSaveMsgId(msg?._id)
          }}
        />
      )}

      {/* Action Box */}
      {showBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseBox}
          />

          {/* Center Box */}
         <div className="relative w-[85%] max-w-xs rounded-xl bg-[#1f1f1f] px-5 py-4 text-center shadow-xl">
          <h3 className="text-sm font-semibold text-gray-200">
            Unsend message?
          </h3>

          <p className="mt-2 text-xs text-gray-400 leading-relaxed">
            Unsending will remove the message for everyone. People may have
            already seen or forwarded it.
          </p>

          <div className="mt-4 flex flex-col divide-y divide-gray-700">
            <button
              className="py-2 text-sm font-semibold text-red-500 hover:bg-white/5"
              onClick={deleteMsg}
            >
              Unsend
            </button>

            <button
              className="py-2 text-sm text-gray-300 hover:bg-white/5"
              onClick={() => {
                handleCloseBox();
                dispatch(clearUnsendMessage())
              }}
            >
              Cancel
            </button>
          </div>
         </div>

        </div>
      )}

    </div>
  );
};

export default SenderMessage;
