// Logout.js

// export const handleLogout = async (setUsername, navigate) => {
//     const csrfToken = Cookies.get('csrftoken');  // CSRFトークンを取得
//     console.log("csrfToken", csrfToken);

//     try {
//         const response = await axios.post(`${API_URL}/logout/`, {}, {
//             headers: {
//                 'X-CSRFToken': csrfToken,  // CSRFトークンをヘッダーに設定
//                 'Content-Type': 'application/json'
//             },
//             withCredentials: true  // クッキーを含める
//         });
//         console.log('Response:', response.data);
//         setUsername(null);
//         navigate('/login');  // ログイン画面にリダイレクト
//     } catch (error) {
//         console.error('Error logging out:', error);
//     }
// };

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL;

const LogoutComponent = ({ setUsername }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const csrfToken = Cookies.get('csrftoken');

        try {
            const response = await axios.post(`${API_URL}/logout/`, {}, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            setUsername(null);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutComponent;