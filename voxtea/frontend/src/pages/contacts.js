// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import TopBar from '../components/TopBar';
// import BottomBar from '../components/BottomBar';
// import NewChatPopup from '../components/newChat';


// const Contacts = () => {
//   const [chats, setChats] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [showFollowing, setShowFollowing] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//         const token = sessionStorage.getItem("authToken");

//         try {
//             if (!token) {
//                 console.error("No token found, unauthorized!");
//                 return;
//             }

//             const response = await fetch("http://localhost:5000/api/users/account/get", {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             const data = await response.json();

//             console.log("data: ", data);

//             setCurrentUserId(data._id);
//             setChats(data.chats);
//             setFollowing(data.following);
//         } catch (error) {
//             console.error("Error fetching data:", error.response ? error.response.data : error.message);
//         }
//     };

//     fetchData();
//   }, []);

//   const openFollowingList = () => {
//     setShowFollowing(true);
//   };

//   const createChat = async (userId) => {
//     try {
//         const token = sessionStorage.getItem("authToken");

//         const res = await axios.post(
//             "http://localhost:5000/api/chat/create/start",
//             { userId },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 }
//             }
//         );
//         console.log("Chat created:", res.data);
//         setChats([...chats, res.data]);
//         setShowFollowing(false);

//         console.log("chats:", chats.participants.username);
//     } catch (err) {
//         console.error("Error creating chat", err.response ? err.response.data : err.message);
//     }
//   };

//   const handleNavigation = (chat) => {
//     navigate(`/message/${chat}`);
//   };

//   const handleBack = () => {
//     navigate('/Home');
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
//       <div style={{ textAlign: 'center', marginTop: '50px' }}>
//         <h1>Your Chats</h1>
//         <button onClick={openFollowingList}>
//           New Chat
//         </button>

//         <table style={{ margin: 'auto' }}>
//           <tbody>
//             {chats.map((chat) => (
//               <tr key={chat._id}>
//                 <td>
//                   <div onClick={() => handleNavigation(chat._id)}>
//                     {chat.participants && chat.participants.length > 0
//                       ? chat.participants.map(p => p.username).join(", ")
//                       : "Unknown User"}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {showFollowing && (
//           <NewChatPopup
//             following={following}
//             createChat={createChat}
//             closePopup={() => setShowFollowing(false)}
//           />
//         )}
//       </div>
//       <BottomBar />
//     </div>
//   );
// };

// export default Contacts;


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import NewChatPopup from '../components/newChat';


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

            console.log("data: ", data);

            setCurrentUserId(data._id);
            setChats(data.chats);
            setFollowing(data.following);
        } catch (error) {
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

        console.log("chats:", chats.participants.username);
    } catch (err) {
        console.error("Error creating chat", err.response ? err.response.data : err.message);
    }
  };

  const handleNavigation = (chat) => {
    navigate(`/message/${chat}`);
  };

  const handleBack = () => {
    navigate('/Home');
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
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Your Chats</h1>
        <button onClick={openFollowingList}>
          New Chat
        </button>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '15px', 
          marginTop: '30px' 
        }}>
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleNavigation(chat._id)}
              style={{
                color: '#fff',
                backgroundColor: '#1d2954',
                padding: '15px 20px',
                borderRadius: '10px',
                width: '300px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <strong>
                {chat.participants && chat.participants.length > 0
                  ? chat.participants.map(p => p.username).join(", ")
                  : "Unknown User"}
              </strong>
            </div>
          ))}
        </div>


        {showFollowing && (
          <NewChatPopup
            following={following}
            createChat={createChat}
            closePopup={() => setShowFollowing(false)}
          />
        )}
      </div>
      <BottomBar />
    </div>
  );
};

export default Contacts;
