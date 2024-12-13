const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const tokenCheck = require('./authCheck2');

const postRoutes = require('./routes/posts/posts');
const CreateAccount = require("./routes/users/CreateAccount");
const Login = require("./routes/users/login");

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

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
//app.use("/uploads", uploads);

// Routes
app.use('/api/auth/authCheck', tokenCheck);

app.use("/api/users", CreateAccount);
app.use("/api/users", Login);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

