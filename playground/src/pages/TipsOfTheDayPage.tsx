import React from 'react';

import { TipsOfTheDay } from '../../../src';

export const TipsOfTheDayPage: React.FC = () => {
    return (
        <div className="tips-of-the-day-page">
            <h1>Tips Of The Day Component</h1>
            <p>A component for displaying daily tips or helpful hints.</p>

            <section className="page-section" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <h2>Tips Display</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <TipsOfTheDay list={['item 1', 'item 2']} />
                    </div>
                </div>
            </section>
        </div>
    );
};
