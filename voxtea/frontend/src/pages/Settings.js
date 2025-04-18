// import React, { useState, useEffect, useContext } from "react";
// import TopBar from "../components/TopBar";
// import BottomBar from "../components/BottomBar";
// import axios from "axios";
// import ThemeContext from "../components/themeContext";
// import { useNavigate } from 'react-router-dom';

// const Settings = () => {
//   const navigate = useNavigate();
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [newImage, setNewImage] = useState(null);

//   const [hashtags, setHashtags] = useState('');

//   // Change the delete popups visibility 
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);

//   // Change the username and password
//   const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
//   const [isChangeUsernameVisible, setIsChangeUsernameVisible] = useState(false);
//   const [changePasswordEmail, setChangePasswordEmail] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [changeUsernameEmail, setChangeUsernameEmail] = useState('');
//   const [newUsername, setNewUsername] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [usernameError, setUsernameError] = useState('');

//   const { theme, toggleTheme } = useContext(ThemeContext);
//   const [spotifyInfo, setSpotifyInfo] = useState('');

//   const [isTermsPopupVisible, setIsTermsPopupVisible] = useState(false);
//   const [termsText, setTermsText] = useState('');

//   // Get token from session storage
//   const token = sessionStorage.getItem("authToken");
//   const spotifyToken = localStorage.getItem("spotifyAccessToken")

//   useEffect(() => {
//     // Fetch the current profile image
//     axios.get("http://localhost:5000/api/users/getProfilePicture", {
//         headers: { Authorization: token },
//       })
//       .then((res) => {
//          // Default image if there isn't one
//          setProfilePicture(res.data.profilePicture || "default.png");
//       })
//       .catch((err) => {
//         console.error(err);
//         console.log("Failed to load profile image.");
//       });

//     // Fetch the user's hashtags
//     axios.get("http://localhost:5000/api/users/hashtags/get", {
//         headers: { Authorization: token },
//       })
//       .then((res) => {
//         setHashtags(res.data.hashtags.join(' '));
//       })
//       .catch((err) => {
//         console.error(err);
//         console.log("Failed to load hashtags.");
//       });

//     // Fetch the user's spotify data
//     axios.get('http://localhost:5000/api/spotify/userInfo', {
//       headers: {
//         Authorization: `Bearer ${spotifyToken}`,
//       },
//     })
//     .then((res) => {
//       console.log(res.data);
//       setSpotifyInfo(res.data);
//     })
//     .catch((err) => {
//       console.error(err);
//       console.log("Failed to load Spotify data.");
//     });
//   }, [token]);

//   // Profile picture update
//   const handleImageChange = (e) => {
//     setNewImage(e.target.files[0]);
//   };
//   const handleUpload = async () => {
//     if (!newImage) {
//       alert("Please select an image to upload.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("profilePicture", newImage);
//     try {
//       const res = await axios.post("http://localhost:5000/api/users/updateProfilePicture",
//         formData,
//         {
//           headers: {
//             Authorization: token,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       alert(res.data.message);
//       // Update the profile image in the UI
//       setProfilePicture(res.data.profilePicture);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to upload image.");
//     }
//   };

//   const handleHashtagsChange = (e) => {
//     setHashtags(e.target.value);
//   };
//   const handleHashtagsSave = async () => {
//     // Split the hashtags by spaces and filter out empty strings, then send request
//     const hashtagArray = hashtags.split(' ').filter(tag => tag.trim() !== '');
//     try {
//       const res = await axios.post("http://localhost:5000/api/users/hashtags/update",
//         { hashtags: hashtagArray },
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );
//       alert(res.data.message);
//     }
//     catch (err) {
//       console.error(err);
//       alert("Failed to save hashtags.");
//     }
//   };

//   const handleSpotify = async () => {
//     // Login to Spotify
//     try {
//       const response = await fetch("http://localhost:5000/api/spotify/login", {
//         method: "GET",
//       });
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const responseBody = await response.json();
//       const redirectURL = responseBody;

//       // Check if the redirect URL is valid before redirecting
//       if (redirectURL) {
//         window.location.href = redirectURL;
//       } else {
//         console.error("No redirect URL found.");
//         alert("Failed to connect to Spotify.");
//       }
//     } catch (err) {
//       console.error("Error connecting to Spotify:", err);
//       alert("Failed to connect to Spotify.");
//     }
//   };
//   const handleBack = () => {
//     navigate('/Home');
//   };

//   const handleDeleteUser = async () => {
//     try {
//       // Delete the user account then
//       axios.delete('http://localhost:5000/api/users/delete/user', {
//         headers: { Authorization: `Bearer ${token}`}
//       })
//       .then(response => console.log("User deleted:", response.data))
//       .catch(error => console.error("Failed to delete user:", error));

//       console.log("User information has been deleted successfully.");
//       // Remove the tokens from session and local storage
//       sessionStorage.removeItem("authToken");
//       localStorage.removeItem("spotifyAccessToken");
//       // Redirect to the login page
//       navigate("/login");
//       alert("Your account has been deleted.");
//     }
//     catch (error) {
//       console.error("Failed to delete user:", error);
//       alert("Failed to delete user.");
//     }
//   };

//   // Open and close the popup for hashtags
//   const handleOpenPopup = () => {
//     setIsPopupVisible(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupVisible(false);
//     setIsDeletePopupVisible(false);
//     setIsChangePasswordVisible(false);
//     setIsChangeUsernameVisible(false);
//     setIsTermsPopupVisible(false);
//     setPasswordError('');
//     setUsernameError('');
//   };

//   const handleDeleteUserPopup = () => {
//     setIsDeletePopupVisible(true);
//   };

//   const handleChangePasswordPopup = () => {
//     setIsChangePasswordVisible(true);
//   };

//   const handleChangeUsernamePopup = () => {
//     setIsChangeUsernameVisible(true);
//   };

//   const handleChangePassword = async () => {
//     if (newPassword !== confirmPassword) {
//       setPasswordError('Passwords do not match.');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/users/update/password', {
//         email: changePasswordEmail,
//         currentPassword,
//         newPassword
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       alert(response.data.message);
//       handleClosePopup();
//     } catch (err) {
//       // Check if the error response is there and set the error message if there is one
//       setPasswordError(err.response?.data?.message || 'Failed to change password.');
//     }
//   };

//   const handleChangeUsername = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/users/update/username', {
//         email: changeUsernameEmail,
//         newUsername
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       alert(response.data.message);
//       handleClosePopup();
//     } catch (err) {
//       // Check if the error response is there and set the error message if there is one
//       setUsernameError(err.response?.data?.message || 'Failed to change username.');
//     }
//   };

//   const handleOpenTermsPopup = async () => {
//     try {
//       const response = await fetch('/terms.txt'); // fetch from public folder
//       const text = await response.text();
//       setTermsText(text);
//       setIsTermsPopupVisible(true);
//     } catch (error) {
//       console.error("Failed to load terms and policies:", error);
//       alert("Could not load terms and policies.");
//     }
//   };

  


//   return (
//     <div>
//       <TopBar />
//       <img
//         src="/voxtea/turn-back.png"
//         alt="Previous Button"
//         className="button-icon"
//         onClick={handleBack}
//         style={{ position: 'absolute', top: '80px', left: '10px' }}
//       />
//       <div style={{ textAlign: "center", margin: "20px" }}>
//         <h1>Settings</h1>

//         <div className="setting">
//           <h2>Profile Picture</h2>
//           <img
//             className="profilePicture"
//             src={`http://localhost:5000/uploads/profilePictures/${profilePicture}`}
//             alt="Profile"
//             style={{ width: "150px", height: "150px" }}
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = "/user.png";
//             }}
//           />
//           <div>
//             <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
//             <button onClick={handleUpload}>Upload</button>
//           </div>
//         </div>

//         <div className="setting">
//           <h2>Hashtags</h2>
//           <input
//             type="text"
//             placeholder="Enter hashtags separated by spaces"
//             value={hashtags}
//             onChange={handleHashtagsChange}
//             style={{ width: "80%", marginBottom: "10px" }}
//           />
//           <button onClick={handleHashtagsSave}>Save Hashtags</button>
//           <button onClick={handleOpenPopup}>View Hashtags</button>
//         </div>

//         <div className="setting">
//           <h2>{`Current Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}</h2>
//           <button onClick={toggleTheme}>
//             Switch to {theme === "light" ? "Dark" : "Light"} Mode
//           </button>
//         </div>

//         <div className="setting">
//           <h2>Spotify</h2>
//           {spotifyInfo ? (
//             <p>Logged in as: {spotifyInfo.display_name}</p> 
//           ) : (
//             <p>Login to Spotify to improve what you see.</p> 
//           )}
//           <button onClick={handleSpotify}>
//             {spotifyInfo ? "Reconnect Spotify" : "Spotify Login"}  
//           </button>
//         </div>

//         <div className="setting">
//           <h2>Change Password</h2>
//           <button onClick={handleChangePasswordPopup}>Change Password</button>
//         </div>

//         <div className="setting">
//           <h2>Change Username</h2>
//           <button onClick={handleChangeUsernamePopup}>Change Username</button>
//         </div>

//         <div className="setting">
//           <h2>Terms & Policies</h2>
//           <button onClick={handleOpenTermsPopup}>View Terms</button>
//         </div>


//         <div className="setting">
//           <h2>Delete User</h2>
//           <p>This will delete your messages, chats, posts and information</p>
//           <button onClick={handleDeleteUserPopup}>Delete User</button>
//         </div>

//         {isPopupVisible && (
//           <div className="popup-overlay" onClick={handleClosePopup}>
//             <div className="popup-content" onClick={(e) => e.stopPropagation()}>
//               <h2>Your Hashtags</h2>
//               <ul>
//                 {hashtags.split(' ').map((tag, index) => (
//                   <li key={index}>{tag}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>

//       {isDeletePopupVisible && (
//           <div className="popup-overlay" onClick={handleClosePopup}>
//             <div className="popup-content" onClick={(e) => e.stopPropagation()}>
//               <h3>Are you sure you want to delete your account</h3>
//               <button onClick={handleDeleteUser}>Yes</button>
//             </div>
//           </div>
//         )}

//       {isChangePasswordVisible && (
//         <div className="popup-overlay" onClick={handleClosePopup}>
//           <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{textAlign: "center"}}>
//             <h2>Change Password</h2>
//             <input
//               style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
//               type="email"
//               placeholder="Enter your email"
//               value={changePasswordEmail}
//               onChange={(e) => setChangePasswordEmail(e.target.value)}
//             />
//             <input
//               style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
//               type="password"
//               placeholder="Current Password"
//               value={currentPassword}
//               onChange={(e) => setCurrentPassword(e.target.value)}
//             />
//             <input
//               style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
//               type="password"
//               placeholder="New Password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//             <input
//               style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
//               type="password"
//               placeholder="Confirm New Password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//             {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
//             <button onClick={handleChangePassword}>Change Password</button>
//             <button onClick={handleClosePopup}>Cancel</button>
//           </div>
//         </div>
//       )}

//       {isChangeUsernameVisible && (
//         <div className="popup-overlay" onClick={handleClosePopup}>
//           <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{textAlign: "center"}}>
//             <h2>Change Username</h2>
//             <input
//               style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
//               type="email"
//               placeholder="Enter your email"
//               value={changeUsernameEmail}
//               onChange={(e) => setChangeUsernameEmail(e.target.value)}
//             />
//             <input
//               style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
//               type="text"
//               placeholder="New Username"
//               value={newUsername}
//               onChange={(e) => setNewUsername(e.target.value)}
//             />
//             {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
//             <button onClick={handleChangeUsername}>Change Username</button>
//             <button onClick={handleClosePopup}>Cancel</button>
//           </div>
//         </div>
//       )}

//       {isTermsPopupVisible && (
//         <div className="popup-overlay" onClick={handleClosePopup}>
//           <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "70vh", overflowY: "auto" }}>
//             <h2>Terms & Policies</h2>
//             <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{termsText}</pre>
//             <button onClick={handleClosePopup}>Close</button>
//           </div>
//         </div>
//       )}

//       <div className = "buffer"></div>

//       <BottomBar />
//     </div>
//   );
// };

// export default Settings;




















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

  // Change the delete popups visibility 
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);

  // Change the username and password
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isChangeUsernameVisible, setIsChangeUsernameVisible] = useState(false);
  const [changePasswordEmail, setChangePasswordEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeUsernameEmail, setChangeUsernameEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const { theme, toggleTheme } = useContext(ThemeContext);
  const [spotifyInfo, setSpotifyInfo] = useState('');

  const [isTermsPopupVisible, setIsTermsPopupVisible] = useState(false);
  const [termsText, setTermsText] = useState('');

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

  const handleDeleteHashtag = async (tagToDelete) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/hashtags/delete", {
        hashtag: tagToDelete
      }, {
        headers: {
          Authorization: token
        }
      });
  
      alert(res.data.message);
  
      // Remove the tag from UI immediately
      setHashtags((prev) =>
        prev
          .split(' ')
          .filter((tag) => tag !== tagToDelete)
          .join(' ')
      );
    } catch (err) {
      console.error("Failed to delete hashtag:", err);
      alert("Could not delete hashtag.");
    }
  };
  

  const handleHashtagsChange = (e) => {
    setHashtags(e.target.value);
  };
  const handleHashtagsSave = async () => {
    // Split the hashtags by spaces and filter out empty strings, then send request
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
    // Login to Spotify
    try {
      const response = await fetch("http://localhost:5000/api/spotify/login", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseBody = await response.json();
      const redirectURL = responseBody;

      // Check if the redirect URL is valid before redirecting
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
      // Delete the user account then
      axios.delete('http://localhost:5000/api/users/delete/user', {
        headers: { Authorization: `Bearer ${token}`}
      })
      .then(response => console.log("User deleted:", response.data))
      .catch(error => console.error("Failed to delete user:", error));

      console.log("User information has been deleted successfully.");
      // Remove the tokens from session and local storage
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("spotifyAccessToken");
      // Redirect to the login page
      navigate("/login");
      alert("Your account has been deleted.");
    }
    catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user.");
    }
  };

  // Open and close the popup for hashtags
  const handleOpenPopup = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setIsDeletePopupVisible(false);
    setIsChangePasswordVisible(false);
    setIsChangeUsernameVisible(false);
    setIsTermsPopupVisible(false);
    setPasswordError('');
    setUsernameError('');
  };

  const handleDeleteUserPopup = () => {
    setIsDeletePopupVisible(true);
  };

  const handleChangePasswordPopup = () => {
    setIsChangePasswordVisible(true);
  };

  const handleChangeUsernamePopup = () => {
    setIsChangeUsernameVisible(true);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/update/password', {
        email: changePasswordEmail,
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert(response.data.message);
      handleClosePopup();
    } catch (err) {
      // Check if the error response is there and set the error message if there is one
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  const handleChangeUsername = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/update/username', {
        email: changeUsernameEmail,
        newUsername
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert(response.data.message);
      handleClosePopup();
    } catch (err) {
      // Check if the error response is there and set the error message if there is one
      setUsernameError(err.response?.data?.message || 'Failed to change username.');
    }
  };

  const handleOpenTermsPopup = async () => {
    try {
      const response = await fetch('/terms.txt'); // fetch from public folder
      const text = await response.text();
      setTermsText(text);
      setIsTermsPopupVisible(true);
    } catch (error) {
      console.error("Failed to load terms and policies:", error);
      alert("Could not load terms and policies.");
    }
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
            <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
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
            <p>Logged in as: {spotifyInfo.display_name}</p> 
          ) : (
            <p>Login to Spotify to improve what you see.</p> 
          )}
          <button onClick={handleSpotify}>
            {spotifyInfo ? "Reconnect Spotify" : "Spotify Login"}  
          </button>
        </div>

        <div className="setting">
          <h2>Change Password</h2>
          <button onClick={handleChangePasswordPopup}>Change Password</button>
        </div>

        <div className="setting">
          <h2>Change Username</h2>
          <button onClick={handleChangeUsernamePopup}>Change Username</button>
        </div>

        <div className="setting">
          <h2>Terms & Policies</h2>
          <button onClick={handleOpenTermsPopup}>View Terms</button>
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
                  <li
                    key={index}
                    onClick={() => handleDeleteHashtag(tag)}
                    style={{ cursor: 'pointer', color: 'red', borderRadius: '15px' }}
                    title="Click to remove"
                  >
                    {tag}
                  </li>
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

      {isChangePasswordVisible && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{textAlign: "center"}}>
            <h2>Change Password</h2>
            <input
              style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
              type="email"
              placeholder="Enter your email"
              value={changePasswordEmail}
              onChange={(e) => setChangePasswordEmail(e.target.value)}
            />
            <input
              style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            <button onClick={handleChangePassword}>Change Password</button>
            <button onClick={handleClosePopup}>Cancel</button>
          </div>
        </div>
      )}

      {isChangeUsernameVisible && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{textAlign: "center"}}>
            <h2>Change Username</h2>
            <input
              style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
              type="email"
              placeholder="Enter your email"
              value={changeUsernameEmail}
              onChange={(e) => setChangeUsernameEmail(e.target.value)}
            />
            <input
              style = {{ width: "80%", marginBottom: "10px",  padding: "5px"}}
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
            <button onClick={handleChangeUsername}>Change Username</button>
            <button onClick={handleClosePopup}>Cancel</button>
          </div>
        </div>
      )}

      {isTermsPopupVisible && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <h2>Terms & Policies</h2>
            <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{termsText}</pre>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}

      <div className = "buffer"></div>

      <BottomBar />
    </div>
  );
};

export default Settings;
