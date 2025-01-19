import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";

const Account = () => {
    const { userId } = useParams(); // Assume userId is passed in the URL (e.g., /account/:userId)
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/account/get/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setUser(data.username);
                    setPosts(data.posts);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching account data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
    }, [userId]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <img src= "/voxtea/VoxTea logo 1.png" style={{maxWidth: '30%', maxHeight: '30%'}}/>
            </div>
        );
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div>
            <TopBar />
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Welcome, {user}</h1>
                <h2>Your Posts</h2>
                {posts.length === 0 ? (
                    <p>You haven't posted anything yet.</p>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {posts.map(post => (
                            <li 
                                key={post._id} 
                                style={{ 
                                    margin: '20px 0', 
                                    border: '1px solid #ccc', 
                                    borderRadius: '10px', 
                                    padding: '10px' 
                                }}
                            >
                                <p><strong>Description:</strong> {post.description}</p>
                                <audio controls>
                                    <source src={`http://localhost:5000${post.audioFile}`} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </li>
                        ))}
                    </ul>
                )}
                <button onClick={() => navigate('/')}>Go Back</button>
            </div>
            <BottomBar/>
        </div>
    );
};

export default Account;
