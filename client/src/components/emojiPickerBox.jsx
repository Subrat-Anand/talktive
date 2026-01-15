import { useEffect, useRef } from "react";
import EmojiPickerReact from "emoji-picker-react";

const EmojiPicker = ({ onSelect, onClose, ignoreRef }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // ❌ picker ke bahar click
      // ❌ AND emoji button pe click nahi hona chahiye
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        !ignoreRef?.current?.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, ignoreRef]);

  return (
    <div
      ref={pickerRef}
      className="fixed bottom-16 left-0 right-0 z-40"
    >
      <EmojiPickerReact
        theme="dark"
        height="55vh"
        previewConfig={{ showPreview: false }}
        onEmojiClick={(emoji) => onSelect(emoji.emoji)}
      />
    </div>
  );
};

export default EmojiPicker;
