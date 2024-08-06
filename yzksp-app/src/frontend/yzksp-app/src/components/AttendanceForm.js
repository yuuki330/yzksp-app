import React, { useState } from 'react';
import apiService from '../services/api';

const AttendanceForm = ({ eventId }) => {
    const [status, setStatus] = useState('present');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try{
            await apiService.createAttendance({ event: eventId, status });
            setSuccess(true);
            setSubmitting(false);
        } catch (err) {
            setError('出欠の登録に失敗しました。');
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <h3 className="text-xl font-semibold mb-4">出欠登録</h3>
            <div className="mb-4">
                <select value={status} 
                        oncChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="present">出席</option>
                    <option value="absent">欠席</option>
                    <option value="late">遅刻</option>
                </select>
            </div>
            <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
                {submitting ? '送信中...' : '登録'}
            </button>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            {success && <p className="mt-2 text-green-500">出欠が正常に登録されました。</p>}
        </form>
    );
};

export default AttendanceForm;