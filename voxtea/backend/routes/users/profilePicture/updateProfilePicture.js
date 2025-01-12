const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("../../../models/User");
const upload = require("./profilePictureUpload");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; 

// Route to handle profile picture upload
router.post("/", upload.single("profilePicture"), async (req, res) => {
  const token = req.headers.authorization; 
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Authorization token required." });
  }

  try {
    // Decode the token to get the user ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If an image is uploaded, update the profilePicture field
    if (req.file) {
      user.profilePicture = req.file.filename; 
    }

    // Save the updated user to the database
    await user.save();

    // Send the response back with the new profile picture filename
    return res.json({ message: "Profile picture updated successfully.", profilePicture: user.profilePicture });
  } catch (err) {
    console.error("Error updating profile picture:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
