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
        }).sort({ createdAt: -1 }); // Sorts by the most recent
        
        console.log('Posts found: ',recentPosts )

        res.status(200).json({ posts: recentPosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch recent posts.' });
    }
});

router.get('/user/:userId/posts', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find user and populate the posts field
      const userWithPosts = await User.findById(userId).populate('posts');
  
      if (!userWithPosts) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json(userWithPosts.posts);  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to fetch user posts.' });
    }
  });

module.exports = router;
