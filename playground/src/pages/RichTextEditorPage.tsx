import React, { useState } from 'react';

import { Button, RichTextEditor } from '../../../src';

export const RichTextEditorPage: React.FC = () => {
    const [basicContent, setBasicContent] = useState<string>('');
    const [requiredContent, setRequiredContent] = useState<string>('');
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [advancedContent, setAdvancedContent] = useState<string>('');
    const [prefilledContent, setPrefilledContent] = useState<string>(
        '<h2>Welcome</h2><p>This is a <strong>pre-filled</strong> rich text editor with <em>formatted</em> content and a <a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a>.</p><ul><li>Item one</li><li>Item two</li></ul>'
    );
    const [submitContent, setSubmitContent] = useState<string>('');
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);

    const stripHtml = (html: string) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent ?? '';
    };

    const handleSubmit = () => {
        if (!stripHtml(submitContent).trim()) {
            setSubmitError('This field is required. Please enter some content before submitting.');
            return;
        }
        setSubmitError(undefined);
        alert('Submitted successfully!');
    };

    return (
        <div className="rich-text-editor-page">
            <h1>Rich Text Editor Component</h1>
            <p>A fully featured rich text editor with toolbar formatting, built without external dependencies.</p>

            {/* ── Basic ── */}
            <section className="page-section">
                <h2>Basic</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <RichTextEditor label="Description" placeholder="Start typing..." value={basicContent} onChange={value => setBasicContent(value)} />
                    </div>
                    {basicContent && (
                        <div className="output-preview">
                            <strong>HTML output:</strong>
                            <pre style={{ textWrap: 'wrap' }}>{basicContent}</pre>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Required ── */}
            <section className="page-section">
                <h2>Required</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <RichTextEditor
                            label="Bio"
                            placeholder="Tell us about yourself..."
                            required
                            value={requiredContent}
                            onChange={value => setRequiredContent(value)}
                        />
                    </div>
                </div>
            </section>

            {/* ── Pre-filled ── */}
            <section className="page-section">
                <h2>Pre-filled Content</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <RichTextEditor label="Article" value={prefilledContent} onChange={value => setPrefilledContent(value)} />
                    </div>
                </div>
            </section>

            {/* ── Markdown output ── */}
            <section className="page-section">
                <h2>Markdown Output</h2>
                <p className="section-description">
                    Use <code>format="markdown"</code> to receive Markdown instead of HTML from the <code>onChange</code> callback.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <RichTextEditor
                            label="Notes"
                            placeholder="Write something and see the Markdown output below..."
                            format="markdown"
                            value={markdownContent}
                            onChange={value => setMarkdownContent(value)}
                        />
                    </div>
                    {markdownContent && (
                        <div className="output-preview">
                            <strong>Markdown output:</strong>
                            <pre style={{ textWrap: 'wrap' }}>{markdownContent}</pre>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Advanced toolbar ── */}
            <section className="page-section">
                <h2>Advanced Toolbar</h2>
                <p className="section-description">
                    Pass the <code>advanced</code> prop to unlock the Code Block and Table toolbar buttons.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <RichTextEditor
                            label="Documentation"
                            placeholder="Write documentation with code blocks and tables..."
                            advanced
                            value={advancedContent}
                            onChange={value => setAdvancedContent(value)}
                        />
                    </div>
                    {advancedContent && (
                        <div className="output-preview">
                            <strong>HTML output:</strong>
                            <pre style={{ textWrap: 'wrap' }}>{advancedContent}</pre>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Advanced toolbar + Markdown output ── */}
            <section className="page-section">
                <h2>Advanced Toolbar + Markdown Output</h2>
                <p className="section-description">
                    Both <code>advanced</code> and <code>format="markdown"</code> can be combined.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <RichTextEditor
                            label="Technical Notes"
                            placeholder="Write with code blocks and tables, get Markdown back..."
                            advanced
                            format="markdown"
                            value={markdownContent}
                            onChange={value => setMarkdownContent(value)}
                        />
                    </div>
                    {markdownContent && (
                        <div className="output-preview">
                            <strong>Markdown output:</strong>
                            <pre style={{ textWrap: 'wrap' }}>{markdownContent}</pre>
                        </div>
                    )}
                </div>
            </section>

            {/* ── External error ── */}
            <section className="page-section">
                <h2>External Error (Server-side)</h2>
                <p className="section-description">
                    The <code>error</code> prop can be used to surface server-side or form-level errors.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <RichTextEditor
                            label="Comment"
                            placeholder="Write your comment..."
                            error="This content was flagged as inappropriate. Please revise."
                            value={basicContent}
                            onChange={value => setBasicContent(value)}
                        />
                    </div>
                </div>
            </section>

            {/* ── Submit validation ── */}
            <section className="page-section">
                <h2>Submit Validation</h2>
                <p className="section-description">Validation triggered externally on form submission.</p>
                <div className="showcase-group">
                    <div className="component-group">
                        <RichTextEditor
                            label="Message"
                            placeholder="Write your message..."
                            required
                            error={submitError}
                            value={submitContent}
                            onChange={value => {
                                setSubmitContent(value);
                                if (submitError) setSubmitError(undefined);
                            }}
                        />
                        <Button onClick={handleSubmit}>Submit</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
