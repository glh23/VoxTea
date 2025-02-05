const express = require("express");
const jwt = require('jsonwebtoken'); 
const Chat = require("../../models/Chat");
const Message = require("../../models/Message");
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Received Data:", req.body);
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Token received", token);
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    let currentUserId;
    try {
      // Decode the token
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Token decoded", decoded);
      currentUserId = decoded.id; 
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: 'Invalid message request' });
    }

    const { chatId, message } = req.body;
    if (!message || !chatId) return res.status(400).json({ message: "Missing Information for message." });

    // Save message to DB
    const newMessage = await Message.create({
      sender: currentUserId,
      chat: chatId,
      text: message
    });

    await Chat.findByIdAndUpdate(chatId, { 
      $push: { messages: message._id }, 
      lastMessage: message._id 
    });

    res.status(201).json(newMessage);
 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;