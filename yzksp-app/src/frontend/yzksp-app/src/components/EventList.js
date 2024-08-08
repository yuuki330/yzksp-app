import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';

const EventList = () => {
    const { events, loading, error } = useAppContext();

    if (loading) return <div className="text-center py-4">読み込み中...</div>;
    if (error) return <div className="text-center py-4 text-secondary">{error}</div>;

    return (
        <div>
            <h2 className="text-3xl font-heading font-bold mb-6">イベント一覧</h2>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {events.map((event) => (
                    <div key={event.id} className='bg-white shadow-md rounded-lg overflow-hidden'>
                        <div className='p-6'>
                            <h3 className='text-xl font-bold mb-2'>{event.name}</h3>
                            <p className="text-gray-600 mb-4">日時: {new Date(event.date).toLocaleString()}</p>
                            <Link to={`/events/${event.id}`}>
                                <Button variant='outline' size='small'>詳細を見る</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventList;