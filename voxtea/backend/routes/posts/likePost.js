const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const calculateClout = async (userId) => {
  const user = await User.findById(userId).populate('followers').populate('posts');
  if (!user) return;

  let clout = user.followers.length + user.posts.length;
  user.posts.forEach(post => {
    clout += post.likes.length;
  });

  user.clout = clout;
  await user.save();
};


router.post("/:postId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    // Decode token to get the current user id
    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUserId = decoded.id;
    
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked the post
    const likeIndex = post.likes.indexOf(currentUserId);
    let action;
    if (likeIndex === -1) {
      // Not liked yet then add like
      post.likes.push(currentUserId);
      action = "liked";
    } else {
      // Already liked then remove like
      post.likes.splice(likeIndex, 1);
      action = "unliked";
    }
    
    await post.save();

    calculateClout(post.userId);
    
    // Return the updated like count and the array of user IDs
    res.status(200).json({ 
      message: `Post ${action} successfully`, 
      likes: post.likes,
      likeCount: post.likes.length
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;