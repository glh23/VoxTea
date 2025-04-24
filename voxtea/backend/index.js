const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Importing Routes
const tokenCheck = require('./authCheck2');

const CreateAccount = require("./routes/users/CreateAccount");
const Login = require("./routes/users/login");
const GetProfilePicture = require("./routes/users/profilePicture/getProfilePicture");
const updateProfilePicture = require("./routes/users/profilePicture/updateProfilePicture");
const getAccount = require('./routes/users/getAccount');
const searchAccounts = require("./routes/users/searchAccounts");
const getProfile = require("./routes/users/getOtherAccount");
const follow = require("./routes/users/follow");
const me = require("./routes/users/me");
const updateHashtag = require("./routes/users/hashtagUpdate");
const deleteAccount = require("./routes/users/delete");
const updateAccount = require("./routes/users/update");

const posts = require('./routes/posts/posts');
const getPosts = require('./routes/posts/getPosts');
const likePosts = require('./routes/posts/likePost');
const deletePosts = require('./routes/posts/deletePost');

const createChat = require("./routes/chat/createChat");
const getMessages = require("./routes/chat/getMessages");
const sendMessage = require("./routes/chat/sendMessage");
const deleteChat = require("./routes/chat/deleteChat");

const spotify = require("./routes/spotify/setUpSpot");
const spotifyUser = require("./routes/spotify/getUser");
const getTopGenres = require("./routes/spotify/getTop");

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Create Express App
const app = express();
// Use HTTP server for WebSockets
const server = http.createServer(app); 

// Initialize WebSockets
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Token Check Middleware
app.use('/api', tokenCheck);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error: ", err));

// Multer Setup for File Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use("/api/users", CreateAccount);
app.use("/api/users", Login);
app.use("/api/users/getProfilePicture", GetProfilePicture);
app.use("/api/users/updateProfilePicture", updateProfilePicture);
app.use("/api/users/account/get", getAccount);
app.use("/api/users/search", searchAccounts);
app.use("/api/users/profile/get", getProfile);
app.use("/api/users/follow", follow);
app.use("/api/users/me", me);
app.use("/api/users/hashtags", updateHashtag);
app.use("/api/users/delete", deleteAccount);
app.use("/api/users/update", updateAccount);

app.use("/api/posts/create", posts);
app.use("/api/posts/get", getPosts);
app.use("/api/posts/like", likePosts);
app.use("/api/posts/delete", deletePosts);

app.use("/api/chat/create", createChat);
app.use("/api/chat/get", getMessages);
app.use("/api/chat/send", sendMessage);
app.use("/api/chat/delete", deleteChat);

app.use("/api/spotify", spotify);
app.use("/api/spotify/userInfo", spotifyUser);
app.use("/api/spotify/genres", getTopGenres);

// WebSocket Events
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  socket.on("send_message", (data) => {
    io.to(data.chatId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

