import React, { useState } from 'react';
import './forgor.css'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/users/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset email');
            }

            setMessage('Reset email sent successfully');
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    };

    return (
        <div>
            <div className="forgot-password-text" onClick={() => setShowModal(true)}>
                Forgot Password?
            </div>
            {showModal && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setShowModal(false)}>
                            &times;
                        </button>
                        <h2>Forgot Password</h2>
                        <form onSubmit={handleSubmit}>
                            {message && (
                                <div style={{ color: message.includes('successfully') ? 'green' : 'red', marginBottom: '10px' }}>
                                    {message}
                                </div>
                            )}
                            <div>
                                <label htmlFor="forgotEmail">Email:</label>
                                <input
                                    id="forgotEmail"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Email'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
