import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useLogout from '../login_component/Logout';

const API_URL = process.env.REACT_APP_API_URL;

const getCsrfToken = () => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === 'csrftoken=') {
                cookieValue = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return cookieValue;
};

const MainView = () => {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        
        const fetchUsername = async () => {
            try {
                const csrfToken = getCsrfToken();
                const response = await axios.get(`${API_URL}/get-username/`, {
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                    withCredentials: true,
                });
                // if (response.data.username) {
                if (response.data) {
                    setUsername(response.data.username);
                    console.log("MainView:username", response.data.username)
                }
            } catch (error) {
                console.error('Error fetching the username:', error);
            }
        };

        fetchUsername();
    }, []);

    const handleLogout = useLogout();

    const handleButtonClick = async () => {
        console.log("API_URL", API_URL);
        try {
            const csrfToken = getCsrfToken();
            const response = await axios.post(`${API_URL}/main_view/`, {
                key1: 'value1',
                key2: 'value2',
            }, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true,
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div>
            {username ? (
                <h1>Welcome, {username}!</h1>
            ) : (
                <h1>Welcome, Guest!</h1>
            )}
            <button onClick={handleButtonClick}>Send Data</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default MainView;