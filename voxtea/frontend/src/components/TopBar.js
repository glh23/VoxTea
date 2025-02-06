import React, { useState } from 'react';
import './TopBar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        navigate('/Login');
    };

    const handleSettingsOrAccount = () => {
        navigate(location.pathname === '/Account' ? '/Settings' : '/Account');
    };

    const handleAppName = () => {
        navigate('/Home');
    };

    const handleSearch = () => {
        navigate('/UserSearch');
    };

    const handleChat = () => {
        navigate('/contacts');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="top-bar">
            {/* Left side buttons */}
            <div className="top-bar-left">
                <button className="top-bar-button" onClick={handleSettingsOrAccount}>
                    {location.pathname === '/Account' ? 'Settings' : 'Account'}
                </button>
                <button className="top-bar-button" onClick={handleChat}>Chat</button>
            </div>

            {/* Center Logo */}
            <h1 className="app-name" onClick={handleAppName}>VoxTea</h1>

            {/* Right side buttons */}
            <div className="top-bar-right">
                <button className="top-bar-button" onClick={handleSearch}>Search</button>
                <button className="top-bar-button" onClick={handleLogout}>Logout</button>
            </div>

            {/* Hamburger Menu for Mobile */}
            <div className="hamburger" onClick={toggleMenu}>
                &#9776; {/* Hamburger icon */}
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu">
                    <button onClick={handleSettingsOrAccount}>
                        {location.pathname === '/Account' ? 'Settings' : 'Account'}
                    </button>
                    <button onClick={handleChat}>Chat</button>
                    <button onClick={handleSearch}>Search</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default TopBar;