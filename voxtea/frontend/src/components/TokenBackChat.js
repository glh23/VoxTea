import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NeverWithout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    async function GetTokenResponse() {
      try {
        // Retrieve the token from localStorage
        const authToken = sessionStorage.getItem('authToken');

        // If no token is found
        if (!authToken) {
          sessionStorage.removeItem('authToken');
          throw new Error("No token found, please log in.");
        }

        // Send request to the backend with the token in the headers
        const response = await fetch('http://localhost:5000/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`, 
            },
        });
        
        if (!response.ok) {
            sessionStorage.removeItem('authToken');
            throw new Error('Authentication failed');
        }
        
        const data = await response.json();
        console.log('Authenticated user:', data);
        

      } catch (err) {
        // Redirect to login if authentication fails
        console.error(err);
        navigate('/Login');
      }
    }

    GetTokenResponse();
  }, [navigate]);

  return children;
};

export default NeverWithout;