const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const JWT_SECRET = process.env.JWT_SECRET 
// Get user and their posts
router.get('/', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // Find the user by ID and populate their posts
        const user = await User.findById(userId) .populate({
            path: 'posts',
            options: { sort: { createdAt: -1 } } 
        });;

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({ 
            username: user.username, 
            posts: user.posts, 
            email: user.email
        });
    } catch (error) {
        console.error('Error fetching user and posts:', error);
        return res.status(500).json({ message: 'Failed to fetch account information.' });
    }
});

module.exports = router;
