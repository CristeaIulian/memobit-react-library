import React from 'react';

import { MacronutrientsPieChart } from '../../../src';

export const MacronutrientsPieChartPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Macronutrients Pie Chart</h1>
            <p>Lightweight SVG pie chart for macronutrient breakdowns.</p>

            <section className="page-section">
                <h2>Examples</h2>
                <div className="showcase-group">
                    <h3>Balanced meal</h3>
                    <div className="component-group">
                        <MacronutrientsPieChart data={{ carbs: 40, proteins: 30, lipids: 30 }} size={120} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>High protein</h3>
                    <div className="component-group">
                        <MacronutrientsPieChart data={{ carbs: 20, proteins: 60, lipids: 20 }} size={120} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>No data</h3>
                    <div className="component-group">
                        <MacronutrientsPieChart data={{ carbs: 0, proteins: 0, lipids: 0 }} size={120} />
                    </div>
                </div>
            </section>
        </div>
    );
};
