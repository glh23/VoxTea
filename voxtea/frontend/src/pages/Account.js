// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import TopBar from "../components/TopBar";
// import BottomBar from "../components/BottomBar";
// import '../components/postView.css';

// const Account = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null); 
//   const [posts, setPosts] = useState([]); 
//   const [currentPostIndex, setCurrentPostIndex] = useState(0); 
//   const [loading, setLoading] = useState(true); 
//   const [error, setError] = useState(null); 

//   // Fetch user account data
//   useEffect(() => {
//     const fetchAccountData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // Get token from session storage
//         const token = sessionStorage.getItem("authToken");
//         console.log("token: ", token);
//         // If there is no token send them back to login this is done in the auth as well
//         if (!token) {
//           console.error("No token found. Please log in again.");
//           navigate("/login");
//           return;
//         }

//         // Request the users data        
//         const response = await fetch("http://localhost:5000/api/users/account/get", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         // Receive the response and unpack the json into the the useState
//         const data = await response.json();
//         if (response.ok) {
//           setUser(data.username);
//           setPosts(data.posts || []);
//         } else {
//           setError(data.message || "Failed to fetch account data.");
//         }
//       } catch (error) {
//         console.error("Error fetching account data:", error);
//         setError("An error occurred while fetching account data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAccountData();
//   }, [navigate]);

//   // Handle Next Post
//   const handleNext = () => {
//     if (currentPostIndex < posts.length - 1) {
//       setCurrentPostIndex((prevIndex) => prevIndex + 1);
//     }
//   };

//   // Handle Previous Post
//   const handlePrevious = () => {
//     if (currentPostIndex > 0) {
//       setCurrentPostIndex((prevIndex) => prevIndex - 1);
//     }
//   };

//   // Handle Refresh Posts
//   const handleRefresh = () => {
//     setCurrentPostIndex(0); 
//     setLoading(true);
//     setError(null);
//     const fetchPosts = async () => {
//       try {
//         const token = sessionStorage.getItem("token");
//         if (!token) return;

//         const response = await fetch("http://localhost:5000/api/users/account/get", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setPosts(data.posts || []);
//         } else {
//           setError(data.message || "Failed to refresh posts.");
//         }
//       } catch (err) {
//         setError("An error occurred while refreshing posts.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   };

//   // Display loading screen
//   if (loading) {
//     return (
//       <div>
//         <TopBar/>
//           <div style={{ textAlign: "center", marginTop: "50px" }}>
//             <div>Loading...</div>
//             <img
//               src="/voxtea/VoxTea logo 1.png"
//               alt="Loading"
//               style={{ maxWidth: "50%", maxHeight: "50%" }}
//             />
//           </div>
//         <BottomBar/>
//       </div>
//     );
//   }

//   // Display no posts available
//   if (posts.length === 0) {
//     return (
//       <div>
//         <TopBar/>
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//           <h2>No posts available.</h2>
//           <img
//             src="/voxtea/VoxTea logo 1.png"
//             alt="No Posts"
//             style={{ maxWidth: "30%", maxHeight: "30%" }}
//           />
//         </div>
//         <BottomBar/>
//       </div>
//     );
//   }

//   // Get the current post
//   const currentPost = posts[currentPostIndex];

//   return (
//     <div>
//       <TopBar />
//       <div style={{ textAlign: "center", marginTop: "50px" }}>
//         <h1>Welcome, {user}</h1>
//         <h2>Your Posts</h2>
//         <div>
//           <h2>Player</h2>
//           <div className="player">
//             {/* Refresh Button */}
//             <img
//               src="/voxtea/arrow.png"
//               alt="Refresh Button"
//               className="reload-button"
//               onClick={handleRefresh}
//               style={{ cursor: "pointer" }}
//             />

//             {/* Post Info */}
//             <p>Post {currentPostIndex + 1} of {posts.length}</p>
//             <div className="postInfo">
//               <p>{currentPost.description}</p>
//               <audio controls crossOrigin="anonymous">
//                 <source src={`http://localhost:5000${currentPost.audioFile}`} type="audio/mp3" />
//                 Your browser does not support the audio element.
//               </audio>
//             </div>

//             {/* Navigation Buttons */}
//             <div>
//               <img
//                 src="/voxtea/previous.png"
//                 alt="Previous Button"
//                 className="skip-button-left"
//                 onClick={handlePrevious}
//                 style={{
//                   cursor: currentPostIndex === 0 ? "not-allowed" : "pointer",
//                   opacity: currentPostIndex === 0 ? 0.5 : 1,
//                   position: "relative",
//                   right: "4ch",
//                 }}
//               />
//               <img
//                 src="/voxtea/next.png"
//                 alt="Next Button"
//                 className="skip-button-right"
//                 onClick={handleNext}
//                 style={{
//                   cursor: currentPostIndex === posts.length - 1 ? "not-allowed" : "pointer",
//                   opacity: currentPostIndex === posts.length - 1 ? 0.5 : 1,
//                   position: "relative",
//                   left: "4ch",
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <BottomBar />
//     </div>
//   );
// };

// export default Account;

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
        <h2>Your Posts</h2>
        <div>
          <h2>Player</h2>
          <div className="player">
            {/* Refresh Button */}
            <img
              src="/voxtea/arrow.png"
              alt="Refresh Button"
              className="reload-button"
              onClick={handleRefresh}
              style={{ cursor: "pointer" }}
            />

            {/* Post Info */}
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
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default Account;
