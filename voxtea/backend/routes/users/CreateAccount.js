const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../../models/User");
const fs = require("fs"); 
const jwt = require('jsonwebtoken');

const router = express.Router();

// Secret key for JWT in production change to .env secret 
const JWT_SECRET = 'qwertyuiopasdfghjklzxcvbnm'; 

// Make sure uploads directory exists
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

// Multer Setup 
const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profileImage-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

//File filter to allow only image uploads 
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Only jpeg and png files are allowed!'), false); 
  }
};

// This gets sent to backend storage to look in it type in docker-backend (bash, dir, cd uploads, dir)
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter, 
  limits: { fileSize: 20 * 1024 * 1024 } // Limit file size to 20MB
});



// User Registration Route
router.post("/register", upload.single("profileImage"), async (req, res) => {
  const { username, email, password} = req.body;
  const profileImage = req.file;

  console.log({ username, email, password, profileImage});

  try {

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Create new user (password hashing is handled in the model)
    const newUser = new User({
      username,
      email,
      password,  
      profileImage: req.file ? req.file.path : null, 
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });
  
    // Respond with token
    res.json({ token });
    console.log("User registered successfully!");

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;

