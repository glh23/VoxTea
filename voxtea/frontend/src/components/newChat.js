import React from 'react';
import './newChat.css';

const NewChatPopup = ({ following, createChat, closePopup }) => {
    return (
        <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h2>Select a User to Chat</h2>
                <ul>
                    {following.length > 0 ? (
                        following.map((user) => (
                            <li key={user._id} onClick={() => createChat(user._id)}>
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
            </div>
        </div>
    );
};

export default NewChatPopup;
