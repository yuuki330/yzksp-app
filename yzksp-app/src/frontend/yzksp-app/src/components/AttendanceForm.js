import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';

const AttendanceForm = ({ eventId }) => {
    const [status, setStatus] = useState('present');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const { createAttendance } = useAppContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
    
        try {
            console.log('Submitting attendance for event:', eventId, 'with status:', status);
            await createAttendance(eventId, { status });
            setSuccess(true);
        } catch (err) {
            console.error('Error updating attendance:', err);
            setError(err.message || '出欠の登録に失敗しました。もう一度お試しください。');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
                <label htmlFor='status' className='block text-sm font-medium text-gray-700'>
                    出欠状況
                </label>
                <select
                    id='status' 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="present">出席</option>
                    <option value="absent">欠席</option>
                    <option value="late">遅刻</option>
                </select>
            </div>
            <Button type="submit" disabled={submitting}>
                {submitting ? '送信中...' : '登録'}
            </Button>
            {error && <p className="mt-2 text-sm text-red-600" role='alert'>{error}</p>}
            {success && <p className="mt-2 text-sm text-green-600" role='status'>出欠が正常に登録されました。</p>}
        </form>
    );
};

export default AttendanceForm;