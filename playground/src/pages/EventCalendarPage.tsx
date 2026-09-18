import { FC, useState } from 'react';

import { type CalendarEvent, EventCalendar } from '../../../src';

interface DemoMeta {
    owner: string;
}

const at = (day: number, hour = 0, minute = 0): Date => new Date(2026, 8, day, hour, minute);

const initialEvents: CalendarEvent<DemoMeta>[] = [
    { id: 1, title: "Tata's birthday", start: at(2), allDay: true, variant: 'accent', data: { owner: 'family' } },
    { id: 2, title: 'Programare paradontolog', start: at(9, 19, 30), end: at(9, 20, 30), data: { owner: 'health' } },
    { id: 3, title: 'Dezinfectare saltea', start: at(19, 8), end: at(19, 9, 30), variant: 'success', data: { owner: 'home' } },
    { id: 4, title: 'Car wash', start: at(21, 10), variant: 'warning', data: { owner: 'car' } },
    { id: 5, title: 'Check payments', start: at(21, 8, 30), data: { owner: 'money' } },
    { id: 6, title: 'Haircut', start: at(22, 9), end: at(22, 10), data: { owner: 'self' } },
    { id: 7, title: 'Check Tineretului gas', start: at(23, 9), data: { owner: 'money' } },
    { id: 8, title: 'Recharge scooter', start: at(23, 9), data: { owner: 'home' } },
    { id: 9, title: 'Spalat cafetiera', start: at(23, 12), variant: 'ghost', data: { owner: 'home' } },
    { id: 10, title: 'Cleanup bin', start: at(24, 11), variant: 'ghost', data: { owner: 'home' } },
    { id: 11, title: 'Dentist parodontologie', start: at(30, 18, 30), end: at(30, 19, 30), variant: 'danger', data: { owner: 'health' } },
    { id: 12, title: 'Check Digi payment', start: at(30, 9), variant: 'done', data: { owner: 'money' } },
    { id: 13, title: 'Conference', start: at(14), end: at(16), allDay: true, variant: 'accent', data: { owner: 'work' } },
];

export const EventCalendarPage: FC = () => {
    const [events, setEvents] = useState(initialEvents);
    const [log, setLog] = useState<string[]>([]);

    const pushLog = (line: string) => setLog(prev => [line, ...prev].slice(0, 6));

    const handleDrop = (event: CalendarEvent<DemoMeta>, nextStart: Date) => {
        const shift = nextStart.getTime() - event.start.getTime();

        setEvents(prev =>
            prev.map(candidate =>
                candidate.id === event.id
                    ? { ...candidate, start: nextStart, end: candidate.end ? new Date(candidate.end.getTime() + shift) : undefined }
                    : candidate
            )
        );

        pushLog(`Moved "${event.title}" to ${nextStart.toLocaleString()}`);
    };

    return (
        <div className="component-page">
            <h1>Event Calendar Component</h1>
            <p>
                A month and week calendar for events that already exist elsewhere — tasks, bookings, appointments. Unlike <code>Calendar</code>, which is a date{' '}
                <em>picker</em>, this one is a surface for showing and rearranging things over time. Generic over your own payload via{' '}
                <code>CalendarEvent&lt;T&gt;.data</code>.
            </p>

            <section className="page-section">
                <h2>Interactive</h2>
                <p>
                    Drag a chip onto another day (or another hour, in week view) to reschedule it. Click a chip to select it, or click empty space to add on that
                    day.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <EventCalendar<DemoMeta>
                            date={at(18)}
                            emptyLabel="Nothing scheduled this month"
                            events={events}
                            onDayClick={day => pushLog(`Clicked empty day ${day.toLocaleString()}`)}
                            onEventClick={event => pushLog(`Clicked "${event.title}" (${event.data?.owner})`)}
                            onEventDrop={handleDrop}
                        />
                    </div>
                </div>

                {log.length > 0 && (
                    <div className="showcase-group">
                        <h3>Callback log</h3>
                        <ul>
                            {log.map((line, index) => (
                                <li key={index}>{line}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            <section className="page-section">
                <h2>Variants</h2>
                <p>
                    <code>ghost</code> is for events computed rather than stored — a projected recurrence, say — so they read as expected rather than booked.{' '}
                    <code>done</code> strikes through for history.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <EventCalendar
                            date={at(18)}
                            events={[
                                { id: 'a', title: 'default', start: at(15, 9) },
                                { id: 'b', title: 'accent', start: at(15, 10), variant: 'accent' },
                                { id: 'c', title: 'success', start: at(16, 9), variant: 'success' },
                                { id: 'd', title: 'warning', start: at(16, 10), variant: 'warning' },
                                { id: 'e', title: 'danger', start: at(17, 9), variant: 'danger' },
                                { id: 'f', title: 'muted', start: at(17, 10), variant: 'muted' },
                                { id: 'g', title: 'ghost (projected)', start: at(18, 9), variant: 'ghost' },
                                { id: 'h', title: 'done', start: at(18, 10), variant: 'done' },
                                { id: 'i', title: 'custom colour', start: at(19, 9), color: '#c084fc' },
                            ]}
                            maxEventsPerDay={4}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Week view — business hours</h2>
                <p>
                    Trim the grid with <code>dayStartHour</code> / <code>dayEndHour</code>. Overlapping events split into side-by-side lanes automatically.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <EventCalendar
                            date={at(22)}
                            dayEndHour={19}
                            dayStartHour={8}
                            events={[
                                { id: 'w1', title: 'Standup', start: at(22, 9), end: at(22, 9, 15), variant: 'accent' },
                                { id: 'w2', title: 'Design review', start: at(22, 9), end: at(22, 10, 30) },
                                { id: 'w3', title: 'Pairing', start: at(22, 10), end: at(22, 12) },
                                { id: 'w4', title: 'Lunch', start: at(23, 12), end: at(23, 13), variant: 'success' },
                                { id: 'w5', title: 'Retro', start: at(24, 16), end: at(24, 17), variant: 'warning' },
                                { id: 'w6', title: 'Release', start: at(25, 17), end: at(25, 18, 30), variant: 'danger' },
                                { id: 'w7', title: 'Offsite', start: at(24), allDay: true, variant: 'accent' },
                            ]}
                            view="week"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>First Day of Week</h2>
                <p>
                    The grid starts on Sunday by default, matching <code>Calendar</code>. Pass <code>{'firstDayOfWeek={1}'}</code> to start it on Monday.
                </p>
                <div className="showcase-group">
                    <h3>Monday first</h3>
                    <div className="component-group">
                        <EventCalendar date={at(18)} events={initialEvents.slice(0, 6)} firstDayOfWeek={1} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Read-only</h2>
                <p>Omit the callbacks and the calendar becomes a static display — no drag handles, no hover affordances.</p>
                <div className="showcase-group">
                    <div className="component-group">
                        <EventCalendar date={at(18)} events={initialEvents.slice(0, 6)} />
                    </div>
                </div>
            </section>
        </div>
    );
};
