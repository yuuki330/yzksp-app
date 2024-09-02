import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import EventForm from '../components/EventForm';

const UpdateEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { events, fetchEvents } = useAppContext();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const getEvent = async () => {
            if (events.length === 0) {
                fetchEvents();
            } 
            const foundEvent = events.find(e => e.id === parseInt(id));
            setEvent(foundEvent);
        };

        getEvent();
    }, [id, events, fetchEvents]);

    const handleSubmit = () => {
        navigate(`/events/${id}`);
    };

    if (!event) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">イベント更新</h1>
            <EventForm event={event} onSubmit={handleSubmit} />
        </div>
    );
};

export default UpdateEventPage;