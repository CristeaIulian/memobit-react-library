import React, { useState } from 'react';

import { AnalogClock, AnalogClockMode, Button, TimeValue } from '../../../src';

const pad = (value: number): string => value.toString().padStart(2, '0');

const formatTime = (time: TimeValue, withSeconds = true): string =>
    withSeconds ? `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}` : `${pad(time.hours)}:${pad(time.minutes)}`;

export const AnalogClockPage: React.FC = () => {
    const [time24, setTime24] = useState<TimeValue>({ hours: 18, minutes: 30, seconds: 0 });
    const [time12, setTime12] = useState<TimeValue>({ hours: 9, minutes: 15, seconds: 0 });
    const [timeSeconds, setTimeSeconds] = useState<TimeValue>({ hours: 7, minutes: 45, seconds: 20 });
    const [timeStep, setTimeStep] = useState<TimeValue>({ hours: 13, minutes: 0, seconds: 0 });
    const [timeControlled, setTimeControlled] = useState<TimeValue>({ hours: 10, minutes: 10, seconds: 0 });
    const [controlledMode, setControlledMode] = useState<AnalogClockMode>('minutes');
    const [timeSmall, setTimeSmall] = useState<TimeValue>({ hours: 8, minutes: 5, seconds: 0 });
    const [timeLarge, setTimeLarge] = useState<TimeValue>({ hours: 22, minutes: 40, seconds: 0 });

    return (
        <div className="component-page">
            <h1>Analog Clock</h1>
            <p>
                A dial for picking a time by clicking or dragging instead of typing. In 24h mode the morning hours sit on the outer ring and the afternoon hours
                on the inner ring, with <code>00</code> at the top. Picking an hour automatically advances the dial to minutes.
            </p>
            <p>
                It is a standalone component — <code>TimePicker</code> embeds it next to its stepper inputs, and <code>DatePicker</code> exposes it through the{' '}
                <code>withClock</code> prop.
            </p>

            <section className="page-section">
                <h2>Basic Usage</h2>

                <div className="showcase-group">
                    <h3>24-hour dial (default)</h3>
                    <div className="component-group">
                        <AnalogClock value={time24} onChange={setTime24} />
                    </div>
                    <p>Selected: {formatTime(time24, false)}</p>
                </div>

                <div className="showcase-group">
                    <h3>12-hour dial with AM/PM</h3>
                    <div className="component-group">
                        <AnalogClock value={time12} onChange={setTime12} format="12h" />
                    </div>
                    <p>Selected: {formatTime(time12, false)}</p>
                </div>

                <div className="showcase-group">
                    <h3>With seconds</h3>
                    <div className="component-group">
                        <AnalogClock value={timeSeconds} onChange={setTimeSeconds} withSeconds />
                    </div>
                    <p>Selected: {formatTime(timeSeconds)}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Options</h2>

                <div className="showcase-group">
                    <h3>Minute step (5 minutes)</h3>
                    <div className="component-group">
                        <AnalogClock value={timeStep} onChange={setTimeStep} minuteStep={5} />
                    </div>
                    <p>Selected: {formatTime(timeStep, false)}</p>
                </div>

                <div className="showcase-group">
                    <h3>Sizes</h3>
                    <div className="component-group" style={{ alignItems: 'flex-start', gap: 'var(--spacing-32)' }}>
                        <AnalogClock value={timeSmall} onChange={setTimeSmall} size={160} />
                        <AnalogClock value={timeLarge} onChange={setTimeLarge} size={280} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Controlled mode, no header</h3>
                    <p>
                        The dial mode can be driven from the outside — here it stays on <code>minutes</code> until you switch it, and auto-advance is off.
                    </p>
                    <div className="component-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--spacing-12)' }}>
                        <div className="component-group">
                            <Button variant={controlledMode === 'hours' ? 'info' : 'ghost'} onClick={() => setControlledMode('hours')}>
                                Hours
                            </Button>
                            <Button variant={controlledMode === 'minutes' ? 'info' : 'ghost'} onClick={() => setControlledMode('minutes')}>
                                Minutes
                            </Button>
                        </div>
                        <AnalogClock
                            value={timeControlled}
                            onChange={setTimeControlled}
                            mode={controlledMode}
                            onModeChange={setControlledMode}
                            autoAdvance={false}
                            showHeader={false}
                        />
                    </div>
                    <p>
                        Mode: {controlledMode} — Selected: {formatTime(timeControlled, false)}
                    </p>
                </div>

                <div className="showcase-group">
                    <h3>Disabled</h3>
                    <div className="component-group">
                        <AnalogClock value={{ hours: 14, minutes: 20, seconds: 0 }} onChange={() => undefined} disabled />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Interaction</h2>
                <ul>
                    <li>Click or drag anywhere on the dial to set the active unit.</li>
                    <li>Releasing the pointer advances hours → minutes → seconds (disable with <code>autoAdvance={'{false}'}</code>).</li>
                    <li>Click the header numbers to jump back to a unit.</li>
                    <li>Focus the dial and use the arrow keys to nudge the active unit; Enter advances to the next one.</li>
                </ul>
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
                            <td style={{ padding: 'var(--spacing-8)' }}>value</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>TimeValue</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>—</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>{'{ hours: 0-23, minutes: 0-59, seconds: 0-59 }'}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>onChange</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>(value: TimeValue) =&gt; void</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>—</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Fires on every dial move, including while dragging</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>format</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>&apos;12h&apos; | &apos;24h&apos;</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>&apos;24h&apos;</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>24h adds the inner ring; 12h adds the AM/PM switch</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>withSeconds</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>boolean</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>false</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Adds a seconds segment and dial mode</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>minuteStep / secondStep</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>number</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>1</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Snapping granularity for minutes and seconds</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>size</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>number</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>232</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Dial diameter in pixels; everything scales from it</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>showHeader</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>boolean</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>true</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Hide it when another control already shows the value</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>autoAdvance</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>boolean</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>true</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Move to the next unit after a pick</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 'var(--spacing-8)' }}>mode / onModeChange</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>AnalogClockMode</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>uncontrolled</td>
                            <td style={{ padding: 'var(--spacing-8)' }}>Control which unit the dial is editing</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
};
