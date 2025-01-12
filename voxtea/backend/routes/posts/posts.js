const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Post = require('../../models/Post');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; 

// Configure the directory for audio uploads
const audioUploadDir = path.join(__dirname, '../../uploads/audioFiles');
if (!fs.existsSync(audioUploadDir)) {
  fs.mkdirSync(audioUploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const now = new Date();
      const monthDir = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const uploadDir = path.join(audioUploadDir, monthDir);
      
      // Create the directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
      cb(null, uniqueName);
  },
});


const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/mp3'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only MP3 files are allowed!'), false);
    }
  },
  // Limit file size to 10MB
  limits: { fileSize: 10 * 1024 * 1024 }, 
});




// Endpoint for the new posts
router.post('/', upload.single('audioFile'), async (req, res) => {
  const token = req.headers.authorization;
  const { description } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET || 'defaultsecret'); 
    const userId = decoded.id;

    if (!req.file) {
      return res.status(400).json({ message: 'Audio file is required.' });
    }

    const now = new Date();
    const yearMonthDir = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Create new post
    const newPost = new Post({
      description,
      audioFile: `/uploads/audioFiles/${yearMonthDir}/${req.file.filename}`,
      userId,
    });

    console.log(newPost);

    // Save to the database
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create post.' });
  }
});

module.exports = router;

