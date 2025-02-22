import './App.css';
import React, { Component } from 'react';
import { Routes, Route, Router } from 'react-router-dom';

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
import Profiles from './pages/otherAccounts';
import Contacts from './pages/contacts';
import Message from './pages/message';
import Callback from './components/callback'

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
            <Route path="/contacts" element={
                <TokenBackChat>
                    <Contacts />
                </TokenBackChat>
            } />
            <Route path="/message/:chatId" element={
                <TokenBackChat>
                    <Message/>
                </TokenBackChat>
            } />
             <Route path="/callback" element={
                <TokenBackChat>
                    <Callback/>
                </TokenBackChat>
            } />
        </Routes>
    </ThemeProvider>
);

export default App;


