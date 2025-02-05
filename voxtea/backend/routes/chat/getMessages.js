const express = require("express");
const Message = require("../../models/Message");

const router = express.Router();

router.get("/:chatId", async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "username profilePicture");
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  module.exports = router;
