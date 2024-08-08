import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const apiService = {
    getEvents: () => axios.get(`${API_URL}events/`),
    getEvent: (id) => axios.get(`${API_URL}events/${id}/`),
    createEvent: (data) => axios.post(`${API_URL}events/`, data),
    updateEvent: (id, data) => axios.put(`${API_URL}events/${id}/`),
    deleteEvent: (id) => axios.delete(`${API_URL}events/${id}/`),

    getParticipants: () => axios.get(`${API_URL}participants/`),
    getAttendances: () => axios.get(`${API_URL}attendances/`),
    createAttendance: (data) => {
        console.log('API createAttendance called with:', data);
        return axios.post(`${API_URL}attendances/`, data);
    },
};

export default apiService