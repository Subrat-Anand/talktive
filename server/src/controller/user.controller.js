// controllers/user.controller.js
const User = require("../models/user.model");

const getCurrentUser = async (req, res) => {
  try {
    // 🔐 isAuth middleware se aata hai
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Current user fetched successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const keyword = req.query.q;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      _id: { $ne: req.user._id }, // 🔥 logged-in user exclude
      $or: [
        {
          name: { $regex: keyword, $options: "i" }, // name search
        },
        {
          email: { $regex: keyword, $options: "i" }, // email search
        },
      ],
    }).select("_id name email");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Search user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { getCurrentUser, searchUser };
