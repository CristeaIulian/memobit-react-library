import React from 'react';

import { InputFile } from '../../../src';

export const InputFilePage: React.FC = () => {
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
        </div>
    );
};
