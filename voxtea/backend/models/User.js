const mongoose = require("mongoose");
const bcrypt = require('@node-rs/bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },  // Profile image path!!! not the image itself!!! 
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  interestedHashtags: [{ type: String }],
  clout: { type: Number, default: 0 }
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Check if entered password matches the stored password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
