import React from 'react';

import { PieChart, type PieChartDataPoint } from '../../../src';

const mixedVariantData: PieChartDataPoint[] = [
    { value: 35, variant: 'success' },
    { value: 25, variant: 'info' },
    { value: 20, variant: 'warning' },
    { value: 12, variant: 'danger' },
    { value: 8 },
];

const sameColorData: PieChartDataPoint[] = [{ value: 45 }, { value: 30 }, { value: 15 }, { value: 10 }];

const randomColorData: PieChartDataPoint[] = [
    { value: 22, variant: 'random' },
    { value: 18, variant: 'random' },
    { value: 34, variant: 'random' },
    { value: 16, variant: 'random' },
    { value: 10, variant: 'random' },
];

const customColorData: PieChartDataPoint[] = [
    { value: 40, variant: 'custom', customColor: '#7c3aed' },
    { value: 30, variant: 'custom', customColor: 'rgb(14, 165, 233)' },
    { value: 20, variant: 'custom', customColor: 'hsl(142 71% 45%)' },
    { value: 10, variant: 'custom', customColor: '#f97316' },
];

export const PieChartPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>PieChart Component</h1>
            <p>A generic pie chart component for rendering value slices with configurable color variants and label placement.</p>

            <section className="page-section">
                <h2>Value Labels</h2>

                <div className="showcase-group">
                    <h3>Inside values</h3>
                    <div className="component-group" style={{ gap: '32px' }}>
                        <PieChart data={mixedVariantData} valuePosition="inside" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Outside values</h3>
                    <div className="component-group" style={{ gap: '32px' }}>
                        <PieChart data={mixedVariantData} valuePosition="outside" valueFormatter={value => `${value}%`} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>No values</h3>
                    <div className="component-group" style={{ gap: '32px' }}>
                        <PieChart data={mixedVariantData} valuePosition="none" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Color Variants</h2>

                <div className="showcase-group">
                    <h3>All slices using default color</h3>
                    <div className="component-group" style={{ gap: '32px' }}>
                        <PieChart data={sameColorData} valuePosition="outside" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Mixed semantic variants</h3>
                    <div className="component-group" style={{ gap: '32px' }}>
                        <PieChart data={mixedVariantData} valuePosition="inside" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Generated random colors</h3>
                    <div className="component-group" style={{ gap: '32px' }}>
                        <PieChart data={randomColorData} valuePosition="outside" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Custom colors</h3>
                    <div className="component-group" style={{ gap: '32px' }}>
                        <PieChart data={customColorData} valuePosition="outside" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Sizes and Gaps</h2>

                <div className="showcase-group">
                    <h3>Small, medium and large</h3>
                    <div className="component-group" style={{ alignItems: 'center', gap: '40px' }}>
                        <PieChart data={mixedVariantData} size="small" />
                        <PieChart data={mixedVariantData} size="medium" />
                        <PieChart data={mixedVariantData} size="large" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Slice gap options</h3>
                    <div className="component-group" style={{ alignItems: 'center', gap: '40px' }}>
                        <PieChart data={mixedVariantData} gap={0} />
                        <PieChart data={mixedVariantData} gap={4} />
                        <PieChart data={mixedVariantData} gap={8} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Empty State</h2>

                <div className="showcase-group">
                    <h3>No data</h3>
                    <div className="component-group" style={{ alignItems: 'center', gap: '40px' }}>
                        <PieChart data={[]} valuePosition="none" />
                        <PieChart data={[]} emptyLabel="No data" />
                        <PieChart data={[{ value: 0 }, { value: -5 }]} emptyLabel="0" size="small" />
                    </div>
                </div>
            </section>
        </div>
    );
};
