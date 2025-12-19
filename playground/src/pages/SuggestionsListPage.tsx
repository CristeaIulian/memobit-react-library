import React from 'react';

import { SuggestionsList } from '../../../src';

export const SuggestionsListPage: React.FC = () => {
    return (
        <div className="suggestions-list-page">
            <h1>Suggestions List Component</h1>
            <p>A component for displaying a list of suggestions with labels and tooltips.</p>

            <section className="page-section">
                <h2>Basic Suggestions List</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <SuggestionsList
                            label="Label here"
                            title="Title here"
                            tooltip="Tooltip here"
                            data={[
                                { value: 2, name: 'first item', unit: 'km' },
                                { value: 3, name: 'second item', unit: 'km' },
                            ]}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
