import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";

const UserProfile = () => {
  const { id } = useParams(); // Extract the ID from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/profile/get/${id}`
        );

        console.log(response);

        if (response.ok) {
          const data = await response.json();
          setUser(data);
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
  }, [id]); // Depend on `id`

  // Loading and error handling remain the same
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

  return (
    <div>
      <TopBar />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>{user.username}'s Profile</h1>
        <img
          src={user.profilePicture || "/default-avatar.png"}
          alt={`${user.username}'s avatar`}
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            marginBottom: "20px",
          }}
        />
        <h2>Posts</h2>
        {user.posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <div>
            {user.posts.map((post) => (
              <div
                key={post._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  margin: "10px auto",
                  maxWidth: "600px",
                  borderRadius: "5px",
                }}
              >
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.audioFile && (
                  <audio controls style={{ width: "100%" }}>
                    <source
                      src={`http://localhost:5000${post.audioFile}`}
                      type="audio/mp3"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomBar />
    </div>
  );
};

export default UserProfile;

