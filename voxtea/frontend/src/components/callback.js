import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SpotifyCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      axios.get('http://localhost:5000/api/spotify/callback', { params: { code } })
        .then(response => {
          // Store the access token
          localStorage.setItem('spotifyAccessToken', response.data.access_token);
          localStorage.setItem('spotifyRefreshToken', response.data.refresh_token);
          navigate('/settings');
        })
        .catch(error => {
          console.error('Error exchanging code for token:', error);
        });
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default SpotifyCallback;
