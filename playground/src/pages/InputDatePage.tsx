import React, { useState } from 'react';

import { InputDate } from '../../../src';

export const InputDatePage: React.FC = () => {
    const [dateValue, setDateValue] = useState<string>('2026-02-20');
    const [dateTimeValue, setDateTimeValue] = useState<string>('2026-02-20T09:30');
    const [boundedDate, setBoundedDate] = useState<string>('2026-02-20');
    const [emptyDate, setEmptyDate] = useState<string>('');
    const [validDate, setValidDate] = useState<string>('2026-02-25');
    const [eventDate, setEventDate] = useState<string>('2026-03-01');
    const [lastEvent, setLastEvent] = useState<string>('No event yet');

    const errorMessage = emptyDate ? '' : 'Please select a date';

    return (
        <div className="component-page">
            <h1>Input Date Component</h1>
            <p>Date and datetime inputs with labels, validation, and constraints.</p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Date input</h3>
                    <div className="component-group">
                        <InputDate id="basic-date" label="Start date" value={dateValue} onChange={value => setDateValue(value ?? '')} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Date and time</h3>
                    <div className="component-group">
                        <InputDate id="datetime" label="Meeting time" type="datetime" value={dateTimeValue} onChange={value => setDateTimeValue(value ?? '')} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Validation States</h2>
                <div className="showcase-group">
                    <h3>Error State</h3>
                    <div className="component-group">
                        <InputDate
                            id="error-date"
                            label="Start date"
                            value={emptyDate}
                            onChange={value => setEmptyDate(value ?? '')}
                            required
                            error={errorMessage}
                        />
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Success State</h3>
                    <div className="component-group">
                        <InputDate
                            id="success-date"
                            label="Start date"
                            value={validDate}
                            onChange={value => setValidDate(value ?? '')}
                            success="Date is available"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Constraints</h2>
                <div className="showcase-group">
                    <h3>Min and max</h3>
                    <div className="component-group">
                        <InputDate
                            id="bounded-date"
                            label="Booking date"
                            value={boundedDate}
                            min="2026-02-15"
                            max="2026-03-15"
                            onChange={value => setBoundedDate(value ?? '')}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Disabled</h3>
                    <div className="component-group">
                        <InputDate id="disabled-date" label="Disabled" value="2026-02-20" disabled />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Input Options and Events</h2>
                <div className="showcase-group">
                    <h3>Focus, Highlight, Clearable and Keyboard Events</h3>
                    <div className="component-group">
                        <InputDate
                            id="event-date"
                            label="Event date"
                            value={eventDate}
                            onChange={value => setEventDate(value ?? '')}
                            autoComplete="off"
                            autoFocus
                            clearable
                            highlighted
                            onBlur={() => setLastEvent('blur')}
                            onClick={() => setLastEvent('click')}
                            onKeyDown={event => setLastEvent(`key down: ${event.key}`)}
                            onKeyUp={event => setLastEvent(`key up: ${event.key}`)}
                        />
                        <InputDate id="readonly-date" label="Read only" value="2026-04-01" readOnly />
                    </div>
                    <p>Last event: {lastEvent}</p>
                </div>
            </section>
        </div>
    );
};
