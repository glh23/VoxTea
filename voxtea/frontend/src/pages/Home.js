import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import PostForm from '../components/PostForm';
import PostView from '../components/postView';
import SideBar from '../components/sideBar';

const Home = () => {
    const [showPostForm, setShowPostForm] = useState(false);
    const [refreshPostView, setRefreshPostView] = useState(false);

    const togglePostForm = () => {
        setShowPostForm(!showPostForm);
    };

    // Function to hide the post form after successful post creation
    const handlePostSuccess = () => {
        setShowPostForm(false);
        setRefreshPostView(prev => !prev);
    };

    return (
        <div>
            <TopBar />
            <div style={{ textAlign: "center", margin: "20px" }}>
            <SideBar />
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
                        <PostForm onPostSuccess={handlePostSuccess} />  
                    </div>
                </div>
            )}
            <BottomBar />
        </div>
    );
};

export default Home;
