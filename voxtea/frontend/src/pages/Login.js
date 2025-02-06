import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token in sessionStorage
            sessionStorage.setItem('authToken', data.token);

            console.log('Login successful:', data);
            // Redirect user or update UI on successful login
            navigate('/Home');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/');
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <img 
                src= "/voxtea/turn-back.png" 
                alt="Previous Button" 
                className="button-icon" 
                onClick={handleBack} 
                style={{position: 'absolute', top: '10px', left: '10px'}}
            />
            <h1>Login</h1>
            <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'center', maxWidth: '50ch' ,margin: 'auto'}}>
                {error && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {error}
                    </div>
                )}
                <div>
                    <div>
                        <label htmlFor="email">Email:</label>
                    </div>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{padding: '10px 20px', margin: '10px 0' }}
                    />
                </div>
                <div>
                    <div>
                        <label htmlFor="password">Password:</label>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{padding: '10px 20px',margin: '10px 0' }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: loading ? '#DB2F62' : '#DB2F62',
                        color: '#fff',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
