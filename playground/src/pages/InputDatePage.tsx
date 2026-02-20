import React, { useState } from 'react';

import { InputDate } from '../../../src';

export const InputDatePage: React.FC = () => {
    const [dateValue, setDateValue] = useState<string>('2026-02-20');
    const [dateTimeValue, setDateTimeValue] = useState<string>('2026-02-20T09:30');
    const [boundedDate, setBoundedDate] = useState<string>('2026-02-20');

    const errorMessage = dateValue ? '' : 'Please select a date';

    return (
        <div className="component-page">
            <h1>Input Date Component</h1>
            <p>Date and datetime inputs with labels, validation, and constraints.</p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Date input</h3>
                    <div className="component-group">
                        <InputDate
                            id="basic-date"
                            label="Start date"
                            value={dateValue}
                            onChange={value => setDateValue(value ?? '')}
                            required
                            error={errorMessage}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Date and time</h3>
                    <div className="component-group">
                        <InputDate
                            id="datetime"
                            label="Meeting time"
                            type="datetime"
                            value={dateTimeValue}
                            onChange={value => setDateTimeValue(value ?? '')}
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
        </div>
    );
};
