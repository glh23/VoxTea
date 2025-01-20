const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// Get user profile by ID
router.get("/profile/get/:id", async (req, res) => {
    console.log(req.params.id);
  try {
    const user = await User.findById(req.params.id).populate("posts"); // Fetch user and populate posts
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

