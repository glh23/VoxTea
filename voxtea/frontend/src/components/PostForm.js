// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import DragNdrop from './drag\'n\'drop';
// import './PostForm.css';

// const PostForm = ({ onPostSuccess }) => {
//     const [description, setDescription] = useState('');
//     const [audioFile, setAudioFile] = useState(null);
//     const [selectedEffect, setSelectedEffect] = useState('');
//     const [recording, setRecording] = useState(false);
//     const [isClicked, setIsClicked] = useState(false);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const mediaRecorderRef = useRef(null);
//     const audioChunksRef = useRef([]);

//     // Handles file selection from DragNdrop
//     const handleFileSelect = (file) => {
//         setAudioFile(file);
//     };

//     // Start recording function
//     const startRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             const mediaRecorder = new MediaRecorder(stream);
//             mediaRecorderRef.current = mediaRecorder;
//             audioChunksRef.current = [];

//             mediaRecorder.ondataavailable = (event) => {
//                 audioChunksRef.current.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
//                 const audioFile = new File([audioBlob], 'recording.mp3', { type: 'audio/mp3' });
//                 setAudioFile(audioFile);
//             };

//             mediaRecorder.start();
//             setRecording(true);
//         } catch (error) {
//             console.error('Error accessing microphone:', error);
//         }
//     };

//     // Stop recording function
//     const stopRecording = () => {
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//             setRecording(false);
//         }
//     };

//     // Form submit function
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('description', description);
//         formData.append('audioFile', audioFile);
//         formData.append('effect', selectedEffect);

//         try {
//             const token = sessionStorage.getItem('authToken');
//             await axios.post('http://localhost:5000/api/posts/create', formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data'
//                 },
//             });
//             onPostSuccess();
//         } catch (error) {
//             alert('Failed to create post');
//         }
//     };

//     // Carousel navigation functions
//     const nextSlide = () => {
//         setCurrentSlide((prevSlide) => (prevSlide + 1) % 4);
//     };

//     const prevSlide = () => {
//         setCurrentSlide((prevSlide) => (prevSlide - 1 + 4) % 4);
//     };

//     useEffect(() => {
//         const interval = setInterval(() => {
//             nextSlide();
//         }, 60000); // Auto-slide every 60 seconds
//         return () => clearInterval(interval);
//     }, [currentSlide]);

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <input
//                     type="text"
//                     placeholder="Description (include hashtags like #guitar)"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                 />
//             </div>

//             {/* Drag'n'Drop Component */}
//             <DragNdrop onFileSelect={handleFileSelect} />

//             {/* Effects Carousel */}
//             <div className="carousel-container">
//                 <div
//                     className="carousel-slide-group"
//                     style={{ transform: `translateX(-${currentSlide * 11}ch)` }}
//                 >
//                     {['No Effect', 'Reverb', 'Telephone', 'Flanger', 'Distortion',  'Chorus', 'Pitch', 'Bass', 'Treble' , 'Echo'].map((effect, index) => (
//                         <div
//                             key={effect}
//                             className={`carousel-slide ${currentSlide === index ? 'active-slide' : ''}`}
//                             onClick={() => setSelectedEffect(effect)}
//                         >
//                             <p className="carousel-text">{effect}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <div className="carousel-controls">
//                 <button type="button" className="carousel-button prev" onClick={prevSlide}>←</button>
//                 <button type="button" className="carousel-button next" onClick={nextSlide}>→</button>
//             </div>
//             {/* Record Button */}
//             <img
//                 src={"/voxtea/microphone.png"}
//                 alt={"Record"}
//                 className={`record-button ${recording ? 'recording' : ''} ${isClicked ? 'bounce' : ''}`}
//                 onClick={() => {
//                     setIsClicked(true);
//                     setTimeout(() => setIsClicked(false), 6000);
//                     recording ? stopRecording() : startRecording();
//                 }}
//                 style={{ cursor: 'pointer' }}
//             />

//             {/* Submit Button */}
//             <img
//                 src="/voxtea/submit.png"
//                 alt="Submit"
//                 className="submit-button"
//                 onClick={handleSubmit}
//                 style={{ cursor: 'pointer' }}
//             />
//         </form>
//     );
// };

// export default PostForm;



import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DragNdrop from './drag\'n\'drop';
import './PostForm.css';

const PostForm = ({ onPostSuccess }) => {
    const [description, setDescription] = useState('');
    const [audioFile, setAudioFile] = useState(null);
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
                setAudioFile(audioFile);  // Set the raw audio file directly without conversion
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

        if (!audioFile) {
            alert('Please upload or record an audio file!');
            return;
        }

        const formData = new FormData();
        formData.append('description', description);
        formData.append('audioFile', audioFile);  // Send the raw audio file without conversion
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
            alert('Failed to create post');
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

