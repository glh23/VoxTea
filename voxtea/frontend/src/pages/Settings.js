import React, { useState, useEffect, useContext } from "react";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import axios from "axios";
import ThemeContext from "../components/themeContext";

const Settings = () => {
  const [profilePicture, setProfilePicture] = useState(null); 
  const [newImage, setNewImage] = useState(null);

  const { theme, toggleTheme } = useContext(ThemeContext);

// Get token from session storage
  const token = sessionStorage.getItem("authToken"); 

  console.log(token)

  useEffect(() => {
    // Fetch the current profile image
    axios.get("http://localhost:5000/api/users/getProfilePicture", {
        headers: { Authorization: token },
      })
      .then((res) => {
         // Default image if there isn't one
         console.log("profile picture:",res.data.profilePicture,"     profile picture path", res.data.profilePicturePath, "        data", res.data);
         setProfilePicture(res.data.profilePicture || "default.png");
      })
      .catch((err) => {
        console.error(err);
        console.log("Failed to load profile image.");
      });
  }, [token]);


  
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

  return (
    <div>
      <TopBar />
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
          <h2>{`Current Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}</h2>
          <button onClick={toggleTheme}>
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
      </div>

      </div>
      <BottomBar />
    </div>
  );
};

export default Settings;
