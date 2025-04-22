import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './sideBar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close the sidebar after navigation
  const handleNavigation = (path) => {
      navigate(path);
      setIsOpen(false); 
  };

  // Go away if the screen is too narrow
  const toggleSidebar = () => {
      setIsOpen(!isOpen);
  };

  return (
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
              ☰
          </button>
          <div className="sidebar-content">
              <button className="sidebar-button" onClick={() => handleNavigation('/Home')}>Home</button>
              <button className="sidebar-button" onClick={() => handleNavigation('/Account')}>Account</button>
              <button className="sidebar-button" onClick={() => handleNavigation('/Settings')}>Settings</button>
              <button className="sidebar-button" onClick={() => handleNavigation('/contacts')}>Chat</button>
              <button className="sidebar-button" onClick={() => handleNavigation('/UserSearch')}>Search</button>
              <button className="sidebar-button" onClick={() => handleNavigation('/Login')}>Logout</button>
              <button className="sidebar-button" onClick={() => handleNavigation('/tune')}>Logout</button>
          </div>
      </div>
  );
};

export default Sidebar;