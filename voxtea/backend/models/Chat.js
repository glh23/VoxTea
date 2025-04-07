const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], 
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  isGroupChat: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Chat", ChatSchema);
