import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DragNdrop from './dragNdrop';
import AudioPlayer from './myAudioPlayer'; // Import AudioPlayer
import './PostForm.css';

const PostForm = ({ onPostSuccess }) => {
    const [description, setDescription] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // State to hold the file to be previewed
    const [recording, setRecording] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const effectList = ['No Effect', 'Reverb', 'Telephone', 'Flanger', 'Distortion', 'Chorus', 'Pitch', 'Bass', 'Treble', 'Echo'];
    const totalSlides = effectList.length;

    // Handles file selection from DragNdrop
    const handleFileSelect = (file) => {
        setAudioFile(file);
        setSelectedFile(file); // Set the selected file for preview
    };

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
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
                setAudioFile(audioFile);
                setSelectedFile(audioFile); // Set the selected file for preview
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

        // Check that description and audio file are there
        if (!description) {
            alert('Please write a description!');
            return;
        }
        if (!audioFile) {
            alert('Please upload or record an audio file!');
            return;
        }

        const formData = new FormData();
        formData.append('description', description);
        formData.append('audioFile', audioFile);
        formData.append('effect', effectList[currentSlide]);

        try {
            const token = sessionStorage.getItem('authToken');
            await axios.post('http://localhost:5000/api/posts/create', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            onPostSuccess();
        } catch (error) {
            alert('Failed to create post:', error);
        }
    };

    // Auto-slide every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
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

            {/* Drag'n'Drop Component */}
            <DragNdrop onFileSelect={handleFileSelect} />

            {/* Audio Player for preview */}
            {selectedFile && selectedFile.type.startsWith('audio') && (
                <AudioPlayer
                    audioSrc={URL.createObjectURL(selectedFile)}
                    onPlayNext={() => console.log('Next track')}
                    onPlayPrevious={() => console.log('Previous track')}
                    isLiked={false}
                    onLikeToggle={() => console.log('Like toggled')}
                />
            )}

            {/* Effects Carousel */}
            <div className="carousel-container">
                <div
                    className="carousel-slide-group"
                    style={{ transform: `translateX(-${currentSlide * 11}ch)` }}
                >
                    {effectList.map((effect, index) => (
                        <div
                            key={effect}
                            className={`carousel-slide ${currentSlide === index ? 'active-slide' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        >
                            <p className="carousel-text">{effect}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="carousel-controls">
                <button type="button" className="carousel-button prev" onClick={prevSlide}>←</button>
                <button type="button" className="carousel-button next" onClick={nextSlide}>→</button>
            </div>

            {/* Record Button */}
            <img
                src="/voxtea/microphone.png"
                alt="Record"
                data-testid="record-button" 
                className={`record-button ${recording ? 'recording' : ''} ${isClicked ? 'bounce' : ''}`}
                onClick={() => {
                    setIsClicked(true);
                    setTimeout(() => setIsClicked(false), 300);
                    recording ? stopRecording() : startRecording();
                }}
                style={{ cursor: 'pointer' }}
            />

            {/* Submit Button */}
            <img
                src="/voxtea/submit.png"
                alt="Submit"
                className="submit-button"
                onClick={handleSubmit}
                style={{ cursor: 'pointer' }}
            />
        </form>
    );
};

export default PostForm;
