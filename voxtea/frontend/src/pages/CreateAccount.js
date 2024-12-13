import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState(null); // For profile image upload

    const navigate = useNavigate();

    const handleCreateAccount = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('username', username);
        if (profileImage) {
            formData.append('profileImage', profileImage); // Append image if provided
        }

        try {
            // Sending POST request to backend for account creation
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                // Account created successfully
                alert('Account created successfully!');

                 // Store token in sessionStorage
                sessionStorage.setItem('authToken', data.token);

                console.log('Login successful:', data);
                // Redirect user or update UI on successful login
                navigate('/Home');
            } 
            else {
                // Handle error (display message, etc.)
                const errorData = await response.json();
                alert(errorData.message || 'Error creating account');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating the account');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Create Account</h1>
            <form onSubmit={handleCreateAccount} style={{ display: 'inline-block', textAlign: 'left' }}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                </div>
                <div>
                    <label>Profile Image (optional):</label>
                    <input
                        type="file"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px' }}>Create Account</button>
            </form>
        </div>
    );
};

export default CreateAccount;

