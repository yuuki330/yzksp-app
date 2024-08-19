import React, { useState, useEffect  } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from './Button';

const EventForm = ({ event, onSubmit }) => {
    const [name, setName] = useState(event ? event.name : '');
    const [date, setDate] = useState(event ? event.date.slice(0, 16) : '');
    const [description, setDescription] = useState(event ? event.description : '');
    const [error, setError] = useState(null);
    const { addEvent, updateEvent } = useAppContext();

    useEffect(() => {
        if (event) {
            setName(event.name);
            setDate(new Date(event.date).toISOString().slice(0, 16));
            setDescription(event.description);
        }
    }, [event]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const eventData = { name, date, description };
        console.log('Submitting event data:', eventData);  // デバッグ用ログ

        try {
            if (event) {
                await updateEvent(event.id, eventData);
            } else {
                await addEvent(eventData);
            }
            onSubmit();
        } catch (err) {
            console.error('Error saving event:', err.response?.data);
            setError('イベントの保存に失敗しました。');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">イベント名</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">日時</label>
                <input
                    type="datetime-local"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></input>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">説明</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="mt-1 block w-full ronded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></textarea>
            </div>
            <Button type="submit">{event ? '更新' : '作成'}</Button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default EventForm;