import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import PostForm from '../components/PostForm';
import PostView from '../components/postView';

const Home = () => {
    const [showPostForm, setShowPostForm] = useState(false);

    const togglePostForm = () => {
        setShowPostForm(!showPostForm);
    };

    return (
        <div>
            <TopBar />
            <div style={{ textAlign: "center", margin: "20px" }}>
                <div>
                    <PostView />
                </div>
                <div>
                    <button onClick={togglePostForm}>
                        {showPostForm ? "Cancel" : "Create Post"}
                    </button>
                </div>
            </div>
            {showPostForm && (
                <div className="popup-overlay" onClick={togglePostForm}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={togglePostForm}>&times;</button>
                        <PostForm />
                    </div>
                </div>
            )}
            <BottomBar />
        </div>
    );
};

export default Home;