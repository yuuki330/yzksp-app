import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';

const CreateEventPage = () => {
    const navigate =useNavigate();

    const handleSubmit = () => {
        navigate('/events');
    };

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">新規イベント作成</h1>
            <EventForm onSubmit={handleSubmit} />
        </div>
    );
};

export default CreateEventPage;