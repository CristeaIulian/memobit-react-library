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

            <section className="page-section">
                <h2>Short List (No Show More/Less)</h2>
                <p>With fewer than 10 items, the "Show more/less" button does not appear.</p>
                <div className="showcase-group">
                    <div className="component-group">
                        <SuggestionsList
                            label="Fruit"
                            title="Nutritional Suggestions"
                            tooltip="Only 5 items - no 'Show more' button"
                            data={[
                                { name: 'Apple', value: 95, unit: 'kcal' },
                                { name: 'Banana', value: 105, unit: 'kcal' },
                                { name: 'Orange', value: 62, unit: 'kcal' },
                                { name: 'Grapes', value: 67, unit: 'kcal' },
                                { name: 'Strawberry', value: 33, unit: 'kcal' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Long List (Show More/Less Button)</h2>
                <p>With more than 10 items, the "Show more/less" button appears. Initially shows only the first 10 items.</p>
                <div className="showcase-group">
                    <div className="component-group">
                        <SuggestionsList
                            label="Fruit"
                            title="All Fruits"
                            tooltip="15 items - 'Show more' button appears"
                            data={[
                                { name: 'Apple', value: 95, unit: 'kcal' },
                                { name: 'Banana', value: 105, unit: 'kcal' },
                                { name: 'Orange', value: 62, unit: 'kcal' },
                                { name: 'Grapes', value: 67, unit: 'kcal' },
                                { name: 'Strawberry', value: 33, unit: 'kcal' },
                                { name: 'Mango', value: 60, unit: 'kcal' },
                                { name: 'Pineapple', value: 50, unit: 'kcal' },
                                { name: 'Watermelon', value: 30, unit: 'kcal' },
                                { name: 'Peach', value: 39, unit: 'kcal' },
                                { name: 'Cherry', value: 50, unit: 'kcal' },
                                { name: 'Blueberry', value: 57, unit: 'kcal' },
                                { name: 'Raspberry', value: 52, unit: 'kcal' },
                                { name: 'Blackberry', value: 43, unit: 'kcal' },
                                { name: 'Kiwi', value: 61, unit: 'kcal' },
                                { name: 'Papaya', value: 43, unit: 'kcal' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Long List with String Values</h2>
                <p>Another example with 14 items using string values instead of numbers.</p>
                <div className="showcase-group">
                    <div className="component-group">
                        <SuggestionsList
                            label="Body Measurement"
                            title="Health Metrics"
                            tooltip="Complete body composition analysis with 14 items"
                            data={[
                                { name: 'Height', value: '175', unit: 'cm' },
                                { name: 'Weight', value: '70', unit: 'kg' },
                                { name: 'BMI', value: '22.9', unit: '' },
                                { name: 'Body Fat', value: '15', unit: '%' },
                                { name: 'Muscle Mass', value: '55', unit: 'kg' },
                                { name: 'Water %', value: '60', unit: '%' },
                                { name: 'Bone Mass', value: '3.2', unit: 'kg' },
                                { name: 'Visceral Fat', value: '8', unit: '' },
                                { name: 'Metabolic Age', value: '25', unit: 'years' },
                                { name: 'Protein', value: '18', unit: '%' },
                                { name: 'BMR', value: '1650', unit: 'kcal' },
                                { name: 'Chest', value: '95', unit: 'cm' },
                                { name: 'Waist', value: '80', unit: 'cm' },
                                { name: 'Hip', value: '98', unit: 'cm' },
                            ]}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
