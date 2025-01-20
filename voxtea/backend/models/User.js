const mongoose = require("mongoose");
const bcrypt = require('@node-rs/bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },  // Field to store profile image path or URL
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }] 
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  // Check if password is modified
  try {
    //const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, 10);
    // Save the document
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

