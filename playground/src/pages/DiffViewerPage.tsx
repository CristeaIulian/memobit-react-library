import React, { useState } from 'react';

import { DiffViewer } from '../../../src';

// ─── Sample content ───────────────────────────────────────────────────────────

const plainOld = `The quick brown fox jumps over the lazy dog.
This is the second line of the document.
Nothing changed on this line.
This line was removed entirely.
The final line stays the same.`;

const plainNew = `The quick brown fox leaps over the lazy cat.
This is the second line of the document.
Nothing changed on this line.
A completely new line was added here.
The final line stays the same.`;

const codeOld = `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

export default Counter;`;

const codeNew = `import { useState, useCallback } from 'react';

function Counter({ initialValue = 0 }) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Counter;`;

const jsonOld = `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}`;

const jsonNew = `{
  "name": "my-app",
  "version": "1.2.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.0"
  },
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`;

const identicalText = `This line is the same.
This line is also the same.
No changes were made here.`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export const DiffViewerPage: React.FC = () => {
    const [mode, setMode] = useState<'split' | 'inline'>('split');
    const [customOld, setCustomOld] = useState(plainOld);
    const [customNew, setCustomNew] = useState(plainNew);

    return (
        <div className="diff-viewer-page">
            <h1>Diff Viewer Component</h1>
            <p>
                A text and code diff viewer with side-by-side and inline modes, word-level highlighting within changed lines, and line numbers. Built without
                external dependencies using the Myers diff algorithm.
            </p>

            {/* ── Mode toggle ── */}
            <section className="page-section">
                <h2>Plain Text — Mode Toggle</h2>
                <p className="section-description">
                    Switch between <code>split</code> and <code>inline</code> modes. Word-level changes are highlighted within modified lines.
                </p>

                <div className="showcase-group">
                    <div className="component-group" style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                            Mode:
                            <select
                                value={mode}
                                onChange={e => setMode(e.target.value as 'split' | 'inline')}
                                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="split">Split</option>
                                <option value="inline">Inline</option>
                            </select>
                        </label>
                    </div>
                    <DiffViewer oldValue={plainOld} newValue={plainNew} mode={mode} oldTitle="Original" newTitle="Modified" />
                </div>
            </section>

            {/* ── Code diff ── */}
            <section className="page-section">
                <h2>Code Diff — TypeScript / React</h2>
                <p className="section-description">
                    Use <code>type="code"</code> to enable syntax highlighting. Set <code>language</code> to hint the tokeniser.
                </p>

                <div className="showcase-group">
                    <DiffViewer oldValue={codeOld} newValue={codeNew} type="code" language="tsx" oldTitle="Counter.tsx — v1" newTitle="Counter.tsx — v2" />
                </div>
            </section>

            {/* ── Code diff inline ── */}
            <section className="page-section">
                <h2>Code Diff — JSON (Inline)</h2>
                <div className="showcase-group">
                    <DiffViewer
                        oldValue={jsonOld}
                        newValue={jsonNew}
                        type="code"
                        language="json"
                        mode="inline"
                        oldTitle="package.json — before"
                        newTitle="package.json — after"
                    />
                </div>
            </section>

            {/* ── No differences ── */}
            <section className="page-section">
                <h2>No Differences</h2>
                <p className="section-description">When the two values are identical, all lines render as equal with no stats shown.</p>
                <div className="showcase-group">
                    <DiffViewer oldValue={identicalText} newValue={identicalText} oldTitle="Version A" newTitle="Version B" />
                </div>
            </section>

            {/* ── No line numbers ── */}
            <section className="page-section">
                <h2>Without Line Numbers</h2>
                <div className="showcase-group">
                    <DiffViewer oldValue={plainOld} newValue={plainNew} showLineNumbers={false} />
                </div>
            </section>

            {/* ── Live editor ── */}
            <section className="page-section">
                <h2>Live Editor</h2>
                <p className="section-description">Edit the two text areas below to see the diff update in real time.</p>
                <div className="showcase-group">
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <textarea
                            style={{
                                flex: 1,
                                height: '160px',
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1',
                                resize: 'vertical',
                            }}
                            value={customOld}
                            onChange={e => setCustomOld(e.target.value)}
                            placeholder="Original text..."
                        />
                        <textarea
                            style={{
                                flex: 1,
                                height: '160px',
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1',
                                resize: 'vertical',
                            }}
                            value={customNew}
                            onChange={e => setCustomNew(e.target.value)}
                            placeholder="Modified text..."
                        />
                    </div>
                    <DiffViewer oldValue={customOld} newValue={customNew} mode={mode} oldTitle="Original" newTitle="Modified" />
                </div>
            </section>
        </div>
    );
};
