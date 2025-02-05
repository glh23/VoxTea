import React from 'react';
import './TopBar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        console.log('User logged out');
        sessionStorage.removeItem('authToken');
        navigate('/Login');
    };

    const handleSettingsOrAccount = () => {
        if (location.pathname === '/Account') {
            console.log('Redirecting to Settings');
            navigate('/Settings');
        } else {
            console.log('Redirecting to Account');
            navigate('/Account');
        }
    };

    const handleAppName = () => {
        console.log('Open Home');
        navigate('/Home');
    };

    const handleSearch = () => {
        console.log('Redirecting to Search');
        navigate('/UserSearch');
    };

    const handleChat = () => {
        console.log('Redirecting to Search');
        navigate('/contacts');
    };

    return (
        <div className="top-bar">
            <button className="top-bar-button" onClick={handleSettingsOrAccount}>
                {location.pathname === '/Account' ? 'Settings' : 'Account'}
            </button>
            <button className="top-bar-button" onClick={handleChat}>Chat</button>
            <h1 className="app-name" onClick={handleAppName}>VoxTea</h1>
            <div className="top-bar-right">
                <button className="top-bar-button" onClick={handleSearch}>Search</button>
                <button className="top-bar-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default TopBar;