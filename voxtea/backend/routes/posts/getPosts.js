const express = require('express');
const Post = require('../../models/Post');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// Get posts from the last 28 days
router.get('/recent', async (req, res) => {
    try {

        // Get the user_id from the token 
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const currentUserId = decoded.id;

        const now = new Date();
        const past28Days = new Date(now.setDate(now.getDate() - 28));

        const recentPosts = await Post.find({ 
            createdAt: { $gte: past28Days } 
        // Sorts by the most recent
        }).sort({ createdAt: -1 }); 

        // Check if the like on the post corresponds with the userId
        const likedList = recentPosts.map(post => {
            if (currentUserId && post.likes) {
              const likesAsStrings = post.likes.map(likeId => likeId.toString());
              return likesAsStrings.includes(currentUserId) ? 1 : 0;
            }
            return 0;
          });

        console.log('Posts found: ',recentPosts, likedList )

        res.status(200).json({ posts: recentPosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch recent posts.' });
    }
});

module.exports = router;