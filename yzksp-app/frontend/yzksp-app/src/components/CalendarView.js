import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppContext } from '../contexts/AppContext';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
    const { events, fetchEvents } = useAppContext();
    const [calendarEvents, setCalendarEvents] = useState([]);

    const memoizedFetchEvents = useCallback(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        memoizedFetchEvents();
    }, [memoizedFetchEvents]);

    useEffect(() => {
        const formattedEvents = events.map(event => ({
            id: event.id,
            title: event.name,
            start: new Date(event.date),
            end: new Date(event.date),
            allDay: false,
            resource: event
        }));
        setCalendarEvents(formattedEvents);
    }, [events]);

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad';
        switch (event.resource.eventType) {
            case 'regular':
                backgroundColor = '#4CAF50';
                break;
            case 'weekend':
                backgroundColor = '#FFC107';
                break;
            case 'competition':
                backgroundColor = '#F44336';
                break;
            default:
                backgroundColor = '#3174ad';
        }
        return { style: { backgroundColor } };
    };

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
            />
        </div>
    );
};

export default CalendarView;