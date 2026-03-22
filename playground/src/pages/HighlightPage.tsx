import React, { useState } from 'react';

import { highlightText } from '../../../src';

import '../../../src/styles/highlight.scss';

const sampleTexts = [
    'Chicken Tikka Masala with Basmati Rice',
    'Spaghetti Bolognese with Fresh Herbs',
    'Greek Salad with Feta Cheese and Olives',
    'Chocolate Lava Cake with Vanilla Ice Cream',
    'Thai Green Curry with Coconut Milk',
];

export const HighlightPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="highlight-page">
            <h1>highlightText Helper</h1>
            <p>A utility function that highlights matching search terms within text by wrapping matches in <code>&lt;mark&gt;</code> tags.</p>

            <section className="page-section">
                <h2>Interactive Example</h2>
                <div className="component-group">
                    <input
                        type="text"
                        placeholder="Type to search (e.g. 'chicken', 'with', 'cake')..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
                    />
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {sampleTexts.map((text, index) => (
                            <li key={index} style={{ padding: '8px 0', fontSize: '16px' }}>
                                {highlightText(text, searchTerm)}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="page-section">
                <h2>Usage</h2>
                <pre>{`import { highlightText } from '@memobit/libs';
// Also import the highlight styles in your App:
// import '@memobit/libs/dist/styles/highlight.scss';

// Returns original text if no match
highlightText('Hello World', 'xyz')  // → 'Hello World'

// Wraps matches in <mark> tags
highlightText('Hello World', 'World')
// → ['Hello ', <mark>World</mark>]

// Case-insensitive matching
highlightText('Hello World', 'hello')
// → [<mark>Hello</mark>, ' World']

// Empty search term returns original text
highlightText('Hello World', '')  // → 'Hello World'`}</pre>
            </section>
        </div>
    );
};
