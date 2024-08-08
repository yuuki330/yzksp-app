// src/login_component/useLogout.js
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const performLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/logout/');
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return performLogout;
};

export default useLogout;