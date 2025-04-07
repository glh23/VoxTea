const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const upload = require("./profilePicture/profilePictureUpload");  // Import the file upload component
const validator = require('validator');

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET; 

// Route for user registration
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { username, email, password } = req.body;
  const profilePicture = req.file;  
  const fileName = req.fileName;

  // Debugging
  console.log({ username, email, password, profilePicture, fileName });

  try {
    // Validate password
    if (!password) { return res.status(400).json({ message: "Password is required." }); }
    if (/\s/.test(password)) { return res.status(400).json({ message: "Password can't have spaces." }); }
    if (password.length < 12) { return res.status(400).json({ message: "Password length must be at least 12 characters." }); }
    if (!/[!@#$£%^&*(),.?":{}|<>]/.test(password)) { return res.status(400).json({ message: "Password must have at least one special character." }); }
    if (!/\d/.test(password)) { return res.status(400).json({ message: "Password must have at least one number." }); }
    if (!/[A-Z]/.test(password)) { return res.status(400).json({ message: "Password must have at least one uppercase letter." }); }
    if (!/[a-z]/.test(password)) { return res.status(400).json({ message: "Password must have at least one lowercase letter." }); }
  
    // Validate username
    if (!username) { return res.status(400).json({ message: "Username is required." }); }
    if (username.length < 2 || username.length > 30) { return res.status(400).json({ message: "Username must be between 2 and 30 characters." }); }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores." }); }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already registered." });
    }

    // Validate email format
    if (!email) { return res.status(400).json({ message: "Email is required." }); }
    if (!/\S+@\S+\.\S+/.test(email)) { return res.status(400).json({ message: "Invalid email format." }); }
    if (!validator.isEmail(email)) { return res.status(400).json({ message: "Invalid email address." }); }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }



    // Create new user 
    const newUser = new User({
      username,
      email,
      password,
      profilePicture: fileName  
    });

    console.log(newUser);

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

    // Respond with the token
    res.json({ token });
    console.log("User registered successfully!");
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;

