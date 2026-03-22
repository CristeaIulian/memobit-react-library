import React, { useEffect, useState } from 'react';

import { ScrollToTop } from '../../../src';

export const ScrollToTopPage: React.FC = () => {
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const container = document.querySelector<HTMLElement>('.layout__content');
        if (container) {
            setScrollContainer(container);
        }
    }, []);

    return (
        <div className="scroll-to-top-page">
            <h1>ScrollToTop Component</h1>
            <p>A fixed-position button that appears after scrolling down, allowing users to smoothly scroll back to the top of the page.</p>

            <section className="page-section">
                <h2>Default (200px threshold)</h2>
                <p>Scroll down this page to see the ScrollToTop button appear in the bottom-right corner (above the FloatButton position).</p>
            </section>

            <section className="page-section">
                <h2>Props</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>scrollThreshold</code></td>
                            <td><code>number</code></td>
                            <td><code>200</code></td>
                            <td>Number of pixels to scroll before the button becomes visible</td>
                        </tr>
                        <tr>
                            <td><code>scrollContainer</code></td>
                            <td><code>HTMLElement | null</code></td>
                            <td><code>undefined</code></td>
                            <td>A scrollable container element. When omitted, listens to window scroll.</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="page-section">
                <h2>Usage</h2>
                <pre>{`import { ScrollToTop } from '@memobit/libs';

// Window scroll (default)
<ScrollToTop />

// Custom threshold
<ScrollToTop scrollThreshold={400} />

// Scrollable container
const [container, setContainer] = useState<HTMLElement | null>(null);
<div ref={setContainer} style={{ overflowY: 'auto', height: '400px' }}>
    {/* content */}
    <ScrollToTop scrollContainer={container} />
</div>`}</pre>
            </section>

            {/* Spacer to enable scrolling */}
            <div style={{ height: '150vh' }}>
                <p style={{ paddingTop: '300px', textAlign: 'center', opacity: 0.5 }}>
                    Keep scrolling to see the ScrollToTop button appear...
                </p>
            </div>

            <ScrollToTop scrollContainer={scrollContainer} />
        </div>
    );
};
