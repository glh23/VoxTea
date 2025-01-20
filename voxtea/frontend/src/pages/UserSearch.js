import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState(""); // User input
  const [users, setUsers] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  useEffect(() => {

    const fetchUsers = async () => {
      if (searchTerm.trim() === "") {
        setUsers([]); // Clear results if input is empty
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/search?query=${searchTerm}`
        );

        console.log(response);

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Error fetching users.");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    const debounceFetch = setTimeout(fetchUsers, 300); 
    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  const handleUserClick = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Search Users</h1>
      <input
        type="text"
        placeholder="Type a username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "80%",
          maxWidth: "400px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      />
      {loading && <p>Loading...</p>}
      <div style={{ marginTop: "20px" }}>
        {users.length === 0 && !loading && searchTerm && <p>No users found.</p>}
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user._id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={`http://localhost:5000/uploads/profilePictures/${user.profilePicture}`} 
              alt={user.username}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "/user.png";
              }}
            />
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
