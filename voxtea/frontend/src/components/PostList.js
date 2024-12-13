import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/posts')
            .then((response) => setPosts(response.data))
            .catch(() => alert('Failed to fetch posts'));
    }, []);

    return (
        <div>
            {posts.map((post) => (
                <div key={post._id}>
                    <p>{post.description}</p>
                    <audio controls src={`http://localhost:5000/${post.audioFile}`} />
                </div>
            ))}
        </div>
    );
};

export default PostList;
