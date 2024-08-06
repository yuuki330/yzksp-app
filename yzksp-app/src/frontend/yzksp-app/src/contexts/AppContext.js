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
            const response = await apiService.getEvents();
            setEvents(response.data);
            setLoading(false);
        } catch (err) {
            setError('イベントの取得に失敗しました。');
            setLoading(false);
        }
    };

    const addEvent = async (eventData) => {
        try {
            const response = await apiService.createEvent(eventData);
            setEvents([...events, response.data]);
        } catch (err) {
            setError('イベントの追加に失敗しました。');
        }
    };

    const updateAttendance = async (attendanceData) => {
        try {
            const response = await apiService.createAttendance(attendanceData);
            setAttendances([...attendances, response.data]);
        } catch (err) {
            setError('出欠の更新に失敗しました');
        }
    };

    return (
        <AppContext.Provider
            value={{
                events,
                attendances,
                loading,
                error,
                fetchEvents,
                addEvent,
                updateAttendance
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);