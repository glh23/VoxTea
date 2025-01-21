const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const profilePictureRoute = multer({ dest: 'uploads/profilePictures/' });

const tokenCheck = require('./authCheck2');


const CreateAccount = require("./routes/users/CreateAccount");
const Login = require("./routes/users/login");
const GetProfilePicture = require("./routes/users/profilePicture/getProfilePicture");
const updateProfilePicture = require("./routes/users/profilePicture/updateProfilePicture");
const posts = require('./routes/posts/posts');
const getPosts = require('./routes/posts/getPosts');
const getAccount = require('./routes/users/getAccount');
const searchAccounts = require("./routes/users/searchAccounts");
const getProfile = require("./routes/users/getOtherAccount");
const juceAPI = require("./juceSounds/juceAPI")


// Debugging route imports
console.log('CreateAccount:', CreateAccount);
console.log('Login:', Login);
console.log('GetProfilePicture:', GetProfilePicture);
console.log('updateProfilePicture:', updateProfilePicture);
console.log('posts:', posts);
console.log('getPosts:', getPosts);
console.log('getAccount:', getAccount);


require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Security route
app.use('/api', tokenCheck);

// Connecting to Mongo
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));


// Static file serving (profile image access)
//app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.use('/uploads/audioFiles', express.static(path.join(__dirname, 'uploads/audioFiles')));
//app.use("/uploads", uploads);

// Routes
app.use("/api/users", CreateAccount);
app.use("/api/users", Login);
app.use("/api/users/getProfilePicture", GetProfilePicture);
app.use("/api/users/updateProfilePicture", updateProfilePicture);
app.use("/api/posts/create", posts);
app.use("/api/posts/get", getPosts);
app.use("/api/users/account/get", getAccount);
app.use("/api/users/search", searchAccounts);
app.use("/api/users/profile/get", getProfile);
app.use("/api/effects/", juceAPI);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

