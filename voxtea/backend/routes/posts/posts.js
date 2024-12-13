const express = require('express');
const multer = require('multer');
const Post = require('../../models/Post');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Create a post
router.post('/', upload.single('audioFile'), async (req, res) => {
    const { description } = req.body;
    const audioFile = req.file.path;

    try {
        const post = await Post.create({ description, audioFile });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

module.exports = router;
