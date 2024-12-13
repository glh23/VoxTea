import React, { useState } from 'react';
import axios from 'axios';

const PostForm = () => {
    const [description, setDescription] = useState('');
    const [audioFile, setAudioFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('description', description);
        formData.append('audioFile', audioFile);

        try {
            await axios.post('http://localhost:5000/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Post created!');
        } catch (error) {
            alert('Failed to create post');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="file"
                accept="audio/mp3"
                onChange={(e) => setAudioFile(e.target.files[0])}
            />
            <button type="submit">Post</button>
        </form>
    );
};

export default PostForm;
