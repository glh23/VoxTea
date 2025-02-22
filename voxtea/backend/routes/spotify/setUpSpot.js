const axios = require('axios');
const qs = require('qs');
const express = require('express');
const querystring = require("querystring");
const router = express.Router();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
console.log("Client Id: ", CLIENT_ID)

// Route to get authorization URL
router.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email user-top-read playlist-read-private";
  const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
  })}`;
  //res.redirect(authURL);
  res.status(200).json(authURL);
});

// Route to handle Spotify callback
router.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Authorization code missing");

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token", querystring.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

    accessToken = response.data.access_token;
    res.json({ message: "Authenticated", access_token: accessToken });
  } catch (error) {
    res.status(500).json({ error: "Failed to get token", details: error.response.data });
  }
});


module.exports = router;