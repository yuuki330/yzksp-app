import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import AttendanceForm from './AttendanceForm';
import Button from '../components/Button';

const EventDetail = () => {
    const { id } = useParams();
    const { events, loading, error } = useAppContext();
    

    if (loading) return <div className="text-center py-4">読み込み中...</div>;
    if (error) return <div className="text-center py-4 text-secondary">{error}</div>;

    const event = events.find(e => e.id === parseInt(id));

    if (!event) return <div className="text-center py-4">イベントが見つかりません。</div>;

    return (
        <div className="bg-white shadow-md rouded-lg p-6 overflow-hidden">
            <div className='p-6 md:p-8 lg:p-10'>
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">{event.name}</h2>
                <div className='md:flex md:justify-between md:items-start'>
                    <div className="mb-6 md:mb-0 md:w-2/3">
                        <p className="text-gray-600 mb-2">日時: {new Date(event.date).toLocaleString()}</p>
                        <p className="text-gray-700">説明: {event.description}</p>
                    </div>
                    <div className='md:w-1/3 md:ml-8'>
                        <AttendanceForm eventId={event.id} />
                    </div>
                </div>
                <div className="mt-8">
                    <Button variant='secondary' onClick={() => window.history.back()}>戻る</Button>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;