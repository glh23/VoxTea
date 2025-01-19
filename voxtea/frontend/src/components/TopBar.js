import React from 'react';
import './TopBar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    const handleLogout = () => {
        console.log('User logged out');
        sessionStorage.removeItem('authToken');
        navigate('/Login');
    };

    const handleSettingsOrAccount = () => {
        // If the user is on the "Account" page, navigate to "Settings", otherwise navigate to "Account"
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

    return (
        <div className="top-bar">
            <button className="top-bar-button" onClick={handleSettingsOrAccount}>
                {location.pathname === '/Account' ? 'Settings' : 'Account'}
            </button>
            <h1 className="app-name" onClick={handleAppName}>VoxTea</h1>
            <button className="top-bar-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default TopBar;
