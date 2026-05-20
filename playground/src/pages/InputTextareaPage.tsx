import React, { useState } from 'react';

import { InputTextarea } from '../../../src';

export const InputTextareaPage: React.FC = () => {
    const [textareaField, setTextareaField] = useState<string>('This is a textarea field');
    const [emptyField, setEmptyField] = useState<string>('');
    const [validField, setValidField] = useState<string>('This is a valid description with enough content.');
    const [eventField, setEventField] = useState<string>('Multiline event surface');
    const [lastEvent, setLastEvent] = useState<string>('No event yet');

    return (
        <div className="input-textarea-page">
            <h1>InputTextarea Component</h1>
            <p>A textarea component for multi-line text entry.</p>

            <section className="page-section">
                <h2>Basic InputTextarea</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputTextarea value={textareaField} onChange={value => setTextareaField(value)} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Validation States</h2>
                <div className="showcase-group">
                    <h3>Error State</h3>
                    <div className="component-group">
                        <InputTextarea
                            label="Description"
                            required
                            value={emptyField}
                            onChange={setEmptyField}
                            error={!emptyField ? 'Description is required' : undefined}
                        />
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Success State</h3>
                    <div className="component-group">
                        <InputTextarea label="Description" value={validField} onChange={setValidField} success="Description meets requirements" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Native InputTextarea Options and Events</h2>
                <div className="showcase-group">
                    <h3>Autocomplete, Focus, Columns and Keyboard Events</h3>
                    <div className="component-group">
                        <InputTextarea
                            label="Notes"
                            value={eventField}
                            onChange={setEventField}
                            autoComplete="on"
                            autoFocus
                            cols={32}
                            rows={4}
                            disabled={false}
                            onBlur={() => setLastEvent('blur')}
                            onClick={() => setLastEvent('click')}
                            onKeyDown={event => setLastEvent(`key down: ${event.key}`)}
                            onKeyUp={event => setLastEvent(`key up: ${event.key}`)}
                        />
                        <InputTextarea label="Disabled notes" value="Locked text" onChange={() => undefined} disabled />
                    </div>
                    <p>Last event: {lastEvent}</p>
                </div>
            </section>
        </div>
    );
};
