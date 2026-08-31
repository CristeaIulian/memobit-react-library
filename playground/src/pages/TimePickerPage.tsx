import React, { useState } from 'react';

import { TimePicker, TimeValue } from '../../../src';

const pad = (value: number): string => value.toString().padStart(2, '0');

const formatTime = (time: TimeValue, withSeconds = false): string =>
    withSeconds ? `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}` : `${pad(time.hours)}:${pad(time.minutes)}`;

export const TimePickerPage: React.FC = () => {
    const [basic, setBasic] = useState<TimeValue>({ hours: 18, minutes: 30, seconds: 0 });
    const [withClock, setWithClock] = useState<TimeValue>({ hours: 9, minutes: 45, seconds: 0 });
    const [withSeconds, setWithSeconds] = useState<TimeValue>({ hours: 21, minutes: 5, seconds: 30 });
    const [twelveHour, setTwelveHour] = useState<TimeValue>({ hours: 15, minutes: 20, seconds: 0 });
    const [stepped, setStepped] = useState<TimeValue>({ hours: 8, minutes: 15, seconds: 0 });

    return (
        <div className="component-page">
            <h1>Time Picker</h1>
            <p>
                Stepper inputs for hours, minutes and seconds, with an optional <code>AnalogClock</code> dial underneath. Each field accepts typing, arrow keys,
                and the caret buttons; values wrap around at their bounds (23 → 00).
            </p>
            <p>
                This is the time section <code>DatePicker</code> renders when <code>withTime</code> is set, so it can also be used on its own when only a time
                is needed.
            </p>

            <section className="page-section">
                <h2>Basic Usage</h2>

                <div className="showcase-group">
                    <h3>Stepper inputs only</h3>
                    <div className="component-group">
                        <TimePicker value={basic} onChange={setBasic} />
                    </div>
                    <p>Selected: {formatTime(basic)}</p>
                </div>

                <div className="showcase-group">
                    <h3>With the analog dial</h3>
                    <p>The clock icon collapses the dial when the fields are enough.</p>
                    <div className="component-group">
                        <TimePicker value={withClock} onChange={setWithClock} withClock />
                    </div>
                    <p>Selected: {formatTime(withClock)}</p>
                </div>

                <div className="showcase-group">
                    <h3>With seconds</h3>
                    <div className="component-group">
                        <TimePicker value={withSeconds} onChange={setWithSeconds} withClock withSeconds />
                    </div>
                    <p>Selected: {formatTime(withSeconds, true)}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Options</h2>

                <div className="showcase-group">
                    <h3>12-hour format</h3>
                    <div className="component-group">
                        <TimePicker value={twelveHour} onChange={setTwelveHour} format="12h" withClock label="Start at" />
                    </div>
                    <p>Selected (24h value): {formatTime(twelveHour)}</p>
                </div>

                <div className="showcase-group">
                    <h3>15-minute steps, dial always visible</h3>
                    <div className="component-group">
                        <TimePicker value={stepped} onChange={setStepped} minuteStep={15} withClock collapsibleClock={false} clockSize={180} />
                    </div>
                    <p>Selected: {formatTime(stepped)}</p>
                </div>

                <div className="showcase-group">
                    <h3>Disabled</h3>
                    <div className="component-group">
                        <TimePicker value={{ hours: 12, minutes: 0, seconds: 0 }} onChange={() => undefined} disabled withClock />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Props</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: 'var(--spacing-8)' }}>Prop</th>
                            <th style={{ textAlign: 'left', padding: 'var(--spacing-8)' }}>Type</th>
                            <th style={{ textAlign: 'left', padding: 'var(--spacing-8)' }}>Default</th>
                            <th style={{ textAlign: 'left', padding: 'var(--spacing-8)' }}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>value / onChange</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>TimeValue</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>—</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Hours are always canonical 0-23, whatever the format</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>format</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>&apos;12h&apos; | &apos;24h&apos;</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>&apos;24h&apos;</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>12h shows an AM/PM toggle next to the fields</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>withSeconds</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>boolean</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>false</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Adds the seconds field</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>withClock</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>boolean</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>false</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Renders the analog dial below the fields</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>collapsibleClock</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>boolean</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>true</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Shows the toggle button that hides the dial</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>clockSize</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>number</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>208</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Dial diameter in pixels</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>minuteStep</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>number</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>1</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Applies to the stepper buttons and the dial</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>label</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>string</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>&apos;Time&apos;</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Pass an empty string to drop the header text</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
};
