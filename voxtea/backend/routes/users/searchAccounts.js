const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// searches by name and then returns in the order of most clout
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    const users = await User.find({
      username: { $regex: query, $options: "i" }
    }).select("username profilePicture clout").sort({ clout: -1 }).limit(20); 

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for users:", error);
    return res.status(500).json({ message: "Failed to fetch users." });
  }
});

module.exports = router;
