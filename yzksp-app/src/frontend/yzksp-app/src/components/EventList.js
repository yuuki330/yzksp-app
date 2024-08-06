import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiService.getEvents();
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                setError('イベントの取得中にエラーが発生しました。');
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <div className="text-center py-4">読み込み中...</div>;
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

    return (
        <div className='container mx-auto px-4'>
            <h2 className="text-2xl font-bold mb-4">イベント一覧</h2>
            <ul className="space-y-4">
                {events.map((event) => (
                    <li key={event.id} className="bg-white shadow rounded-lg p-4">
                        <Link to={`/events/${event.id}`} className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                            {event.name}
                        </Link>
                        <p className="text-gray-600">日時: {new Date(event.date).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
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