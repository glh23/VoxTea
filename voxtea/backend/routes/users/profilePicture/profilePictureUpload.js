const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Define the directory where profile pictures will be stored
const uploadDir = "uploads/profilePictures/";

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); 
  console.log(`Directory ${uploadDir} created!`);
} else {
  console.log(`Directory ${uploadDir} already exists.`);
}

// Function to generate a unique filename
function filename() {
  return Date.now() + "-" + Math.round(Math.random() * 1e9);
}

// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    const fileName = filename() + path.extname(file.originalname)
    //store file name so that it may be accessed if needed
    req.fileName = fileName; 
    cb(null, fileName);
    console.log("profilePictureUpload: fileName: ", fileName )
  }
});

// Create the multer upload instance
const upload = multer({ storage: storage });

module.exports = upload;
