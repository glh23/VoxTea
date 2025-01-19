import React, { useState, useEffect } from "react";
import axios from "axios";
import './postView.css';

const PostList = () => {
  const [posts, setPosts] = useState([]); // Array of posts
  const [currentPostIndex, setCurrentPostIndex] = useState(0); // Current post index
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch posts from the backend
  const fetchRecentPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/posts/get/recent");
      setPosts(response.data.posts || []); // Store posts in state
      setCurrentPostIndex(0); // Reset to the first post
      console.log("Response of the get:", response)
    } catch (error) {
      console.error("Failed to fetch recent posts", error);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Next Post
  const handleNext = () => {
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Handle Previous Post
  const handlePrevious = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Handle Refresh
  const handleRefresh = () => {
    fetchRecentPosts();
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchRecentPosts();
  }, []);

  // Display loading, error, or the current post
  // if (loading) {
  //   return (
  //     <img 
  //       src= "/voxtea/refresh.png" 
  //       alt="Refresh Button" 
  //       className="reload-button" 
  //       onClick={handleRefresh} 
  //     />
  //   );
  // }

  if (error) {
    return (
      <div>
        <button onClick={handleRefresh}>Try Again</button>
        <p>{error}</p>
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

  const currentPost = posts[currentPostIndex];

  return (
    <div>
      <div>
        <h2>Player</h2>
        <div className="player">
          <img 
            src= "/voxtea/arrow.png" 
            alt="Refresh Button" 
            className="reload-button" 
            onClick={handleRefresh} 
          />
          <p>Post {currentPostIndex + 1} of {posts.length}</p>
          <div className="postInfo">
            <p>{currentPost.description}</p>
            {/* Cross origin allows the audio to play in firefox (the best browser) */}
            <audio controls crossOrigin="anonymous"> 
              <source src={`http://localhost:5000${currentPost.audioFile}`} type="audio/mp3" />
              Your browser does not support the audio element. 
            </audio>
          </div>
          <div>
              <img 
                src= "/voxtea/previous.png" 
                alt="Previous Button" 
                className="skip-button-left" 
                onClick={handlePrevious} 
                disabled={currentPostIndex === 0}
                style={{position: 'relative', right: '4ch'}}
              />
              <img 
                src= "/voxtea/next.png" 
                alt="Next Button" 
                className="skip-button-right" 
                onClick={handleNext} 
                disabled={currentPostIndex === posts.length - 1}
                style={{position: 'relative', left: '4ch'}}
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;
