import React from 'react';

import { Loading } from '../../../src';

export const LoadingPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Loading Component</h1>
            <p>Simple loading spinner for async states.</p>

            <section className="page-section">
                <h2>Spinner</h2>
                <div className="showcase-group">
                    <h3>Default loader</h3>
                    <div className="component-group">
                        <Loading />
                    </div>
                </div>
            </section>
        </div>
    );
};
