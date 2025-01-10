const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const User = require("../../../models/User");

const router = express.Router();
const JWT_SECRET = "qwertyuiopasdfghjklzxcvbnm"; // Secret key for JWT

// Route to get the profile picture
router.get("/", async (req, res) => {
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

    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: "Profile picture not found." });
    }

    // Make the path
    const profilePicturePath = path.join(__dirname, "../../../uploads/profilePictures", user.profilePicture);

    // Check if the file exists
    if (!fs.existsSync(profilePicturePath)) {
      return res.status(404).json({ message: "Profile picture not found on server." });
    }

    // return the path
    console.log("user.profilePicture", user.profilePicture, "   |<0i0>|    profilePicturePath: ", profilePicturePath);
    return res.json({ profilePicture: user.profilePicture, profilePicturePath: profilePicturePath || "no" });
  } 
  catch (err) {
    console.error("Error fetching profile picture:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
