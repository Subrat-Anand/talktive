import { useState } from "react";

const UnsendMessage = ({show, closed}) => {

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Box */}
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
          >
            Unsend
          </button>

          <button
            className="py-2 text-sm text-gray-300 hover:bg-white/5"
            onClick={closed}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsendMessage;
