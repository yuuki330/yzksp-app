import React, { useState } from 'react';
import apiService from '../services/api';

const AttendanceForm = ({ eventId }) => {
    const [status, setStatus] = useState('present');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSucdess] = useState(false);

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
        <form onSubmit={handleSubmit}>
            <h3>出欠登録</h3>
            <select value={status} oncChange={(e) => setStatus(e.target.value)}>
                <option value="present">出席</option>
                <option value="absent">欠席</option>
                <option value="late">遅刻</option>
            </select>
            <button type="submit" disabled={submitting}>
                {submmitting ? '送信中...' : '登録'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green'}}>出欠が正常に登録されました。</p>}
        </form>
    );
};

export default AttendanceForm;