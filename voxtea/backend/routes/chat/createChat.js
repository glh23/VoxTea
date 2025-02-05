const express = require("express");
const Chat = require("../../models/Chat");
const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

const router = express.Router();

router.post("/start", async (req, res) => {
  const { userId } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUserId = decoded.id;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [currentUserId, userId] },
    });

    if (!chat) {
      chat = new Chat({ participants: [currentUserId, userId] });
      await chat.save();

      // Update both users with the chat ID
      await User.findByIdAndUpdate(currentUserId, { $addToSet: { chats: chat._id } });
      await User.findByIdAndUpdate(userId, { $addToSet: { chats: chat._id } });
    }

    chat = await chat.populate("participants", "_id username profilePicture");
    return res.status(200).json({ _id: chat._id, participants: chat.participants});

  } 
  catch (error) {
    console.error("Error starting chat:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
