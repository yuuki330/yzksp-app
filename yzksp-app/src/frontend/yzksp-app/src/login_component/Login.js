// loging.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL;

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const csrfToken = Cookies.get('csrftoken');
            const response = await axios.post(`${API_URL}/login/`, 
                { username, password },
                {
                    headers: { 'X-CSRFToken': csrfToken },
                    withCredentials: true
                }
            );
            if (response.status === 200) {
                navigate('/');
            }
        } catch (error) {
            setMessage('Login failed');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginForm;