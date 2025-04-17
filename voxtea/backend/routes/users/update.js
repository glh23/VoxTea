const express = require('express');
const bcrypt = require('@node-rs/bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const mongoose = require('mongoose');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Validate username
const validateUsername = (username) => {
  if (!username) { return { isValid: false, message: "Username is required." }; }
  if (username.length < 2 || username.length > 30) { return { isValid: false, message: "Username must be between 2 and 30 characters." }; }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) { return { isValid: false, message: "Username can only contain letters, numbers, and underscores." }; }
  return { isValid: true };
};

// Validate password
const validatePassword = (password) => {
  if (!password) { return { isValid: false, message: "Password is required." }; }
  if (/\s/.test(password)) { return { isValid: false, message: "Password can't have spaces." }; }
  if (password.length < 12) { return { isValid: false, message: "Password length must be at least 12 characters." }; }
  if (!/[!@#$£%^&*(),.?":{}|<>]/.test(password)) { return { isValid: false, message: "Password must have at least one special character." }; }
  if (!/\d/.test(password)) { return { isValid: false, message: "Password must have at least one number." }; }
  if (!/[A-Z]/.test(password)) { return { isValid: false, message: "Password must have at least one uppercase letter." }; }
  if (!/[a-z]/.test(password)) { return { isValid: false, message: "Password must have at least one lowercase letter." }; }
  return { isValid: true };
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Update Username
router.post('/username', authenticateToken, async (req, res) => {
  const { email, newUsername } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user._id.toString() !== req.userId) {
      return res.status(401).json({ message: "Unauthorized or incorrect email" });
    }

    const { isValid, message } = validateUsername(newUsername);
    if (!isValid) {
      return res.status(400).json({ message });
    }

    user.username = newUsername;
    await user.save();
    res.json({ message: "Username updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update username" });
  }
});

router.post('/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const isPasswordValid = await bcrypt.verify(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const { isValid, message } = validatePassword(newPassword);
    if (!isValid) {
      return res.status(400).json({ message });
    }

    user.password = newPassword; 
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update password" });
  }
});


module.exports = router;


