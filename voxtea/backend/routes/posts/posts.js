// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const jwt = require('jsonwebtoken');
// const Post = require('../../models/Post');
// const User = require('../../models/User');
// const { spawn } = require("child_process");
// const { exec } = require("child_process");


// const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET;

// // Configure the directory for audio uploads
// const audioUploadDir = path.join(__dirname, '../../uploads/audioFiles');
// if (!fs.existsSync(audioUploadDir)) {
//   fs.mkdirSync(audioUploadDir, { recursive: true });
// }

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       const now = new Date();
//       const monthDir = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
//       const uploadDir = path.join(audioUploadDir, monthDir);

//       // Create the directory if it doesn't exist
//       if (!fs.existsSync(uploadDir)) {
//           fs.mkdirSync(uploadDir, { recursive: true });
//       }
//       cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//       const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
//       cb(null, uniqueName);
//   },
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['audio/mpeg', 'audio/mp3'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only MP3 files are allowed!'), false);
//     }
//   },
//   // Limit file size to 10MB
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// // Function to apply effects using SoX
// async function applyEffects(inputFile, outputFile, effect) {
//   return new Promise((resolve, reject) => {
//     let fullEffect = '';

//     // Define the effect
//     if (effect === 'Reverb') {fullEffect = 'gain -2 reverb 40 50 40';}
//     if (effect === 'Flanger') {fullEffect = 'gain -2 flanger 0 2 -25 70 0.5 triangle 25 lin';}
//     if (effect === 'Telephone') {fullEffect = 'gain -2 highpass 500 lowpass 3000 compand 0.3,1 6:-70,-60,-20 -5 -90 0.2 reverb 20';}
//     if (effect === 'Distortion') {fullEffect = 'gain -2 distortion 10';}
//     if (effect === 'Chorus') {fullEffect = 'gain -2 chorus 0.7 1.2 65 0.6 0.3 2.5 -t';}
//     if (effect === 'Pitch') {fullEffect = 'gain -2 pitch 4000';}
//     if (effect === 'Bass') {fullEffect = 'gain -2 bass +15';}
//     if (effect === 'Treble') {fullEffect = 'gain -2 treble +15';}
//     if (effect === 'Echo') {fullEffect = 'gain -2 echo 0.9 0.95 80 0.6';}
//     else {fullEffect = 'gain -2';}

//     // Ensure the input file is converted to WAV first
//     const wavFile = inputFile.replace(/\.[^/.]+$/, '.wav');  // Convert to .wav
//     const convertToWavCmd = `sox "${inputFile}" "${wavFile}"`;
    
//     exec(convertToWavCmd, (err, stdout, stderr) => {
//       if (err) {
//         console.error('Error converting to WAV:', stderr);
//         return reject(err);
//       }
      
//       // Now apply effects to the converted WAV file
//       const command = `sox "${wavFile}" "${outputFile}" ${fullEffect}`;
//       exec(command, (error, stdout, stderr) => {
//         if (error) {
//           console.error('SoX error:', stderr);
//           return reject(error);
//         }
//         resolve(outputFile);
//       });
//     });
//   });
// }





// // Route to create a new post
// router.post('/', upload.single('audioFile'), async (req, res) => {
//   try {
//     // Validate token
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided.' });
//     }
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const currentUserId = decoded.id;

//     console.log(req.body);
//     const { description, effect } = req.body;
//     const audioFile = req.file;
//     if (!audioFile) {
//       return res.status(400).json({ message: 'Audio file is required.' });
//     }

//     // Set up file paths
//     const now = new Date();
//     const yearMonthDir = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
//     // The file uploaded by multer
//     const inputFilePath = path.join(__dirname, '..', '..', 'uploads', 'audioFiles', yearMonthDir, audioFile.filename);
//     const outputFileName = `${yearMonthDir}_${audioFile.filename.replace(/\.[^/.]+$/, '.wav')}`;
//     const outputFilePath = path.join(__dirname, '..', '..', 'uploads', 'audioFiles', outputFileName);

//     // Extract hashtags from the description
//     const hashtags = description.match(/#\w+/g) || [];

//     try{
//       // If an effect is provided apply it using SoX.
//       if (effect) {
//         await applyEffects(inputFilePath, outputFilePath, effect);
//       } else {
//         // Copy file if no effect is applied
//         fs.copyFileSync(inputFilePath, outputFilePath);
//       }
//     }
//     catch (error) {
//       console.error("Error applying effects:", error);
//       return res.status(500).json({ message: 'Failed to apply audio effects.' });
//     }
//     // Create new post using the processed file path
//     const newPost = new Post({
//       description,
//       audioFile: `/uploads/audioFiles/${outputFileName}`,
//       userId: currentUserId,
//       hashtags: hashtags.map(tag => tag.substring(1)) // Remove the '#' from each tag
//     });

//     await newPost.save();

//     // Update the user to include this new post
//     await User.findByIdAndUpdate(currentUserId, { $push: { posts: newPost._id } });

//     console.log("Post created successfully!");
//     res.status(201).json({ message: 'Post created successfully!', post: newPost });
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.status(500).json({ message: 'Failed to create post.' });
//   }
// });

// module.exports = router;





const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Post = require('../../models/Post');
const User = require('../../models/User');
const { exec } = require('child_process');
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
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only MP3, OGG, and WebM files are allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});



async function applyEffects(inputFile, outputFile, effect) {
  return new Promise((resolve, reject) => {
    let fullEffect = '';
    const trimmedEffect = effect.trim(); // Trim any extra spaces

    console.log("Effect:", trimmedEffect);

    // Define the effect using a switch statement
    switch (trimmedEffect) {
      case 'Reverb':
        fullEffect = 'gain -2 reverb 60 70 100';
        break;
      case 'Flanger':
        fullEffect = 'gain -2 flanger 0 5 -50 90 1.0 triangle 50 lin';
        break;
      case 'Telephone':
        fullEffect = 'gain -2 highpass 800 lowpass 3500 compand 0.5,1 6:-60,-50,-15 -4 -80 0.3 reverb 30';
        break;
      case 'Distortion':
        fullEffect = 'gain -3 overdrive 20';
        break;
      case 'Chorus':
        // the 0.7 deals with the initial gain well enough
        fullEffect = 'chorus 0.7 0.9 40 0.4 0.25 2.0 -t';
        break;
      case 'Pitch':
        // 12 semi tones (one octave)
        fullEffect = 'gain -2 pitch 1200';
        break;
      case 'Bass':
        // 30db and a gentle high pass as it sounds silly
        fullEffect = 'gain -2 bass +30 highpass 100';
        break;
      case 'Treble':
        fullEffect = 'gain -2 treble +30';
        break;
      case 'Echo':
        // 0.8s delay, 0.85 decay, 90ms delay between echoes, 0.8 decay
        fullEffect = 'gain -n bass 5 treble 4 compand 0.3,1 6:-70,-60,-20 -5 -90 0.2 reverb 10';
        break;
      default:
        fullEffect = 'gain -2';  // No effect or default
        break;
    }

    console.log('Applied effect:', fullEffect);

    // Convert WebM to WAV using ffmpeg first
    const wavFile = inputFile.replace(/\.[^/.]+$/, '.wav');  // Convert to .wav
    const convertToWavCmd = `ffmpeg -i "${inputFile}" -acodec pcm_s16le -ar 44100 "${wavFile}"`;

    exec(convertToWavCmd, (err, stdout, stderr) => {
      if (err) {
        console.error('Error converting to WAV:', stderr);
        return reject(err);
      }

      // Now apply effects to the converted WAV file
      const command = `sox "${wavFile}" "${outputFile}" ${fullEffect}`;
      console.log('command:', command);
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('SoX error:', stderr);
          return reject(error);
        }
        resolve(outputFile);
      });
    });
  });
}


router.post('/', upload.single('audioFile'), async (req, res) => {
  try {
    // Validate token
    const token = req.headers.authorization?.split(' ')[1];
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
    const inputFilePath = path.join(__dirname, '..', '..', 'uploads', 'audioFiles', yearMonthDir, audioFile.filename);

    // Output file paths
    const outputWavFileName = `${yearMonthDir}_${audioFile.filename.replace(/\.[^/.]+$/, '.wav')}`;
    const outputWavFilePath = path.join(__dirname, '..', '..', 'uploads', 'audioFiles', outputWavFileName);

    const outputMp3FileName = `${yearMonthDir}_${audioFile.filename.replace(/\.[^/.]+$/, '.mp3')}`;
    const outputMp3FilePath = path.join(__dirname, '..', '..', 'uploads', 'audioFiles', outputMp3FileName);

    // Extract hashtags from the description
    const hashtags = description.match(/#\w+/g) || [];

    // Apply effects and convert to WAV
    try {
      await applyEffects(inputFilePath, outputWavFilePath, effect);  // Apply effects to the audio and output as WAV

      // Convert WAV to MP3 after applying effects
      const convertToMp3Cmd = `ffmpeg -i "${outputWavFilePath}" -acodec libmp3lame -ab 128k "${outputMp3FilePath}"`;
      exec(convertToMp3Cmd, (err, stdout, stderr) => {
        if (err) {
          console.error('Error converting to MP3:', stderr);
          return res.status(500).json({ message: 'Failed to convert audio to MP3.' });
        }

        // Create new post with the MP3 file path
        const newPost = new Post({
          description,
          audioFile: `/uploads/audioFiles/${outputMp3FileName}`,
          userId: currentUserId,
          hashtags: hashtags.map(tag => tag.substring(1)) // Remove the '#' from each tag
        });

        // Save the post and update the user
        newPost.save()
          .then(() => {
            User.findByIdAndUpdate(currentUserId, { $push: { posts: newPost._id } })
              .then(() => {
                console.log("Post created successfully!");
                res.status(201).json({ message: 'Post created successfully!', post: newPost });
              })
              .catch((error) => {
                console.error('Error updating user:', error);
                res.status(500).json({ message: 'Failed to update user.' });
              });
          })
          .catch((error) => {
            console.error('Error saving post:', error);
            res.status(500).json({ message: 'Failed to save post.' });
          });
      });
    } catch (error) {
      console.error('Error applying effects:', error);
      return res.status(500).json({ message: 'Failed to apply audio effects.' });
    }
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: 'Failed to create post.' });
  }
});

module.exports = router;
