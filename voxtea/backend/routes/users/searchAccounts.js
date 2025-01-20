const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// Search users by username
router.get("/", async (req, res) => {
  try {
    const { query } = req.query; 

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    const users = await User.find({ 
      username: { $regex: query, $options: "i" } 
    }).select("username profilePicture"); 

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for users:", error);
    return res.status(500).json({ message: "Failed to fetch users." });
  }
});

module.exports = router;
