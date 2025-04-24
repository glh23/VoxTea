// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import TopBar from "../components/TopBar";
// import BottomBar from "../components/BottomBar";
// import AudioPlayer from "../components/myAudioPlayer"; 


// const UserProfile = () => {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [otherUser, setOtherUser] = useState(null); // Logged-in user
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isFollowing, setIsFollowing] = useState(false);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = sessionStorage.getItem("authToken");
//         const response = await fetch(`http://localhost:5000/api/users/profile/get/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUser(data);
//           console.log('Fetched user data:', data); // Log user data

//           // Get user info
//           const otherUserResponse = await fetch(`http://localhost:5000/api/users/account/get`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           if (otherUserResponse.ok) {
//             const otherUserData = await otherUserResponse.json();
//             setOtherUser(otherUserData);

//             // Check if the logged in user is already following this profile
//             const isFollowingUser = otherUserData.following.some(followedUser => followedUser._id === id);
//             setIsFollowing(isFollowingUser);
//           }
//         } else {
//           const errorMessage = await response.json();
//           setError(errorMessage.message);
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         setError("Failed to load user profile. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [id]);

//   const handleFollowToggle = async () => {
//     try {
//       const token = sessionStorage.getItem("authToken");
//       const endpoint = isFollowing
//         ? `http://localhost:5000/api/users/follow/unfollow/${id}`
//         : `http://localhost:5000/api/users/follow/follow/${id}`;

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });

//       if (response.ok) {
//         setIsFollowing(!isFollowing);
//       } else {
//         const errorMessage = await response.json();
//         console.error("Error:", errorMessage.message);
//       }
//     } catch (error) {
//       console.error("Error following/unfollowing user:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div>
//         <TopBar />
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//           <div>Loading...</div>
//         </div>
//         <BottomBar />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <TopBar />
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//           <p>Error: {error}</p>
//         </div>
//         <BottomBar />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <TopBar />
//       <div style={{ textAlign: "center", marginTop: "50px" }}>
//         <h1>{user.username}'s Profile</h1>
//         <img
//           src={user.profilePicture}
//           alt={`${user.username}'s avatar`}
//           style={{ width: "150px", height: "150px", borderRadius: "50%", marginBottom: "20px" }}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = "/user.png";
//           }}
//         />
//         <div>
//           <button onClick={handleFollowToggle} style={{ padding: "10px", margin: "10px" }}>
//             {isFollowing ? "Unfollow" : "Follow"}
//           </button>
//         </div>

//         <h2>Posts</h2>
//         {user.posts.length === 0 ? (
//           <p>No posts available.</p>
//         ) : (
//           user.posts.map((post) => (
//             <div key={post._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px auto", maxWidth: "600px", borderRadius: "5px" }}>
//               <h3>{post.title}</h3>
//               <p>{post.content}</p>
//               {post.audioFile && (
//                 <audio controls style={{ width: "100%" }}>
//                   <source src={`http://localhost:5000${post.audioFile}`} type="audio/mp3" />
//                   Your browser does not support the audio element.
//                 </audio>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//       <BottomBar />
//     </div>
//   );
// };

// export default UserProfile;













import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import AudioPlayer from "../components/myAudioPlayer";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // To store the user's posts
  const [currentPostIndex, setCurrentPostIndex] = useState(0); // To track the current post index
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5000/api/users/profile/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setPosts(data.posts || []); // Set the user's posts
          console.log("Fetched user data:", data);

          // Check if the logged-in user is already following this profile
          const otherUserResponse = await fetch(`http://localhost:5000/api/users/account/get`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (otherUserResponse.ok) {
            const otherUserData = await otherUserResponse.json();
            const isFollowingUser = otherUserData.following.some(
              (followedUser) => followedUser._id === id
            );
            setIsFollowing(isFollowingUser);
          }
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const endpoint = isFollowing
        ? `http://localhost:5000/api/users/follow/unfollow/${id}`
        : `http://localhost:5000/api/users/follow/follow/${id}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        const errorMessage = await response.json();
        console.error("Error:", errorMessage.message);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
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

  if (loading) {
    return (
      <div>
        <TopBar />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <div>Loading...</div>
        </div>
        <BottomBar />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <TopBar />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p>Error: {error}</p>
        </div>
        <BottomBar />
      </div>
    );
  }

  const currentPost = posts[currentPostIndex];

  return (
    <div>
      <TopBar />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>{user.username}'s Profile</h1>
        <img
          src={user.profilePicture}
          alt={`${user.username}'s avatar`}
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            marginBottom: "20px",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/user.png";
          }}
        />
        <div>
          <button onClick={handleFollowToggle} style={{ padding: "10px", margin: "10px" }}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>

        <h2>Post {currentPostIndex + 1} of {posts.length}</h2>
        {currentPost ? (
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px auto",
              maxWidth: "600px",
              borderRadius: "5px",
            }}
          >
            <h3>{currentPost.title}</h3>
            <p>{currentPost.content}</p>
            {currentPost.audioFile ? (
              <AudioPlayer
                audioSrc={`http://localhost:5000${currentPost.audioFile}`}
                onPlayNext={handleNext}
                onPlayPrevious={handlePrevious}
                isLiked={false} // Replace with actual logic if needed
                onLikeToggle={() => console.log(`Toggled like for post ${currentPost._id}`)}
              />
            ) : (
              <p>No audio available for this post.</p>
            )}
          </div>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
      <BottomBar />
    </div>
  );
};

export default UserProfile;