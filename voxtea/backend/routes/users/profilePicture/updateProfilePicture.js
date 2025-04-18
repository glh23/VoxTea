const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs"); // Needed for file removal
const User = require("../../../models/User");
const upload = require("./profilePictureUpload");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const uploadDir = "uploads/profilePictures/";

// Route to handle profile picture upload
router.post("/", upload.single("profilePicture"), async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (req.file) {
      // If there's an existing profile picture, remove it
      if (user.profilePicture) {
        const oldImagePath = path.join(uploadDir, user.profilePicture);
        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldImagePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Error deleting old profile picture:", unlinkErr);
              } else {
                console.log("Old profile picture removed:", user.profilePicture);
              }
            });
          } else {
            console.log("Old profile picture not found:", oldImagePath);
          }
        });
      }

      user.profilePicture = req.file.filename;
    }

    await user.save();

    return res.json({
      message: "Profile picture updated successfully.",
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error("Error updating profile picture:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
