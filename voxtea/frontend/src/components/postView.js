import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './postView.css';

const PostList = ({ refreshPostView }) => {
  const [posts, setPosts] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedList, setLikedList] = useState([]);
  const [postType, setPostType] = useState('recent');
  const token = sessionStorage.getItem("authToken");
  const spotifyToken = localStorage.getItem("spotifyAccessToken");
  const refreshToken = localStorage.getItem("spotifyRefreshToken");
  const audioRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch posts from the backend
  const fetchPosts = async (type) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (type === 'recent') {
        response = await axios.get("http://localhost:5000/api/posts/get/recent", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response);
      } else if (type === 'hashtags') {
        response = await axios.get("http://localhost:5000/api/posts/get/hashtags", {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (type === 'top') {
        response = await axios.get("http://localhost:5000/api/posts/get/top", {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (type === 'spotify') {
        // Request access token for spotify api
        try {
          let tokens = await axios.post("http://localhost:5000/api/spotify/refresh", {
            refresh_token: refreshToken
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          localStorage.setItem('spotifyAccessToken', tokens.data.access_token);
        } catch (error) {
          console.log("Access Error: ", error);
          // If  it can't get spotify just show the top posts
          response = await axios.get("http://localhost:5000/api/posts/get/top", {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        // Get the posts relating to spotify API's genres
        response = await axios.get("http://localhost:5000/api/spotify/genres", {
          headers: { Authorization: `Bearer ${token}`, Spotify: `Bearer ${spotifyToken}` }
        });
      }
      console.log(response);
      setPosts(response.data.posts || []);
      setLikedList(response.data.likedList || []);
      setCurrentPostIndex(0);
      console.log("Response of the get:", response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh post view when a new post is created
  useEffect(() => {
    fetchPosts(postType);
  }, [postType, refreshPostView]); 

  // Toggle like status for a given post
  const handleLikes = async (postId, postIndex) => {
    try {
      // Call endpoint for the post
      const res = await axios.post(`http://localhost:5000/api/posts/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Like toggled:", res.data);

      setLikedList(prevLikedList => {
        const updated = [...prevLikedList];
        updated[postIndex] = updated[postIndex] === 1 ? 0 : 1;
        return updated;
      });
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  // Handle Next Post
  const handleNext = () => {
    pause();
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(prevIndex => prevIndex + 1);
    }
  };

  // Handle Previous Post
  const handlePrevious = () => {
    pause();
    if (currentPostIndex > 0) {
      setCurrentPostIndex(prevIndex => prevIndex - 1);
    }
  };

  // Handle Refresh
  const handleRefresh = () => {
    fetchPosts(postType);
  };

  // Handle Dropdown Selection
  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
    fetchPosts(event.target.value);
  };

  useEffect(() => {
    fetchPosts(postType);
  }, [postType]); 

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => {
      if (audioElement && !isNaN(audioElement.duration) && audioElement.duration > 0) {
        const percentage = (audioElement.currentTime / audioElement.duration) * 100;
        if (isPlaying) {
          setProgress(percentage); 
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
      }
    };
  }, [currentPostIndex, isPlaying]); // Track play state

  const handleRangeInputChange = (event) => {
    const newTime = (parseFloat(event.target.value) / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(parseFloat(event.target.value));
  };

  if (error) {
    return (
      <div>
        <button onClick={handleRefresh}>Try Again</button>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div>
        <button onClick={handleRefresh}>Refresh</button>
        <p>No posts available.</p>
      </div>
    );
  }

  // Check if current post is liked
  const currentPost = posts[currentPostIndex];
  const isLiked = likedList[currentPostIndex] === 1;

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true); 
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false); 
    }
  };

  const handleBounce = (e) => {
    e.target.classList.add("bounce");
    setTimeout(() => e.target.classList.remove("bounce"), 400);
  };

  const volDown = (e) => {
    handleBounce(e);
    if (audioRef.current && audioRef.current.volume > 0.1) {
      audioRef.current.volume -= 0.1;
    }
  };

  const volUp = (e) => {
    handleBounce(e);
    if (audioRef.current && audioRef.current.volume < 1) {
      audioRef.current.volume += 0.1;
    }
  };

  return (
    <div>
      <div>
        <div className="player">
          <img
            src="/voxtea/arrow.png"
            alt="Refresh Button"
            className="reload-button"
            onClick={handleRefresh}
          />
          <div className="dropdown" style={{ position: 'relative', top: '10px', right: '10px' }}>
            <select onChange={handlePostTypeChange} value={postType} role="combobox">
              <option value="recent">Recent</option>
              <option value="top">Top</option>
              <option value="hashtags">Interests</option>
              <option value="spotify">Recommended</option>
            </select>
          </div>
          <h2>{currentPost.userId?.username || 'Unknown User'}</h2>
          <p>Post {currentPostIndex + 1} of {posts.length}</p>
          <div className="postInfo">
            <p>{currentPost.description}</p>
            {/* Cross origin allows the audio to play in firefox */}
            <audio id="player" data-testid="player" crossOrigin="anonymous" key={currentPost._id} ref={audioRef}>
              <source src={`http://localhost:5000${currentPost.audioFile}`} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <input
              id="myRange"
              className="slider"
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleRangeInputChange}
            />
            <div>
              <img
                src="/voxtea/volume-down.png"
                alt="Volume Down"
                className="volume-button"
                onClick={(e) => volDown(e)}
                style={{ cursor: 'pointer' }}
              />
              <img
                src={isLiked ? "/voxtea/favourite(1).png" : "/voxtea/favourite.png"}
                alt={isLiked ? "Unlike" : "Like"}
                className="like-button"
                onClick={() => handleLikes(currentPost._id, currentPostIndex)}
                style={{ cursor: 'pointer' }}
              />
              <img
                src="/voxtea/volume-up.png"
                alt="Volume Up"
                className="volume-button"
                onClick={(e) => volUp(e)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
          <div>
            <img
              src="/voxtea/fast-backward-button.png"
              alt="Previous Button"
              className="skip-button-left"
              onClick={handlePrevious}
              disabled={currentPostIndex === 0}
              style={{ position: 'relative', right: '4ch' }}
            />
            {/* Play/Pause button with icons */}
            <img
              src={isPlaying ? "/voxtea/pause-button.png" : "/voxtea/play-button.png"}
              alt={isPlaying ? "Pause" : "Play"}
              className="play-pause-button"
              onClick={togglePlayPause}
              style={{ cursor: 'pointer' }}
            />
            <img
              src="/voxtea/fast-forward-button.png"
              alt="Next Button"
              className="skip-button-right"
              onClick={handleNext}
              disabled={currentPostIndex === posts.length - 1}
              style={{ position: 'relative', left: '4ch' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;
