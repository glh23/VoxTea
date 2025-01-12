import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
    const [post, setPost] = useState([]);

    const fetchRecentPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/posts/get');
            console.log(response.data.posts); 
        } catch (error) {
            console.error('Failed to fetch recent posts', error);
        }
    };
    

    useEffect(() => {
        // To only show one post at a time i am going to alloow the use to use buttons to go to the next post and back
        var postInView = 0;
        postInLast28Days = fetchRecentPosts();
        setPost(postInView);
    }, []);

    return (
        <div>
            
        </div>
    );
};

export default PostList;
