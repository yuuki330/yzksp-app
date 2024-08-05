import React from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const MainView = () => {
    const handleButtonClick = async () => {
        console.log("API_URL", API_URL);
        try {
            const response = await axios.post(`http://localhost:8000/main_view/`, {
            key1: 'value1',
            key2: 'value2',
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error posting data:', error);
        }
        };
    
    return (
    <div>
        <h1>Welcome</h1>
        <button onClick={handleButtonClick}>Send Data</button>
    </div>
    );
};

export default MainView;