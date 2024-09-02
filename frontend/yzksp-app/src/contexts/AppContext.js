import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching events...');
            const response = await apiService.getEvents();
            console.log('Events fetched:', response.data);
            setEvents(response.data);
        } catch (err) {
            console.error('Error fetching events:', err);
            if (err.response) {
                console.error('Error response:', err.response.data);
            } else if (err.request) {
                console.error('No response received:', err.request);
            } else {
                console.error('Error message:', err.message);
            }
            setError('イベントの取得に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    const addEvent = async (eventData) => {
        try {
            setError(null);
            console.log('Adding event with data:', eventData);
            const response = await apiService.createEvent(eventData);
            console.log('Add event response:', response.data);
            setEvents(prevEvents => [...prevEvents, response.data]);
            return response.data;
        } catch (err) {
            console.error('Error adding event:', err);
            if (err.response) {
                console.error('Error response:', err.response.data);
            }
            setError('イベントの追加に失敗しました。');
            throw err;
        }
    };

    const updateEvent = async (id, eventData) => {
        try {
            console.log('Updating event with id:', id, 'and data:', eventData);
            const { organizer, ...dataToSend } = eventData;
            const response = await apiService.updateEvent(id, dataToSend);
            console.log('Update response:', response.data);

            setEvents(prevEvents => prevEvents.map(event =>
                event.id === id ? response.data : event
            ));
            
            return response.data;
        } catch (err) {
            console.error('Error updating event:', err);
            if (err.response) {
                console.error('Error response:', err.response.data);
            }
            setError('イベントの更新に失敗しました。');
            throw err;
        }
    };

    const createAttendance = async (eventId, attendanceData) => {
        try {
            console.log('Creating attendance for event:', eventId, 'with data:', attendanceData);
            const response = await apiService.createAttendance(eventId, attendanceData);
            console.log('Attendance creation response:', response.data);
            return response.data;
        } catch (err) {
            console.error('Error creating attendance:', err);
            if (err.response) {
                console.error('Error response status:', err.response.status);
                console.error('Error response data:', err.response.data);
                throw new Error(err.response.data.detail || 'Failed to create attendance');
            } else if (err.request) {
                console.error('No response received:', err.request);
                throw new Error('No response received from server');
            } else {
                console.error('Error setting up request:', err.message);
                throw err;
            }
        }
    };

    const deleteEvent = async (id) => {
        try {
            setError(null);
            console.log('Deleting event with id:', id);
            await apiService.deleteEvent(id);
            console.log('Event deleted successfully');
            setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
        } catch (err) {
            console.error('Error deleting event:', err);
            if (err.response) {
                console.error('Error response:', err.response.data);
            }
            setError('イベントの削除に失敗しました。');
            throw err;
        }
    };

    return (
        <AppContext.Provider
            value={{
                events,
                loading,
                error,
                fetchEvents,
                addEvent,
                updateEvent,
                deleteEvent,
                createAttendance,
                setError,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);