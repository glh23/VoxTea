import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Theme
import { ThemeProvider } from "./components/themeContext";

// Security 
import TokenBackChat from './components/TokenBackChat';

// Routes
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Account from './pages/Account';
import UserSearch from './pages/UserSearch';
import Profiles from './pages/otherAccounts'

const App = () => (
    <ThemeProvider>
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />

            <Route path="/Home" element={
                <TokenBackChat>
                    <Home />
                </TokenBackChat>
            } />
            <Route path="/Settings" element={
                <TokenBackChat>
                    <Settings />
                </TokenBackChat>
            } />
            <Route path="/Account" element={
                <TokenBackChat>
                    <Account />
                </TokenBackChat>
            } />
            <Route path="/UserSearch" element={
                <TokenBackChat>
                    <UserSearch />
                </TokenBackChat>
            } />
            <Route path="/profile/:id" element={
                <TokenBackChat>
                    <Profiles />
                </TokenBackChat>
            } />

        </Routes>
    </ThemeProvider>
);

export default App;


