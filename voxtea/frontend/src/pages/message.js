import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]); 
  const [newMessage, setNewMessage] = useState("");
  const token = sessionStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/chat/get/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setMessages(res.data.messages);
      setParticipants(res.data.participants);
      console.log("Chat data:", res.data);
    })
    .catch((err) => console.error(err));

    socket.emit("join_chat", chatId);
    
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const senderInfo = participants.find(p => p._id === "USER_ID"); 

    const messageData = { 
      chatId, 
      text: newMessage, 
      sender: senderInfo || { username: "Unknown", profilePicture: "" }
    };

    socket.emit("send_message", messageData);

    await axios.post("http://localhost:5000/api/chat/send", {
      chatId: chatId,
      message: newMessage
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log("New Message:", response.data);
      setNewMessage("");
    })
    .catch(error => console.error(error));
  };

  const handleBack = () => {
    navigate("/contacts");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBar />

      <img 
        src="/voxtea/turn-back.png" 
        alt="Previous Button" 
        className="button-icon" 
        onClick={handleBack} 
        style={{ position: 'absolute', top: '80px', left: '10px' }}
      />

      {/* Chat messages - scrollable */}
      <div style={{
        flex: 1, 
        overflowY: "auto",
        padding: "10px",
        maxWidth: "75%",
        maxHeight: "90vh",
        alignSelf: "center",
        paddingBottom: "100px"
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            {/* Profile Picture */}
            <img
              className="profilePicture"
              src={`http://localhost:5000/uploads/profilePictures/${msg.sender?.profilePicture}`}
              alt="Profile"
              style={{ width: "20px", height: "20px", borderRadius: "50%", marginRight: "5px" }}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "/user.png";
              }}
            />

            {/* Message Text */}
            <p style={{ margin: 0 }}>
              <strong>{msg.sender?.username || "Unknown User"}:</strong> {msg.text}
            </p>
          </div>
        ))}

      </div>

      {/* Message input - stays above BottomBar */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        bottom: "45px", 
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        padding: "10px",
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{
            flex: 1,
            maxWidth: "500px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #2f4286",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)"
          }}
        />
        <button onClick={sendMessage} style={{
          marginLeft: "10px",
          padding: "10px 15px"
        }}>
          Send
        </button>
      </div>

      <BottomBar />
    </div>
  );
};

export default Chat;
