const Chat = require("../models/chat.model");
const User = require("../models/user.model");
require('../models/message.model')

const createChat = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    if (userId.toString() === myId.toString()) {
      return res.status(400).json({ message: "Cannot chat with yourself" });
    }

    const receiver = await User.findById(userId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    let chat = await Chat.findOne({
      participants: { $all: [myId, userId] },
    }).populate("participants", "name email");

    // ✅ existing chat
    if (chat) {
      const responseChat = {
        ...chat.toObject(),
        participants: chat.participants.filter(
          (u) => u._id.toString() !== myId.toString()
        ),
      };

      return res.status(200).json(responseChat);
    }

    // ✅ create new chat
    const newChat = await Chat.create({
      participants: [myId, userId],
    });

    const populatedChat = await Chat.findById(newChat._id).populate(
      "participants",
      "name email"
    );

    const responseChat = {
      ...populatedChat.toObject(),
      participants: populatedChat.participants.filter(
        (u) => u._id.toString() !== myId.toString()
      ),
    };

    return res.status(201).json(responseChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET MY CHATS
 */
const getMyChats = async (req, res) => {
  const myId = req.user?._id;

  if (!myId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const chats = await Chat.find({
    participants: myId,
  })
    .populate("participants", "name email")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  // ✅ logged-in user remove
  chats.forEach((chat) => {
    chat.participants = chat.participants.filter(
      (user) => user._id.toString() !== myId.toString()
    );
  });

  res.status(200).json({
    count: chats.length,
    chats,
  });
};

module.exports = {createChat, getMyChats}