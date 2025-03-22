import React, { useState, useEffect, useContext } from "react";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import axios from "axios";
import ThemeContext from "../components/themeContext";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [hashtags, setHashtags] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [spotifyInfo, setSpotifyInfo] = useState('');

  // Get token from session storage
  const token = sessionStorage.getItem("authToken");
  const spotifyToken = localStorage.getItem("spotifyAccessToken")

  useEffect(() => {
    // Fetch the current profile image
    axios.get("http://localhost:5000/api/users/getProfilePicture", {
        headers: { Authorization: token },
      })
      .then((res) => {
         // Default image if there isn't one
         setProfilePicture(res.data.profilePicture || "default.png");
      })
      .catch((err) => {
        console.error(err);
        console.log("Failed to load profile image.");
      });

    // Fetch the user's hashtags
    axios.get("http://localhost:5000/api/users/hashtags/get", {
        headers: { Authorization: token },
      })
      .then((res) => {
        setHashtags(res.data.hashtags.join(' '));
      })
      .catch((err) => {
        console.error(err);
        console.log("Failed to load hashtags.");
      });

    // Fetch the user's spotify data
    axios.get('http://localhost:5000/api/spotify/userInfo', {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    })
    .then((res) => {
      console.log(res.data);
      setSpotifyInfo(res.data);
    })
    .catch((err) => {
      console.error(err);
      console.log("Failed to load Spotify data.");
    });
  }, [token]);


  // Profile picture update
  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (!newImage) {
      alert("Please select an image to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", newImage);
    try {
      const res = await axios.post("http://localhost:5000/api/users/updateProfilePicture",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(res.data.message);
      // Update the profile image in the UI
      setProfilePicture(res.data.profilePicture);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    }
  };

  const handleHashtagsChange = (e) => {
    setHashtags(e.target.value);
  };
  const handleHashtagsSave = async () => {
    const hashtagArray = hashtags.split(' ').filter(tag => tag.trim() !== '');
    try {
      const res = await axios.post("http://localhost:5000/api/users/hashtags/update",
        { hashtags: hashtagArray },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert(res.data.message);
    } 
    catch (err) {
      console.error(err);
      alert("Failed to save hashtags.");
    }
  };

  const handleSpotify = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/spotify/login", {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const responseBody = await response.json(); 
      const redirectURL = responseBody; 
  
      console.log("Redirect URL:", redirectURL);
  
      if (redirectURL) {
        window.location.href = redirectURL; 
      } else {
        console.error("No redirect URL found.");
        alert("Failed to connect to Spotify.");
      }
    } catch (err) {
      console.error("Error connecting to Spotify:", err);
      alert("Failed to connect to Spotify.");
    }
  };  
  const handleBack = () => {
    navigate('/Home');
  };

  const handleDeleteUser = async () => {
    try {
      
      axios.delete('http://localhost:5000/api/users/delete/user', {
        headers: { Authorization: `Bearer ${token}`} 
      })
      
      .then(response => console.log("User deleted:", response.data))
      .catch(error => console.error("Failed to delete user:", error));

      console.log("User information has been deleted successfully.");

      sessionStorage.removeItem("authToken");
      localStorage.removeItem("spotifyAccessToken");

      navigate("/login");
      alert("Your account has been deleted.");
    } 
    catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleOpenPopup = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setIsDeletePopupVisible(false);
  };

  const handleDeleteUserPopup = () => {
    setIsDeletePopupVisible(true);
  };

  return (
    <div>
      <TopBar />
      <img
        src="/voxtea/turn-back.png"
        alt="Previous Button"
        className="button-icon"
        onClick={handleBack}
        style={{ position: 'absolute', top: '80px', left: '10px' }}
      />
      <div style={{ textAlign: "center", margin: "20px" }}>
        <h1>Settings</h1>
  
        <div className="setting">
          <h2>Profile Picture</h2>
          <img
            className="profilePicture"
            src={`http://localhost:5000/uploads/profilePictures/${profilePicture}`}
            alt="Profile"
            style={{ width: "150px", height: "150px" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/user.png";
            }}
          />
          <div>
            <input type="file" onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload</button>
          </div>
        </div>
  
        <div className="setting">
          <h2>Hashtags</h2>
          <input
            type="text"
            placeholder="Enter hashtags separated by spaces"
            value={hashtags}
            onChange={handleHashtagsChange}
            style={{ width: "80%", marginBottom: "10px" }}
          />
          <button onClick={handleHashtagsSave}>Save Hashtags</button>
          <button onClick={handleOpenPopup}>View Hashtags</button>
        </div>
  
        <div className="setting">
          <h2>{`Current Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}</h2>
          <button onClick={toggleTheme}>
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>
  
        <div className="setting">
          <h2>Spotify</h2>
          {spotifyInfo ? (
            <p>Logged in as: {spotifyInfo.display_name}</p> // Display username if spotifyInfo is available
          ) : (
            <p>Login to Spotify to improve what you see.</p> // Show the default message when not logged in
          )}
          <button onClick={handleSpotify}>
            {spotifyInfo ? "Reconnect Spotify" : "Spotify Login"}  {/* Change button text accordingly */}
          </button>
        </div>

        <div className="setting">
          <h2>Delete User</h2>
          <p>This will delete your messages, chats, posts and information</p>
          <button onClick={handleDeleteUserPopup}>Delete User</button>
         </div>
  
        {isPopupVisible && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <h2>Your Hashtags</h2>
              <ul>
                {hashtags.split(' ').map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div> 

      {isDeletePopupVisible && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <h3>Are you sure you want to delete your account</h3>
              <button onClick={handleDeleteUser}>Yes</button>
            </div>
          </div>
        )}

      <div className = "buffer"></div>

      <BottomBar />
    </div>
  );
};

export default Settings;