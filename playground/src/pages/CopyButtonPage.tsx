import React, { useState } from 'react';

import { CopyButton } from '../../../src';

export const CopyButtonPage: React.FC = () => {
    const [lastCopied, setLastCopied] = useState('Nothing copied yet');

    return (
        <div className="copy-button-page">
            <h1>Copy Button Component</h1>
            <p>A button for copying text to the clipboard with success and error feedback.</p>

            <section className="page-section">
                <h2>Copy Button Examples</h2>

                <div className="showcase-group">
                    <h3>Basic Copy</h3>
                    <div className="component-group">
                        <CopyButton value="MB-2026-0001" onCopy={setLastCopied} />
                        <CopyButton value="https://memobit.dev/components/copy-button" label="Copy link" variant="info" onCopy={setLastCopied} />
                        <CopyButton value="npm install @memobit/libs" label="Copy command" variant="success" onCopy={setLastCopied} />
                    </div>
                    <p style={{ color: 'var(--body-color-muted)', fontSize: 'var(--font-size-sm)' }}>Last copied: {lastCopied}</p>
                </div>

                <div className="showcase-group">
                    <h3>Sizes</h3>
                    <div className="component-group">
                        <CopyButton value="small-copy" size="small" />
                        <CopyButton value="medium-copy" size="medium" />
                        <CopyButton value="large-copy" size="large" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Icon Only</h3>
                    <div className="component-group">
                        <CopyButton value="plain-icon-copy" iconOnly variant="plain" />
                        <CopyButton value="ghost-icon-copy" iconOnly variant="ghost" />
                        <CopyButton value="info-icon-copy" iconOnly variant="info" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Custom Labels</h3>
                    <div className="component-group">
                        <CopyButton
                            value="INV-983-2026"
                            label="Copy invoice"
                            copiedLabel="Invoice copied"
                            errorLabel="Invoice copy failed"
                            variant="warning"
                            onCopy={setLastCopied}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
