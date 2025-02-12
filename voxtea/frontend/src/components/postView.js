import React, { useState, useEffect } from "react";
import axios from "axios";
import './postView.css';

const PostList = () => {
  const [posts, setPosts] = useState([]); // Array of posts
  const [currentPostIndex, setCurrentPostIndex] = useState(0); // Current post index
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [likedList, setLikedList] = useState([]); // Array of like status (1 or 0)
  const token = sessionStorage.getItem("authToken");

  // Fetch posts from the backend
  const fetchRecentPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/posts/get/recent", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Assuming the backend returns { posts: [...], likedList: [...] }
      setPosts(response.data.posts || []);
      setLikedList(response.data.likedList || []);
      setCurrentPostIndex(0);
      console.log("Response of the get:", response.data);
    } catch (error) {
      console.error("Failed to fetch recent posts", error);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle like status for a given post
  const handleLikes = async (postId, postIndex) => {
    try {
      // Call your like endpoint for the post
      const res = await axios.post(`http://localhost:5000/api/posts/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Like toggled:", res.data);
      
      // Update likedList: if current value is 1, set to 0; if 0, set to 1.
      // You might also want to update the like count in the post if you return that from your API.
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
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(prevIndex => prevIndex + 1);
    }
  };

  // Handle Previous Post
  const handlePrevious = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex(prevIndex => prevIndex - 1);
    }
  };

  // Handle Refresh
  const handleRefresh = () => {
    fetchRecentPosts();
  };

  // Fetch posts
  useEffect(() => {
    fetchRecentPosts();
  }, []);

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

  // Check if current post is liked
  const currentPost = posts[currentPostIndex];
  const isLiked = likedList[currentPostIndex] === 1; 

  const play = () => {
    document.getElementById('player').play();
  };
  const pause = () => {
    document.getElementById('player').pause();
  };
  const volDown = () => {
    document.getElementById('player').volume -= 0.1;
  };
  const volUp = () => {
    document.getElementById('player').volume += 0.1;
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
          <h2>Player</h2>
          <p>Post {currentPostIndex + 1} of {posts.length}</p>
          <div className="postInfo">
            <p>{currentPost.description}</p>
            {/* Cross origin allows the audio to play in firefox */}
            <audio id="player" crossOrigin="anonymous"> 
              <source src={`http://localhost:5000${currentPost.audioFile}`} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <input id="myRange" className="slider" defaultValue="0" max="100" min="0" type="range" />
            <div> 
              <button onClick={play}>Play</button> 
              <button onClick={pause}>Pause</button> 
              <button onClick={volUp}>Vol +</button> 
              <button onClick={volDown}>Vol -</button> 
            </div>
          </div>
          <div>
              <img 
                src="/voxtea/previous.png" 
                alt="Previous Button" 
                className="skip-button-left" 
                onClick={handlePrevious} 
                disabled={currentPostIndex === 0}
                style={{ position: 'relative', right: '4ch' }}
              />
              {/* Like button */}
              <button 
                onClick={() => handleLikes(currentPost._id, currentPostIndex)}
                style={{
                  backgroundColor: isLiked ? "red" : "grey",
                }}
              >
                {isLiked ? "Unlike" : "Like"}
              </button>
              <img 
                src="/voxtea/next.png" 
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
