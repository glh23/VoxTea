import React from 'react';
import './TopBar.css';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
    const navigate = useNavigate();

  const handleLogout = () => {
    console.log('User logged out');
    sessionStorage.removeItem('authToken');
    navigate('/Login');
};

const handleSettings = () => {
    console.log('Open settings');
    navigate('/Settings');
  };

  const handleAppName = () => {
    console.log('Open Home');
    navigate('/Home');
  };

  return (
    <div className="top-bar">
      <button className="settings-button" onClick={handleSettings}>Settings</button>
      <h1 className="app-name" onClick={handleAppName}>VoxTea</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default TopBar;