import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import socket from "../socket";

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    console.log('token front message');
    axios.get(`http://localhost:5000/api/chat/get/${chatId}`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    })
    .then((res) => {
      setMessages(res.data);
      console.log("chat data: ", res.data);
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
    const messageData = { chatId, text: newMessage, sender: "User" };

    // Web_socket
    socket.emit("send_message", messageData);

    await axios.post('http://localhost:5000/api/chat/send', {
      chatId: chatId,
      message: newMessage
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log("New Message: ", response.data);
      setNewMessage(""); // Clear input after sending
    })
    .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.sender}: {msg.text}</p>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;