const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Post = require('../../models/Post');
const Chat = require('../../models/Chat');
const Message = require('../../models/Message');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET ; 

router.delete('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  
  
  if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
  }

  // Verify and decode the token
  const decoded = jwt.verify(token, JWT_SECRET); 
  const userId = decoded.id;

  console.log("delete id: ", userId);


  try {
    // Delete users posts
    await Post.deleteMany({ userId: userId });

    // Remove user from likes in all posts
    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });

    //Delete messages where the user is a sender or recipient
    await Message.deleteMany({ sender: userId });

    // Delete chats where the user is a participant
    await Chat.deleteMany({ participants: userId });

    // Remove user from followers and following lists
    await User.updateMany({ following: userId }, { $pull: { following: userId } });
    await User.updateMany({ followers: userId }, { $pull: { followers: userId } });

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    // This is to check if the user was found and deleted as the above line returns null if not found 
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: 'User and associated data deleted successfully' });
  } 
  catch (error) {
    res.status(500).json({ message: 'Error deleting user and associated data', error: error.message });
  }
});

module.exports = router;