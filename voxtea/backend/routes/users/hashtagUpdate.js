const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint to get user hashtags
router.get('/get', async (req, res) => {
  // Get the token from the header
  const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

  try {
    // Get the id from the token
    const decoded = jwt.verify(token, JWT_SECRET );
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ hashtags: user.interestedHashtags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch hashtags.' });
  }
});

// Endpoint to update user hashtags
router.post('/update', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { hashtags } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
  if (!hashtags || hashtags.length === 0) {
    return res.status(400).json({ message: 'Hashtags are required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET );
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.interestedHashtags = hashtags;
    await user.save();

    res.status(200).json({ message: 'Hashtags updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update hashtags.' });
  }
});

router.post("/delete", async (req, res) => {
  //const token = req.headers.authorization;
  const token = req.headers.authorization?.split(" ")[1];
  

  if (!token) {
    return res.status(401).json({ message: "Authorization token required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const { hashtag } = req.body;
    if (!hashtag) return res.status(400).json({ message: "Hashtag is required." });

    // Check if interestedHashtags is an array before using .filter
    if (!Array.isArray(user.interestedHashtags)) {
      user.interestedHashtags = [];
    }

    // Get the hashtags the user is interested in by filtering out the one to be deleted
    user.interestedHashtags = user.interestedHashtags.filter((tag) => tag !== hashtag);
    await user.save();

    return res.json({ message: "Hashtag removed." });
  } catch (err) {
    console.error("Error deleting hashtag:", err);
    res.status(500).json({ message: "Server error while deleting hashtag." });
  }
});

module.exports = router;
