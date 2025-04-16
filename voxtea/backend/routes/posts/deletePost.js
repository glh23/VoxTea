const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

router.delete("/:id", async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    // Decode token to get the current user id
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const postId = req.params.id;

    // Find the post to delete and make sure it is the users
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (String(post.userId) !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this post." });
    }    

    // Delete post
    await Post.findByIdAndDelete(postId);

    // Remove reference from the user
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: postId }
    });

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error." });
  }
});


module.exports = router;