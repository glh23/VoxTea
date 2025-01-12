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
            <div>
                <PostView/>
            </div>
            <div>
                <button onClick={togglePostForm}>
                    {showPostForm ? "Cancel" : "Create Post"}
                </button>
                {showPostForm && <PostForm />}
            </div>
            <BottomBar />
        </div>
    );
};

export default Home;
