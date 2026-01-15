import React from "react";

const ReceiverMessage = ({ text }) => {
  return (
    <div className="flex justify-start mb-2 px-2">
      <div
        className="
          max-w-[75%]
          px-4 py-2
          text-white text-sm
          rounded-2xl rounded-bl-md
          bg-gray-700 bg-opacity-80
          break-words whitespace-pre-wrap leading-relaxed
          shadow-md
        "
      >
        {text}
      </div>
    </div>
  );
};

export default ReceiverMessage;
