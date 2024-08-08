import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getEvents();
            setEvents(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching evetns:', err);
            setError('イベントの取得に失敗しました。');
            setLoading(false);
        }
    };

    const addEvent = async (eventData) => {
        try {
            setError(null);
            const response = await apiService.createEvent(eventData);
            setEvents(prevEvents => [...events, response.data]);
            return response.data;
        } catch (err) {
            console.error('Error adding event:', err);
            setError('イベントの追加に失敗しました。');
            throw err;
        }
    };

    const updateAttendance = async (attendanceData) => {
        try {
            setError(null);
            const response = await apiService.createAttendance(attendanceData);
            setAttendances(prevAttendances => [...attendances, response.data]);
            return response.data;
        } catch (err) {
            console.error('Error updating attendance:', err);
            setError('出欠の更新に失敗しました');
            throw err;
        }
    };

    console.log('AppContext events:', events);
    console.log('AppContext attendances:', attendances);

    return (
        <AppContext.Provider
            value={{
                events,
                attendances,
                loading,
                error,
                fetchEvents,
                addEvent,
                updateAttendance,
                setError,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);