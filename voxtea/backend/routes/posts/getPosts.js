const express = require('express');
const Post = require('../../models/Post');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../../models/User");

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

// Get posts with matching hashtags from the last 56 days
router.get('/hashtags', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const currentUserId = decoded.id;

        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userHashtags = user.interestedHashtags;

        const now = new Date();
        const past56Days = new Date(now.setDate(now.getDate() - 56));

        const postsWithHashtags = await Post.find({
            hashtags: { $in: userHashtags },
            createdAt: { $gte: past56Days }
        }).sort({ createdAt: -1 });

        console.log('Posts with matching hashtags: ', postsWithHashtags);
        res.status(200).json({ posts: postsWithHashtags });
    } catch (error) {
        console.log(error); 
        res.status(500).json({ message: 'Failed to fetch posts with matching hashtags.' });
    }
});

router.get('/top', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ likes: -1 })  // Sort by likes array length in descending order
            .limit(100)            // Limit to top 100
            .exec();

        if (!posts.length) {
            return res.status(404).json({ message: 'No posts found.' });
        }

        res.status(200).json({posts: posts});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch the top 100 posts with the most likes.' });
    }
});

// https://accounts.spotify.com/authorize?client_id=66ee1cf9b4524fd4a6ce720c6209eb83&response_type=code&redirect_uri=http://localhost:5000/callback&scope=user-read-private%20user-read-email

module.exports = router;