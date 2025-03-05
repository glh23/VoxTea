// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import './postView.css';

// const PostList = () => {
//   const [posts, setPosts] = useState([]);
//   const [currentPostIndex, setCurrentPostIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [likedList, setLikedList] = useState([]);
//   const [postType, setPostType] = useState('recent');
//   const token = sessionStorage.getItem("authToken");
//   const spotifyToken = localStorage.getItem("spotifyAccessToken")
//   const refreshToken = localStorage.getItem("spotifyRefreshToken")
//   const audioRef = useRef(null);

//   // Fetch posts from the backend
//   const fetchPosts = async (type) => {
//     setLoading(true);
//     setError(null);
//     try {
//       let response;
//       if (type === 'recent') {
//         response = await axios.get("http://localhost:5000/api/posts/get/recent", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       }
//       else if (type === 'hashtags') {
//         response = await axios.get("http://localhost:5000/api/posts/get/hashtags", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       }
//       else if (type === 'top') {
//         response = await axios.get("http://localhost:5000/api/posts/get/top", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       }
//       else if (type === 'spotify') {
//         // Request access token for spotify api
//         try{
//           let tokens = await axios.post("http://localhost:5000/api/spotify/refresh", {
//             refresh_token: refreshToken
//           }, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//         localStorage.setItem('spotifyAccessToken', tokens.data.access_token);
//         }catch(error){
//           console.log("Access Error: ", error)
//         }
//         // Get the posts relating to spotify APIs genres
//         response = await axios.get("http://localhost:5000/api/spotify/genres", {
//           headers: { Authorization: `Bearer ${token}`, Spotify: `Bearer ${spotifyToken}`}
//         });
//       }
//       console.log(response);
//       setPosts(response.data.posts || []);
//       setLikedList(response.data.likedList || []);
//       setCurrentPostIndex(0);
//       console.log("Response of the get:", response.data);
//     } catch (error) {
//       console.error("Failed to fetch posts", error);
//       setError("Failed to fetch posts. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle like status for a given post
//   const handleLikes = async (postId, postIndex) => {
//     try {
//       // Call endpoint for the post
//       const res = await axios.post(`http://localhost:5000/api/posts/like/${postId}`, {}, {
//         headers: { Authorization: `Bearer ${token}`}
//       });
//       console.log("Like toggled:", res.data);

//       setLikedList(prevLikedList => {
//         const updated = [...prevLikedList];
//         updated[postIndex] = updated[postIndex] === 1 ? 0 : 1;
//         return updated;
//       });
//     } catch (error) {
//       console.error("Error toggling like", error);
//     }
//   };

//   // Handle Next Post
//   const handleNext = () => {
//     pause();
//     if (currentPostIndex < posts.length - 1) {
//       setCurrentPostIndex(prevIndex => prevIndex + 1);
//     }
//   };

//   // Handle Previous Post
//   const handlePrevious = () => {
//     pause();
//     if (currentPostIndex > 0) {
//       setCurrentPostIndex(prevIndex => prevIndex - 1);
//     }
//   };

//   // Handle Refresh
//   const handleRefresh = () => {
//     fetchPosts(postType);
//   };

//   // Handle Dropdown Selection
//   const handlePostTypeChange = (event) => {
//     setPostType(event.target.value);
//     fetchPosts(event.target.value);
//   };

//   const [progress, setProgress] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
  
//   useEffect(() => {
//     const audioElement = audioRef.current;
  
//     const handleTimeUpdate = () => {
//       if (audioElement && !isNaN(audioElement.duration) && audioElement.duration > 0) {
//         const percentage = (audioElement.currentTime / audioElement.duration) * 100;
//         if (isPlaying) {
//           setProgress(percentage); // Update progress only if playing
//         }
//       }
//     };
  
//     const handlePlay = () => setIsPlaying(true);
//     const handlePause = () => setIsPlaying(false);
  
//     if (audioElement) {
//       audioElement.addEventListener("timeupdate", handleTimeUpdate);
//       audioElement.addEventListener("play", handlePlay);
//       audioElement.addEventListener("pause", handlePause);
//     }
  
//     return () => {
//       if (audioElement) {
//         audioElement.removeEventListener("timeupdate", handleTimeUpdate);
//         audioElement.removeEventListener("play", handlePlay);
//         audioElement.removeEventListener("pause", handlePause);
//       }
//     };
//   }, [currentPostIndex, isPlaying]); // Track play state
  
//   const handleRangeInputChange = (event) => {
//     const newTime = (parseFloat(event.target.value) / 100) * audioRef.current.duration;
//     audioRef.current.currentTime = newTime;
//     setProgress(parseFloat(event.target.value));
//   };
  

//   if (error) {
//     return (
//       <div>
//         <button onClick={handleRefresh}>Try Again</button>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (posts.length === 0) {
//     return (
//       <div>
//         <button onClick={handleRefresh}>Refresh</button>
//         <p>No posts available.</p>
//       </div>
//     );
//   }

//   // Check if current post is liked
//   const currentPost = posts[currentPostIndex];
//   const isLiked = likedList[currentPostIndex] === 1;

//   const play = () => {
//     if (audioRef.current) {
//       audioRef.current.play();
//       setIsPlaying(true); // Track playing state
//     }
//   };
  
//   const pause = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       setIsPlaying(false); // Track pause state
//     }
//   };
//   const volDown = () => {
//     if (audioRef.current && audioRef.current.volume > 0.1) {
//       audioRef.current.volume -= 0.1;
//     }
//   };
//   const volUp = () => {
//     if (audioRef.current && audioRef.current.volume < 1) {
//       audioRef.current.volume += 0.1;
//     }
//   };

//   return (
//     <div>
//       <div>
//         <div className="player">
//           <img
//             src="/voxtea/arrow.png"
//             alt="Refresh Button"
//             className="reload-button"
//             onClick={handleRefresh}
//           />
//           <div className="dropdown" style={{ position: 'relative', top: '10px', right: '10px' }}>
//             <select onChange={handlePostTypeChange} value={postType}>
//               <option value="recent">Recent</option>
//               <option value="top">Top</option>
//               <option value="hashtags">Interests</option>
//               <option value="spotify">Recommended</option>
//             </select>
//           </div>
//           <h2>Player</h2>
//           <p>Post {currentPostIndex + 1} of {posts.length}</p>
//           <div className="postInfo">
//             <p>{currentPost.description}</p>
//             {/* Cross origin allows the audio to play in firefox */}
//             <audio id="player" crossOrigin="anonymous" key={currentPost._id} ref={audioRef}>
//               <source src={`http://localhost:5000${currentPost.audioFile}`} type="audio/mp3" />
//               Your browser does not support the audio element.
//             </audio>
//             <input
//               id="myRange"
//               className="slider"
//               type="range"
//               min="0"
//               max="100"
//               value={progress} // Controlled by React state
//               onChange={handleRangeInputChange}
//             />
//             <div>
//               <button onClick={play}>Play</button>
//               <button onClick={pause}>Pause</button>
//               <button onClick={volUp}>Vol +</button>
//               <button onClick={volDown}>Vol -</button>
//             </div>
//           </div>
//           <div>
//             <img
//               src="/voxtea/previous.png"
//               alt="Previous Button"
//               className="skip-button-left"
//               onClick={handlePrevious}
//               disabled={currentPostIndex === 0}
//               style={{ position: 'relative', right: '4ch' }}
//             />
//             {/* Like button */}
//             <button
//               onClick={() => handleLikes(currentPost._id, currentPostIndex)}
//               style={{
//                 backgroundColor: isLiked ? "red" : "grey",
//               }}
//             >
//               {isLiked ? "Unlike" : "Like"}
//             </button>
//             <img
//               src="/voxtea/next.png"
//               alt="Next Button"
//               className="skip-button-right"
//               onClick={handleNext}
//               disabled={currentPostIndex === posts.length - 1}
//               style={{ position: 'relative', left: '4ch' }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostList;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './postView.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedList, setLikedList] = useState([]);
  const [postType, setPostType] = useState('recent');
  const token = sessionStorage.getItem("authToken");
  const spotifyToken = localStorage.getItem("spotifyAccessToken")
  const refreshToken = localStorage.getItem("spotifyRefreshToken")
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
      }
      else if (type === 'hashtags') {
        response = await axios.get("http://localhost:5000/api/posts/get/hashtags", {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      else if (type === 'top') {
        response = await axios.get("http://localhost:5000/api/posts/get/top", {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      else if (type === 'spotify') {
        // Request access token for spotify api
        try{
          let tokens = await axios.post("http://localhost:5000/api/spotify/refresh", {
            refresh_token: refreshToken
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        localStorage.setItem('spotifyAccessToken', tokens.data.access_token);
        }catch(error){
          console.log("Access Error: ", error)
        }
        // Get the posts relating to spotify APIs genres
        response = await axios.get("http://localhost:5000/api/spotify/genres", {
          headers: { Authorization: `Bearer ${token}`, Spotify: `Bearer ${spotifyToken}`}
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

  // Toggle like status for a given post
  const handleLikes = async (postId, postIndex) => {
    try {
      // Call endpoint for the post
      const res = await axios.post(`http://localhost:5000/api/posts/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}`}
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
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => {
      if (audioElement && !isNaN(audioElement.duration) && audioElement.duration > 0) {
        const percentage = (audioElement.currentTime / audioElement.duration) * 100;
        if (isPlaying) {
          setProgress(percentage); // Update progress only if playing
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
      setIsPlaying(true); // Track playing state
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false); // Track pause state
    }
  };

  const volDown = () => {
    if (audioRef.current && audioRef.current.volume > 0.1) {
      audioRef.current.volume -= 0.1;
    }
  };

  const volUp = () => {
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
            <select onChange={handlePostTypeChange} value={postType}>
              <option value="recent">Recent</option>
              <option value="top">Top</option>
              <option value="hashtags">Interests</option>
              <option value="spotify">Recommended</option>
            </select>
          </div>
          <h2>Player</h2>
          <p>Post {currentPostIndex + 1} of {posts.length}</p>
          <div className="postInfo">
            <p>{currentPost.description}</p>
            {/* Cross origin allows the audio to play in firefox */}
            <audio id="player" crossOrigin="anonymous" key={currentPost._id} ref={audioRef}>
              <source src={`http://localhost:5000${currentPost.audioFile}`} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <input
              id="myRange"
              className="slider"
              type="range"
              min="0"
              max="100"
              value={progress} // Controlled by React state
              onChange={handleRangeInputChange}
            />
            <div>
              <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
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
