import React, { useState } from 'react';
import axios from 'axios';
import './PostForm.css';

const PostForm = () => {
    const [description, setDescription] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [selectedEffect, setSelectedEffect] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('description', description);
        formData.append('audioFile', audioFile);
        formData.append('effect', selectedEffect);

        try {
            const token = sessionStorage.getItem('authToken');
            console.log(token);
            await axios.post('http://localhost:5000/api/posts/create', formData, {
                headers: { 
                    Authorization: token,
                    'Content-Type': 'multipart/form-data' },
            });
            alert('Post created!');
        } catch (error) {
            alert('Failed to create post');
        }
    };

    const handleEffectSelect = (effect) => {
        setSelectedEffect(effect);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="file"
                    accept="audio/mp3"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                />
            </div>
            <div className="dropdown">
                <button className="dropbtn">
                    Effects: {selectedEffect || 'None'}
                </button>
                <div className="dropdown-content">
                    <div onClick={() => handleEffectSelect('Reverb')}>Reverb</div>
                    <div onClick={() => handleEffectSelect('Echo')}>Echo</div>
                    <div onClick={() => handleEffectSelect('Flanger')}>Flanger</div>
                    <div onClick={() => handleEffectSelect('Distortion')}>Distortion</div>
                </div>
            </div>
            <button type="submit">Post</button>
        </form>
    );
};

export default PostForm;

