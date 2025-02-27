const express = require('express');
const axios = require('axios');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../../models/User');
const Post = require('../../models/Post');

// Function to fetch user's top genres from Spotify
async function fetchTopGenres(accessToken) {
  const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      limit: 10,
      time_range: 'short_term', // Adjust the time range as needed
    },
  });

  const genres = response.data.items.flatMap(artist => artist.genres);
  return [...new Set(genres)]; // Remove duplicates
}

// Route to get user's top genres
router.get('/', async (req, res) => {
  try {
    console.log("I am in the genres get: ")
    const token = req.headers.authorization?.split(' ')[1];
    const spotifyAccessToken = req.headers.spotify?.split(' ')[1];
    if (!token || !spotifyAccessToken) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUserId = decoded.id;

    const user = await User.findById(currentUserId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch top genres from Spotify
    const topGenres = await fetchTopGenres(spotifyAccessToken);

    console.log("top genres: ",topGenres);

    const matchingPosts = await Post.find({ 
      //hashtags: { $in: topGenres.map(genre => `#${genre.replace(/\s+/g, '')}`) }
      hashtags: { $in: topGenres.map(genre => `${genre.replace(/\s+/g, '')}`) }
    });

    console.log("Found matching posts:", matchingPosts.length);
    res.status(200).json({ posts: matchingPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch top genres.' });
  }
});

module.exports = router;