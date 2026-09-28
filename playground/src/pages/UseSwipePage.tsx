import { FC, useState } from 'react';

import { Badge, Button, useSwipe } from '../../../src';

const CARDS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const UseSwipePage: FC = () => {
    const [index, setIndex] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const [axis, setAxis] = useState<string>('—');

    const pushLog = (line: string) => setLog(prev => [line, ...prev].slice(0, 6));

    const carousel = useSwipe({
        onSwipeLeft: () => setIndex(current => Math.min(current + 1, CARDS.length - 1)),
        onSwipeRight: () => setIndex(current => Math.max(current - 1, 0)),
    });

    const fourWay = useSwipe({
        onSwipeDown: () => {
            setAxis('down');
            pushLog('Swiped down');
        },
        onSwipeLeft: () => {
            setAxis('left');
            pushLog('Swiped left');
        },
        onSwipeRight: () => {
            setAxis('right');
            pushLog('Swiped right');
        },
        onSwipeUp: () => {
            setAxis('up');
            pushLog('Swiped up');
        },
    });

    return (
        <div className="component-page">
            <h1>useSwipe Hook</h1>
            <p>
                Turns a touch drag into a direction. Touch only, deliberately: a mouse drag on the same element usually already means something — selecting
                text, dragging an item — and a phone is where a swipe is the natural gesture. Nothing is ever <code>preventDefault</code>ed, so the element
                keeps scrolling normally and a drag that fails the threshold costs the user nothing.
            </p>
            <p>
                <strong>These demos need a touch screen</strong> — or a browser&apos;s device-emulation mode. A mouse will not fire them.
            </p>

            <section className="page-section">
                <h2>Usage</h2>
                <p>Spread the returned handlers onto whatever should respond:</p>
                <pre>
                    <code>{`const swipe = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
});

return <div {...swipe}>…</div>;`}</code>
                </pre>
            </section>

            <section className="page-section">
                <h2>Paging</h2>
                <p>
                    Swipe the panel to move through the days. This is how <code>EventCalendar</code> pages its months and weeks, and how the day view steps
                    between dates.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <div
                            {...carousel}
                            style={{
                                alignItems: 'center',
                                background: 'var(--card-background-accent-color)',
                                border: '1px solid var(--card-border-color)',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                justifyContent: 'center',
                                minHeight: 'var(--spacing-100)',
                                touchAction: 'pan-y',
                            }}
                        >
                            <strong>{CARDS[index]}</strong>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center' }}>
                            <Button onClick={() => setIndex(current => Math.max(current - 1, 0))} size="small">
                                Previous
                            </Button>
                            <Badge>{`${index + 1} / ${CARDS.length}`}</Badge>
                            <Button onClick={() => setIndex(current => Math.min(current + 1, CARDS.length - 1))} size="small">
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>All four directions</h2>
                <p>
                    <code>threshold</code> is the distance along the swipe axis before it counts; <code>restraint</code> is how much drift across that axis is
                    tolerated. Restraint is what keeps a vertical scroll inside a scrolling element from registering as a horizontal page turn, so it matters
                    most when the swiped element scrolls the other way.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <div
                            {...fourWay}
                            style={{
                                alignItems: 'center',
                                background: 'var(--card-background-accent-color)',
                                border: '1px dashed var(--card-border-color)',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                justifyContent: 'center',
                                minHeight: 'var(--spacing-200)',
                            }}
                        >
                            <strong>Last: {axis}</strong>
                        </div>
                    </div>
                </div>

                {log.length > 0 && (
                    <div className="showcase-group">
                        <h3>Callback log</h3>
                        <ul>
                            {log.map((line, logIndex) => (
                                <li key={logIndex}>{line}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </div>
    );
};
