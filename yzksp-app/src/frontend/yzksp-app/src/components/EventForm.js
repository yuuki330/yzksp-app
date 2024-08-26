import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from './Button';

const EventForm = ({ event, onSubmit }) => {
    const [name, setName] = useState(event ? event.name : '');
    const [date, setDate] = useState(event ? event.date.slice(0, 16) : '');
    const [description, setDescription] = useState(event ? event.description : '');
    const [errors, setErrors] = useState({});
    const { addEvent, updateEvent } = useAppContext();

    useEffect(() => {
        if (event) {
            setName(event.name);
            setDate(new Date(event.date).toISOString().slice(0, 16));
            setDescription(event.description);
        }
    }, [event]);

    const validateForm = () => {
        let tempErrors = {};
        if (!name.trim()) tempErrors.name = "イベント名は必須です。";
        if (!date) tempErrors.date = "日時は必須です。";
        if (new Date(date) < new Date()) tempErrors.date = "過去の日付は選択できません。";
        if (description.length > 500) tempErrors.description = "説明は500文字以内で入力してください。";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const eventData = { name, date, description };
        console.log('Submitting event data:', eventData);

        try {
            if (event) {
                await updateEvent(event.id, eventData);
            } else {
                await addEvent(eventData);
            }
            onSubmit();
        } catch (err) {
            console.error('Error saving event:', err.response?.data);
            setErrors({ submit: err.response?.data?.message || 'イベントの保存に失敗しました。もう一度お試しください。' });
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
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">日時</label>
                <input
                    type="datetime-local"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.date ? 'border-red-500' : ''}`}
                />
                {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date}</p>}
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">説明</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.description ? 'border-red-500' : ''}`}
                ></textarea>
                {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
            </div>
            <Button type="submit">{event ? '更新' : '作成'}</Button>
            {errors.submit && <p className="mt-2 text-sm text-red-600">{errors.submit}</p>}
        </form>
    );
};

export default EventForm;