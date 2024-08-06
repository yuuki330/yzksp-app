import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import AttendanceForm from './AttendanceForm';

const EventDetail = () => {
    const { id } = useParams();
    const { events, loading, error } = useAppContext();

    if (loading) return <div className="text-center py-4">読み込み中...</div>;
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

    const event = events.find(e => e.id === parseInt(id));

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