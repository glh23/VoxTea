import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';

const Contacts = () => {
  const [chats, setChats] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        const token = sessionStorage.getItem("authToken");

        try {
            if (!token) {
            console.error("No token found, unauthorized!");
            return;
            }

            const response = await fetch("http://localhost:5000/api/users/account/get", {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            console.log("data: ", data)

            setCurrentUserId(data._id);
            setChats(data.chats);
            setFollowing(data.following);
        } 
        catch (error) {
            console.error("Error fetching data:", error.response ? error.response.data : error.message);
        }
    };

    fetchData();
  }, []);

  const openFollowingList = () => {
    setShowFollowing(true);
  };

    const createChat = async (userId) => {
      try {
        const token = sessionStorage.getItem("authToken");

        const res = await axios.post(
          "http://localhost:5000/api/chat/create/start", 
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        console.log("Chat created:", res.data);
          setChats([...chats, res.data]);
          setShowFollowing(false);

          console.log("chats:", chats.participants.username)
        } 
        catch (err) {
            console.error("Error creating chat", err.response ? err.response.data : err.message);
        }
    };

    const handleNavigation = (chat) => {
      navigate(`/message/${chat}`);
    };

    const handleBack = () => {
      navigate('/Home');
  }

  return (
    <div>
       <TopBar />
       <img 
        src= "/voxtea/turn-back.png" 
        alt="Previous Button" 
        className="button-icon" 
        onClick={handleBack} 
        style={{position: 'absolute', top: '80px', left: '10px'}}
      />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Your Chats</h1>
        <button onClick={openFollowingList}>
          New Chat
        </button>

        <table style={{ margin: 'auto'}}>
          <tbody>
            {chats.map((chat) => (
              <tr key={chat._id}>
                <td>
                  <div onClick={() => handleNavigation(chat._id)}>
                    {chat.participants && chat.participants.length > 0 
                      ? chat.participants.map(p => p.username).join(", ") 
                      : "Unknown User"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showFollowing && (
          <div>
            <div>
              <h2>Select a User to Chat</h2>
              <ul>
                {following.length > 0 ? (
                  following.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => createChat(user._id)}
                    >
                      <img
                        className="profilePicture"
                        src={`http://localhost:5000/uploads/profilePictures/${user.profilePicture}`}
                        alt="Profile"
                        style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/user.png";
                        }}
                      />
                      <span>{user.username}</span>
                    </li>
                  ))
                ) : (
                  <p>You're not following anyone yet.</p>
                )}
              </ul>
              <button onClick={() => setShowFollowing(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomBar />
    </div>
  );
};


export default Contacts;


