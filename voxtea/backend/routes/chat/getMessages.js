const express = require("express");
const Chat = require("../../models/Chat");
const Message = require("../../models/Message");
const User = require("../../models/User"); 
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

const router = express.Router();

router.get("/:chatId", async (req, res) => {
  try {

    // Get the user_id from the token 
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUserId = decoded.id;

    const user = await User.findById(currentUserId).populate("username", "profilePicture")

    console.log("my user: ",user);

    // Fetch chat and user information
    const chat = await Chat.findById(req.params.chatId)
      .populate("participants", "username profilePicture") 
      .populate({
        path: "messages",
        populate: { path: "sender", select: "username profilePicture" }
      });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({
      messages: chat.messages,
      participants: chat.participants,
      user: user
    });
    console.log("chat get return:", chat.messages, chat.participants)
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
