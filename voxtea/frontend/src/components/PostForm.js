import React, { useState, useRef } from 'react';
import axios from 'axios';
import DragNdrop from './drag\'n\'drop';
import './PostForm.css';

const PostForm = () => {
    const [description, setDescription] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [selectedEffect, setSelectedEffect] = useState('');
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Handles file selection from DragNdrop
    const handleFileSelect = (file) => {
        setAudioFile(file);
    };

    // Start recording function
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                const audioFile = new File([audioBlob], 'recording.mp3', { type: 'audio/mp3' });
                setAudioFile(audioFile);
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    // Stop recording function
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    // Form submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('description', description);
        formData.append('audioFile', audioFile);
        formData.append('effect', selectedEffect);

        try {
            const token = sessionStorage.getItem('authToken');
            await axios.post('http://localhost:5000/api/posts/create', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            alert('Post created!');
        } catch (error) {
            alert('Failed to create post');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Description (include hashtags like #guitar)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* Drag & Drop Component */}
            <DragNdrop onFileSelect={handleFileSelect} />

            {/* Effects Selection */}
            <div className="dropdown">
                <button className="dropbtn">
                    Effects: {selectedEffect || 'None'}
                </button>
                <div className="dropdown-content">
                    {['Reverb', 'Telephone', 'Flanger', 'Distortion'].map(effect => (
                        <div key={effect} onClick={() => setSelectedEffect(effect)}>{effect}</div>
                    ))}
                </div>
            </div>

            {/* Recording Button */}
            <button type="button" onClick={recording ? stopRecording : startRecording}>
                {recording ? 'Stop Recording' : 'Record Voice'}
            </button>

            <button type="submit">Post</button>
        </form>
    );
};

export default PostForm;
