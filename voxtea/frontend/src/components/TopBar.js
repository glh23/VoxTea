import React, { useState, useEffect, useRef } from 'react';
import './TopBar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        navigate('/Login');
    };

    const handleAccount = () => {
        navigate('/Account');
    };

    const handleSettings = () => {
        navigate('/Settings');
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
    const handleTune = () => {
        navigate('/tune');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Close if the user clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className="top-bar">
            <h1 className="app-name" onClick={handleAppName}>VoxTea</h1>
            <div className="hamburger" onClick={toggleMenu} ref={menuRef}>
                &#9776;
            </div>
            {menuOpen && (
                <div className="hamburger-dropdown" ref={menuRef}>
                    <button onClick={handleAppName}>Home</button>
                    <button onClick={handleAccount}>Account</button>
                    <button onClick={handleSettings}>Settings</button>
                    <button onClick={handleChat}>Chat</button>
                    <button onClick={handleSearch}>Search</button>
                    <button onClick={handleTune}>Tuner</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default TopBar;
