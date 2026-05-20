import React, { useState } from 'react';

import { InputFile } from '../../../src';

export const InputFilePage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [validFile, setValidFile] = useState<File | null>(new File([''], 'document.pdf'));
    const [lastEvent, setLastEvent] = useState<string>('No event yet');

    return (
        <div className="input-file-page">
            <h1>Input File Component</h1>
            <p>A file input component for uploading files.</p>

            <section className="page-section">
                <h2>Basic File Input</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputFile />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Validation States</h2>
                <div className="showcase-group">
                    <h3>Error State</h3>
                    <div className="component-group">
                        <InputFile
                            label="Upload document"
                            required
                            onChange={files => setFile(files?.[0] || null)}
                            error={!file ? 'Please select a file' : undefined}
                        />
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Success State</h3>
                    <div className="component-group">
                        <InputFile label="Upload document" onChange={files => setValidFile(files?.[0] || null)} success="File uploaded successfully" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>States and Native Options</h2>
                <div className="showcase-group">
                    <h3>Disabled, Highlighted and Event Handlers</h3>
                    <div className="component-group">
                        <InputFile
                            label="Highlighted upload"
                            placeholder="Choose a contract..."
                            highlighted
                            value=""
                            onClick={() => setLastEvent('click')}
                            onKeyDown={event => setLastEvent(`key down: ${event.key}`)}
                            onChange={files => setValidFile(files?.[0] || null)}
                        />
                        <InputFile label="Disabled upload" disabled />
                    </div>
                    <p>Last event: {lastEvent}</p>
                </div>
            </section>
        </div>
    );
};
