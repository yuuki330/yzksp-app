import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';

const AttendanceForm = ({ eventId }) => {
    const [status, setStatus] = useState('present');
    const { updateAttendance } = useAppContext();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccess(false);
        setError(null);

        const attendanceData = { event: eventId, status };
        console.log('Sending attendance data:', attendanceData);

        try {
            await updateAttendance({ event: eventId, status });
            setSuccess(true);
            } catch (err) {
                console.error('Error updating attendance:', err);
                setError('出欠の登録に失敗しました。もう一度お試しください。')
            } finally {
                setSubmitting(false);
            }
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">出欠登録</h3>
            <div className="mb-4">
                <label htmlFor='status' className='black text-gray-700 text-sm font-bold mb-2'>
                    出欠状況
                </label>
                <select
                    id='status' 
                    value={status} 
                    onChange={handleStatusChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label='出欠状況の選択'
                >
                    <option value="present">出席</option>
                    <option value="absent">欠席</option>
                    <option value="late">遅刻</option>
                </select>
            </div>
            <Button type="submit" disabled={submitting} aria-busy={submitting}>
                {submitting ? '送信中...' : '登録'}
            </Button>
            {error && <p className="mt-2 text-secondary" role='alert'>{error}</p>}
            {success && <p className="mt-2 text-green-500" role='status'>出欠が正常に登録されました。</p>}
        </form>
    );
};

export default AttendanceForm;