import React, { useState } from 'react';

import { InputUrl } from '../../../src';

export const InputUrlPage: React.FC = () => {
    const [basicUrl, setBasicUrl] = useState<string>('');
    const [requiredUrl, setRequiredUrl] = useState<string>('');
    const [prefilledUrl, setPrefilledUrl] = useState<string>('https://example.com');
    const [customErrorUrl, setCustomErrorUrl] = useState<string>('');
    const [submitUrl, setSubmitUrl] = useState<string>('');
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);
    const [isSubmitValid, setIsSubmitValid] = useState<boolean>(true);
    const [validUrl, setValidUrl] = useState<string>('https://example.com');
    const [eventUrl, setEventUrl] = useState<string>('https://docs.example.com');
    const [lastEvent, setLastEvent] = useState<string>('No event yet');

    const handleSubmit = () => {
        if (!isSubmitValid || !submitUrl) {
            setSubmitError('Please enter a valid URL before submitting.');
        } else {
            setSubmitError(undefined);
            alert(`Submitted: ${submitUrl}`);
        }
    };

    return (
        <div className="input-url-page">
            <h1>Input URL Component</h1>
            <p>A URL input component with built-in validation for http:// and https:// addresses.</p>

            <section className="page-section">
                <h2>Basic URL Input</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputUrl label="Website" placeholder="https://example.com" value={basicUrl} onChange={value => setBasicUrl(value)} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Required</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputUrl label="Website" placeholder="https://example.com" required value={requiredUrl} onChange={value => setRequiredUrl(value)} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Pre-filled Value</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputUrl label="Website" value={prefilledUrl} onChange={value => setPrefilledUrl(value)} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Validation Error Message</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputUrl
                            label="Company Website"
                            placeholder="https://company.com"
                            validationErrorMessage="Please enter a valid company URL starting with http:// or https://"
                            value={customErrorUrl}
                            onChange={value => setCustomErrorUrl(value)}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Disabled</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputUrl label="Website" value="https://example.com" disabled />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Read Only</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputUrl label="Website" value="https://example.com" readOnly />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Validation States</h2>
                <div className="showcase-group">
                    <h3>External Error (Server-side)</h3>
                    <div className="component-group">
                        <InputUrl
                            label="Website"
                            placeholder="https://example.com"
                            value={basicUrl}
                            error="This URL is already in use."
                            onChange={value => setBasicUrl(value)}
                        />
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Success State</h3>
                    <div className="component-group">
                        <InputUrl
                            label="Website"
                            placeholder="https://example.com"
                            value={validUrl}
                            success="URL is valid and available"
                            onChange={value => setValidUrl(value)}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Input Options and Events</h2>
                <div className="showcase-group">
                    <h3>Focus, Highlight, Max Length and Keyboard Events</h3>
                    <div className="component-group">
                        <InputUrl
                            label="Documentation URL"
                            value={eventUrl}
                            onChange={setEventUrl}
                            autoFocus
                            highlighted
                            maxLength={80}
                            onBlur={() => setLastEvent('blur')}
                            onClick={() => setLastEvent('click')}
                            onKeyDown={event => setLastEvent(`key down: ${event.key}`)}
                            onKeyUp={event => setLastEvent(`key up: ${event.key}`)}
                        />
                    </div>
                    <p>Last event: {lastEvent}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>On Submit Validation</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputUrl
                            label="Website"
                            placeholder="https://example.com"
                            required
                            value={submitUrl}
                            error={submitError}
                            onChange={value => {
                                setSubmitUrl(value);
                                setSubmitError(undefined);
                            }}
                            onValidationChange={isValid => setIsSubmitValid(isValid)}
                        />
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </section>
        </div>
    );
};
