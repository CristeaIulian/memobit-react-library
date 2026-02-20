import React from 'react';

import { EmptyState } from '../../../src';

export const EmptyStatePage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Empty State</h1>
            <p>Clarify what happened and guide the next action.</p>

            <section className="page-section">
                <h2>Example</h2>
                <div className="showcase-group">
                    <h3>No results</h3>
                    <div className="component-group">
                        <EmptyState
                            icon="?"
                            title="No items found"
                            description="Try adjusting filters or create a new entry."
                            primaryAction={{ label: 'Create item', onClick: () => alert('Create clicked') }}
                            secondaryAction={{ label: 'Reset filters', onClick: () => alert('Reset clicked') }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
