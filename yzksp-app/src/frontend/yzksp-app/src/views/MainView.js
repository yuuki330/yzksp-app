// MainView.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import LogoutComponent from '../login_component/Logout';  // LogoutComponentをインポート

const API_URL = process.env.REACT_APP_API_URL;

const MainView = () => {
    const [username, setUsername] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            const csrfToken = Cookies.get('csrftoken');
            try {
                const response = await axios.post(`${API_URL}/get-username/`, {}, {
                    headers: { 'X-CSRFToken': csrfToken },
                    withCredentials: true
                });
                setUsername(response.data.username);
            } catch (error) {
                setMessage('User not logged in');
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();
    }, []);

    const fetchUsername2 = async () => {
        const csrfToken = Cookies.get('csrftoken');
        try {
            const response = await axios.post(`${API_URL}/get-username/`, {}, {
                headers: { 'X-CSRFToken': csrfToken },
                withCredentials: true
            });
            setUsername(response.data.username);
        } catch (error) {
            setMessage('User not logged in');
            console.error('Error fetching username:', error);
        }
    };

    return (
        <div>
            {username ? (
                <>
                    <h1>Welcome, {username}!</h1>
                    <LogoutComponent setUsername={setUsername} />
                </>
            ) : (
                <h1>Welcome, Guest!</h1>
            )}
            <button onClick={fetchUsername2}>Fetch Username</button> {/* ボタンを追加 */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default MainView;
