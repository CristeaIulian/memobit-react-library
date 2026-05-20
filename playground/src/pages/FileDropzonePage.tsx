import React, { useState } from 'react';

import { FileDropzone } from '../../../src';

export const FileDropzonePage: React.FC = () => {
    const [fileCount, setFileCount] = useState(0);
    const [multiCount, setMultiCount] = useState(0);

    return (
        <div className="component-page">
            <h1>File Dropzone</h1>
            <p>Drag-and-drop file upload area with optional previews.</p>

            <section className="page-section">
                <h2>Example</h2>
                <div className="showcase-group">
                    <h3>Upload attachments</h3>
                    <div className="component-group">
                        <FileDropzone label="Project files" accept="image/*,application/pdf" onFiles={files => setFileCount(files.length)} />
                    </div>
                    <p>Files selected: {fileCount}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Multiple Files</h2>
                <div className="showcase-group">
                    <h3>Upload multiple assets</h3>
                    <div className="component-group">
                        <FileDropzone label="Marketing assets" accept="image/*" multiple onFiles={files => setMultiCount(files.length)} />
                    </div>
                    <p>Files selected: {multiCount}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Without Image Preview</h2>
                <div className="showcase-group">
                    <h3>Upload supporting documents</h3>
                    <div className="component-group">
                        <FileDropzone label="Evidence files" accept="image/*,application/pdf" showPreview={false} multiple />
                    </div>
                </div>
            </section>
        </div>
    );
};
