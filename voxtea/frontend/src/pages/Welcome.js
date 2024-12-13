import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to VoxTea</h1>
            <p>Share and explore MP3 posts with others!</p>
            <button onClick={() => navigate('/login')} style={{ margin: '10px', padding: '10px 20px' }}>Login</button>
            <button onClick={() => navigate('/create-account')} style={{ margin: '10px', padding: '10px 20px' }}>Create Account</button>
        </div>
    );
};

export default Welcome;
