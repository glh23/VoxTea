const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET ; 

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
  

// Follow a user
router.post('/follow/:id', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];  

        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET); 
        const currentUserId = decoded.id;
        const targetUserId = req.params.id;

        console.log("verified");

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found." });
        }

        console.log("check 1");

        // Check if the user is already following
        if (!currentUser.following.includes(targetUserId)) {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);

            await currentUser.save();
            await targetUser.save();

            console.log("save");

            calculateClout(targetUserId)

            return res.status(200).json({ message: "User followed successfully." });
        } else {
            return res.status(400).json({ message: "You are already following this user." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while following the user." });
    }
});

// Unfollow a user
router.post('/unfollow/:id', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const currentUserId = decoded.id;
        const targetUserId = req.params.id;

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Remove from following and followers lists
        currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

        await currentUser.save();
        await targetUser.save();

        calculateClout(targetUserId);

        res.status(200).json({ message: "User unfollowed successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while unfollowing the user." });
    }
});

module.exports = router;

