const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Post = require('../../models/Post');
const User = require('../../models/User');
const { spawn } = require("child_process");
const { exec } = require("child_process");


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

// Function to apply effects using SoX
async function applyEffects(inputFile, outputFile, effect) {
  return new Promise((resolve, reject) => {
    let fullEffect = ''

    if(effect == 'Reverb'){fullEffect = 'gain -2 reverb 40 50 40'}
    if(effect == 'Flanger'){fullEffect = 'gain -2 flanger 0 2 -25 70 0.5 triangle 25 lin'}
    if(effect == 'Telephone'){fullEffect = 'gain -2 highpass 500 lowpass 3000 compand 0.3,1 6:-70,-60,-20 -5 -90 0.2 reverb 20'}
    // Construct the SoX command.
    // sox "in.wav" "out.wav" gain -2 reverb 40 50 40

    const command = `sox "${inputFile}" "${outputFile}" ${fullEffect}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("SoX error:", stderr);
        return reject(error);
      }
      resolve(outputFile);
    });
  });
}
// Route to create a new post
router.post('/', upload.single('audioFile'), async (req, res) => {
  try {
    // Validate token
    const token = req.headers.authorization?.split(' ')[1];
    console.log("token: ", token)
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUserId = decoded.id;

    const { description, effect } = req.body;
    const audioFile = req.file;
    if (!audioFile) {
      return res.status(400).json({ message: 'Audio file is required.' });
    }

    // Set up file paths
    const now = new Date();
    const yearMonthDir = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    // The file uploaded by multer
    const inputFilePath = path.join(__dirname, '..', '..', 'uploads', 'audioFiles', yearMonthDir, audioFile.filename);
    // Change extension to .wav (you can also append a suffix to distinguish processed files)
    const outputFileName = `${yearMonthDir}_${audioFile.filename.replace(/\.[^/.]+$/, '.wav')}`;
    const outputFilePath = path.join(__dirname, '..', '..', 'uploads', 'audioFiles', outputFileName);

    // Extract hashtags from the description (optional)
    const hashtags = description.match(/#\w+/g) || [];

    // If an effect is provided, apply it using SoX.
    // Otherwise, just copy the file.
    if (effect) {
      await applyEffects(inputFilePath, outputFilePath, effect);
    } else {
      // Copy file if no effect is applied
      fs.copyFileSync(inputFilePath, outputFilePath);
    }

    // Create new post using the processed file path
    const newPost = new Post({
      description,
      audioFile: `/uploads/audioFiles/${outputFileName}`,
      userId: currentUserId,
      hashtags: hashtags.map(tag => tag.substring(1)) // Remove the '#' from each tag
    });

    await newPost.save();

    // Update the user to include this new post
    await User.findByIdAndUpdate(currentUserId, { $push: { posts: newPost._id } });

    console.log("Post created successfully!");
    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: 'Failed to create post.' });
  }
});

module.exports = router;