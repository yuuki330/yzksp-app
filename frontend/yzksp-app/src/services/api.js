import axios from 'axios';
import Cookies from 'js-cookie';

const ensureTrailingSlash = (url) => url.endsWith('/') ? url : `${url}/`;

const API_URL = ensureTrailingSlash(process.env.REACT_APP_API_URL || 'http://localhost:8000/api/');
console.log('API_URL:', API_URL);  // デバッグ用

const getCSRFToken = () => {
    return Cookies.get('csrftoken') || '';
};

axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
    config.headers['X-CSRFToken'] = getCSRFToken();
    console.log('Request URL:', config.url);  // デバッグ用
    return config;
});

const apiService = {
    getEvents: () => axios.get(`${API_URL}events/`),
    getEvent: (id) => axios.get(`${API_URL}events/${id}/`),
    createEvent: (data) => axios.post(`${API_URL}events/`, data),
    updateEvent: (id, data) => axios.put(`${API_URL}events/${id}/`, data),
    deleteEvent: (id) => axios.delete(`${API_URL}events/${id}/`),

    getParticipants: () => axios.get(`${API_URL}participants/`),
    getAttendances: () => axios.get(`${API_URL}attendances/`),
    getCurrentUser: () => axios.get(`${API_URL}current-user/`, { withCredentials: true }),
    createAttendance: (eventId, data) => axios.post(`${API_URL}events/${eventId}/attendances/`, data),
    getEventAttendances: (eventId) => axios.get(`${API_URL}events/${eventId}/attendances/`),
    login: (username, password) => axios.post(`${API_URL}login/`, 
        { username, password },
        {
          headers: { 
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
          },
          withCredentials: true
        }
      ),
    
      logout: () => axios.post(`${API_URL}logout/`, {}, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }),
    
      register: (username, email, password) => axios.post(`${API_URL}register/`, 
        { username, email, password },
        {
          headers: { 
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
          },
          withCredentials: true
        }
      ),
};

export default apiService;