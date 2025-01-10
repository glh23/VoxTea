import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null); // For profile image upload

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
        // If there is a image append it as well
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        console.log(formData);

        try {
            // Sending POST request to backend
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
                // display error / message from server
                alert(data.message || 'Error creating account');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error creating account');
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
                        accept="image/png, image/jpeg"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px' }}>Create Account</button>
            </form>
        </div>
    );
};

export default CreateAccount;

