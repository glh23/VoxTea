import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import AudioPlayer from "../components/myAudioPlayer"; // Import the AudioPlayer component
import '../components/postView.css';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [posts, setPosts] = useState([]); 
  const [currentPostIndex, setCurrentPostIndex] = useState(0); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Fetch user account data
  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.error("No token found. Please log in again.");
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/users/account/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.username);
          setPosts(data.posts || []);
        } else {
          setError(data.message || "Failed to fetch account data.");
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
        setError("An error occurred while fetching account data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [navigate]);

  const handleDeletePost = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) return;
  
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
  
    try {
      const postId = currentPost._id;
  
      const response = await fetch(`http://localhost:5000/api/posts/delete/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete post.");
      }
  
      // Remove post from state
      const updatedPosts = posts.filter((post, index) => index !== currentPostIndex);
      setPosts(updatedPosts);
  
      // Adjust index so it doesn't go out of bounds
      if (currentPostIndex > 0) {
        setCurrentPostIndex(currentPostIndex - 1);
      } else {
        setCurrentPostIndex(0);
      }
  
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("An error occurred while deleting the post.");
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

  // Handle Refresh Posts
  const handleRefresh = async () => {
    setCurrentPostIndex(0);
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/users/account/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.message || "Failed to refresh posts.");
      }
    } catch (err) {
      setError("An error occurred while refreshing posts.");
    } finally {
      setLoading(false);
    }
  };

  // Display loading screen
  if (loading) {
    return (
      <div>
        <TopBar />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <div>Loading...</div>
          <img
            src="/voxtea/VoxTea logo 1.png"
            alt="Loading"
            style={{ maxWidth: "50%", maxHeight: "50%" }}
          />
        </div>
        <BottomBar />
      </div>
    );
  }

  // Display no posts available
  if (posts.length === 0) {
    return (
      <div>
        <TopBar />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>No posts available.</h2>
          <img
            src="/voxtea/VoxTea logo 1.png"
            alt="No Posts"
            style={{ maxWidth: "30%", maxHeight: "30%" }}
          />
        </div>
        <BottomBar />
      </div>
    );
  }

  // Get the current post
  const currentPost = posts[currentPostIndex];

  return (
    <div>
      <TopBar />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Welcome, {user}</h1>
        <div>
          <div className="player">
            {/* Refresh Button */}
            <img
              src="/voxtea/arrow.png"
              alt="Refresh Button"
              className="reload-button"
              onClick={handleRefresh}
              style={{ cursor: "pointer" }}
            />

            {/* Post Information */}
            <p>Post {currentPostIndex + 1} of {posts.length}</p>
            <div className="postInfo">
              <p>{currentPost.description}</p>
              
              {/* Use AudioPlayer Component */}
              <AudioPlayer
                audioSrc={`http://localhost:5000${currentPost.audioFile}`}
                onPlayNext={handleNext}
                onPlayPrevious={handlePrevious}
                isLiked={false}
                onLikeToggle={() => console.log("Like toggled")}
              />
            </div>
            
            {/* Delete*/}
            <button 
              onClick={handleDeletePost}
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                backgroundColor: "#DB2F62",
                color: "white",
                border: "none",
                borderRadius: "15px",
                cursor: "pointer"
              }}
            >
              Delete Post
            </button>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default Account;
