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

    if (loading) return <div>読み込み中...</div>;
    if (error) return <div>{error}</div>;
    if (!error) return <div>イベントが見つかりません。</div>;

    return (
        <div>
            <h2>{event.name}</h2>
            <p>日時: {new Date(event.date).toLocaleString()}</p>
            <p>説明: {event.description}</p>
            <AttendanceForm eventId={event.id} />
        </div>
    );
};

export default EventDetail;