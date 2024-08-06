import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await apiService.getEvents();
                setEvents(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('イベントの取得中にエラーが発生しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <div>読み込み中...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>イベント一覧</h2>
            {events.length === 0 ? (
                <p>イベントがありません。</p>
            ) : (
                <ul>
                    {events.map((event) => (
                        <li key={event.id}>{event.name} - {new Date(event.date).toLocaleDateString()}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EventList;