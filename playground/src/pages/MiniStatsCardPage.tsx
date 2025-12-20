import React from 'react';
import { MiniStatsCard } from '../../../src';

export const MiniStatsCardPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Mini Stats Card Component</h1>
            <p>A simple card component for displaying a large value with a label.</p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Default Variant</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Total Users" value="12,345" />
                        <MiniStatsCard label="Revenue" value="$54,321" />
                        <MiniStatsCard label="Orders" value="847" />
                        <MiniStatsCard label="Average Rating" value="4.8" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Color Variants</h2>
                <div className="showcase-group">
                    <h3>Success Variant</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Active Users" value="8,492" variant="success" />
                        <MiniStatsCard label="Completed Tasks" value="156" variant="success" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Warning Variant</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Pending Orders" value="127" variant="warning" />
                        <MiniStatsCard label="Items in Review" value="43" variant="warning" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Danger Variant</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Failed Transactions" value="23" variant="danger" />
                        <MiniStatsCard label="Critical Errors" value="7" variant="danger" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Info Variant</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Total Views" value="45.2K" variant="info" />
                        <MiniStatsCard label="Page Visits" value="1,234" variant="info" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Dashboard Example</h2>
                <div className="showcase-group">
                    <h3>Analytics Dashboard</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Total Revenue" value="$145,290" variant="success" />
                        <MiniStatsCard label="New Customers" value="2,543" variant="info" />
                        <MiniStatsCard label="Total Orders" value="12,847" />
                        <MiniStatsCard label="Avg. Order Value" value="$148.32" />
                    </div>
                </div>
            </section>
        </div>
    );
};
