import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import AttendanceForm from './AttendanceForm';
import Button from '../components/Button';
import apiService from '../services/api';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { events, loading, error, deleteEvent } = useAppContext();
    const [attendances, setAttendances] = useState([]);
    const [attendancesLoading, setAttendancesLoading] = useState(true);
    const [attendancesError, setAttendancesError] = useState(null);
    
    useEffect(() => {
        const fetchAttendances = async () => {
            try {
                console.log(`Fetching attendances for event ${id}`);
                setAttendancesLoading(true);
                const response = await apiService.getEventAttendances(id);
                console.log('Attendances response:', JSON.stringify(response.data, null, 2));
                setAttendances(response.data);
                setAttendancesLoading(false);
            } catch (error) {
                console.error('Error fetching attendances:', error);
                setAttendancesError('参加者情報の取得に失敗しました。');
                setAttendancesLoading(false);
            }
        };

        if (id) {
            fetchAttendances();
        }
    }, [id]);

    useEffect(() => {
        console.log('Events array:', events); // 全てのイベントを出力
    }, [events]);

    if (loading || attendancesLoading) return <div className="text-center py-4">読み込み中...</div>;
    if (error) return <div className="text-center py-4 text-secondary">{error}</div>;

    const event = events.find(e => e.id === parseInt(id));

    if (!event) return <div className="text-center py-4">イベントが見つかりません。</div>;

    const handleDelete = async () => {
        if (window.confirm('このイベントを削除してもよろしいですか？')) {
            try {
                await deleteEvent(event.id);
                navigate('/events');
            } catch (err) {
                console.error('Failed to delete event:', err);
            }
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 overflow-hidden">
            <div className='p-6 md:p-8 lg:p-10'>
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">{event.name}</h2>
                <div className='md:flex md:justify-between md:items-start'>
                    <div className="mb-6 md:mb-0 md:w-2/3">
                        <p className="text-gray-600 mb-2">日時: {new Date(event.date).toLocaleString()}</p>
                        <p className="text-gray-700 mb-4">説明: {event.description}</p>
                        <p className="text-gray-600 mb-2">主催者: {event.organizer ? event.organizer.username : '未指定'}</p>
                    </div>
                    <div className='md:w-1/3 md:ml-8'>
                        <AttendanceForm eventId={event.id} />
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">参加者リスト</h3>
                {attendancesLoading ? (
                    <p>参加者情報を読み込み中...</p>
                ) : attendancesError ? (
                    <p className="text-red-500">{attendancesError}</p>
                ) : (
                    <ul className="list-disc pl-5">
                        {attendances.map(attendance => (
                            <li key={attendance.id} className="mb-2">
                                {attendance.user
                                    ? `${attendance.user.username} - ${attendance.status}`
                                    : `Unknown participant - ${attendance.status}`}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="mt-8 space-x-4">
                <Button variant='secondary' onClick={() => navigate('/events')}>戻る</Button>
                <Button onClick={() => navigate(`/events/${id}/edit`)}>編集</Button>
                <Button variant='danger' onClick={handleDelete}>削除</Button>
            </div>
        </div>
    );
};

export default EventDetail;