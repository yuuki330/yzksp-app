import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/api';
import AttendanceForm from './AttendanceForm';

const EventDetail = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await apiService.getEvent(id);
                setEvent(response.data);
                setLoading(false);
            } catch (err) {
                setError('イベントの取得に失敗しました。');
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) return <div className="text-center py-4">読み込み中...</div>;
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
    if (!error) return <div className="text-center py-4">イベントが見つかりません。</div>;

    return (
        <div className="bg-white shadow-md rouded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
            <p className="text-gray-600 mb-2">日時: {new Date(event.date).toLocaleString()}</p>
            <p className="text-gray-700 mb-4">説明: {event.description}</p>
            <AttendanceForm eventId={event.id} />
        </div>
    );
};

export default EventDetail;