import { FC, useState } from 'react';

import { Button, type CalendarEvent, DayAgenda, EventCalendar } from '../../../src';

interface DemoMeta {
    owner: string;
}

const at = (day: number, hour = 0, minute = 0): Date => new Date(2026, 8, day, hour, minute);

const BUSY_DAY: CalendarEvent<DemoMeta>[] = [
    { id: 1, title: 'Bin day', start: at(23), allDay: true, variant: 'accent', data: { owner: 'home' } },
    { id: 2, title: 'Check Tineretului gas', start: at(23, 9), data: { owner: 'money' } },
    { id: 3, title: 'Recharge scooter', start: at(23, 9), variant: 'warning', data: { owner: 'home' } },
    { id: 4, title: 'Spalat cafetiera', start: at(23, 12), variant: 'ghost', data: { owner: 'home' } },
    { id: 5, title: 'Standup', start: at(23, 10), end: at(23, 10, 30), variant: 'success', data: { owner: 'work' } },
    { id: 6, title: 'Dentist', start: at(23, 18, 30), end: at(23, 19, 30), variant: 'danger', data: { owner: 'health' } },
    { id: 7, title: 'Pay rent', start: at(23, 8), variant: 'done', data: { owner: 'money' } },
    { id: 8, title: 'Call the landlord', start: at(23, 15), color: '#c084fc', data: { owner: 'home' } },
];

const SPREAD_OVER_THE_MONTH: CalendarEvent<DemoMeta>[] = [
    ...BUSY_DAY,
    { id: 9, title: 'Haircut', start: at(22, 9), end: at(22, 10), data: { owner: 'self' } },
    { id: 10, title: 'Car wash', start: at(21, 10), variant: 'warning', data: { owner: 'car' } },
    { id: 11, title: 'Cleanup bin', start: at(24, 11), variant: 'ghost', data: { owner: 'home' } },
];

export const DayAgendaPage: FC = () => {
    const [standaloneOpen, setStandaloneOpen] = useState(false);
    const [emptyOpen, setEmptyOpen] = useState(false);
    const [log, setLog] = useState<string[]>([]);

    const pushLog = (line: string) => setLog(prev => [line, ...prev].slice(0, 6));

    return (
        <div className="component-page">
            <h1>Day Agenda Component</h1>
            <p>
                One day&apos;s events, listed in a modal. A month cell can only carry a chip or three before the rest disappear behind{' '}
                <code>+N more</code>, and those chips are far too small to aim at on a phone — this is the way into a busy day. Takes the same{' '}
                <code>CalendarEvent&lt;T&gt;[]</code> the calendar is given and picks the day out itself, so there is no second, pre-filtered copy to keep in
                sync.
            </p>

            <section className="page-section">
                <h2>Inside EventCalendar</h2>
                <p>
                    Pass <code>dayAgenda</code> and the calendar routes a chip click, a <code>+N more</code> and a tap on the day number through the agenda for
                    that day. <code>onEventClick</code> then fires from a row inside it, and <code>onDayClick</code> becomes the agenda&apos;s Add action. Click
                    around 21–24 September.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <EventCalendar<DemoMeta>
                            date={at(23)}
                            dayAgenda
                            emptyLabel="Nothing scheduled this month"
                            events={SPREAD_OVER_THE_MONTH}
                            onDayClick={day => pushLog(`Add on ${day.toDateString()}`)}
                            onEventClick={event => pushLog(`Opened "${event.title}" (${event.data?.owner})`)}
                            showWeekNumbers
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
                <h2>Standalone</h2>
                <p>
                    It does not need a calendar around it — hand it a date and a list. Variants and a per-event <code>color</code> carry over from the chips, so
                    a row reads the same way as the chip it was opened from.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <Button onClick={() => setStandaloneOpen(true)}>Open 23 September</Button>
                        <DayAgenda<DemoMeta>
                            date={at(23)}
                            events={BUSY_DAY}
                            isOpen={standaloneOpen}
                            onAdd={day => {
                                setStandaloneOpen(false);
                                pushLog(`Add on ${day.toDateString()}`);
                            }}
                            onClose={() => setStandaloneOpen(false)}
                            onEventClick={event => {
                                setStandaloneOpen(false);
                                pushLog(`Opened "${event.title}"`);
                            }}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Empty day, read-only</h2>
                <p>
                    With no <code>onEventClick</code> the rows stop advertising themselves as clickable, and with no <code>onAdd</code> the footer goes away
                    entirely.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <Button onClick={() => setEmptyOpen(true)}>Open 25 September</Button>
                        <DayAgenda
                            date={at(25)}
                            emptyLabel="Nothing scheduled"
                            events={BUSY_DAY}
                            isOpen={emptyOpen}
                            onClose={() => setEmptyOpen(false)}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
