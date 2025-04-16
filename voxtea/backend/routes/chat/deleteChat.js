// File: routes/chat/deleteChat.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Chat = require('../../models/Chat');
const Message = require('../../models/Message');
const User = require('../../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

router.delete('/:chatId', async (req, res) => {
  try {
    // Validate token and get current user ID
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUserId = decoded.id;
    
    const { chatId } = req.params;
    
    // Retrieve the chat from the database
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }
    
    // Make sure the user is in the chat
    if (!chat.participants.map(id => id.toString()).includes(currentUserId)) {
      return res.status(403).json({ message: 'You are not authorized to delete this chat.' });
    }
    
    // Delete all messages in this chat
    await Message.deleteMany({ chat: chatId });
    
    // Remove the chat document from the Chat collection
    await Chat.findByIdAndDelete(chatId);
    
    // Update each participant's chats so this one isn't in it
    await User.updateMany(
      { _id: { $in: chat.participants } },
      { $pull: { chats: chatId } }
    );
    
    res.status(200).json({ message: 'Chat and associated messages deleted successfully.' });
    
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: 'Failed to delete chat.' });
  }
});

module.exports = router;
