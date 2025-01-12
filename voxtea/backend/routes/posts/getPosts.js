const express = require('express');
const Post = require('../../models/Post');

const router = express.Router();

// Get posts from the last 28 days
router.get('/recent', async (req, res) => {
    try {
        const now = new Date();
        const past28Days = new Date(now.setDate(now.getDate() - 28));

        const recentPosts = await Post.find({ 
            createdAt: { $gte: past28Days } 
        }).sort({ createdAt: -1 }); // Sort by most recent

        res.status(200).json({ posts: recentPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch recent posts.' });
    }
});

module.exports = router;
