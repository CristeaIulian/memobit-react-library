import React from 'react';
import { MiniStatsCard } from '../../../src';

export const MiniStatsCardPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Mini Stats Card Component</h1>
            <p>A simple card component for displaying statistics with optional units, trends, and footer content.</p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Simple Stats Cards</h3>
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
                <h2>With Units</h2>
                <div className="showcase-group">
                    <h3>Values with Measurement Units</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Distance" value="32" unit="km" />
                        <MiniStatsCard label="Weight" value="45" unit="kg" />
                        <MiniStatsCard label="Duration" value="3.65" unit="min" />
                        <MiniStatsCard label="Temperature" value="22" unit="°C" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Color Variants</h2>
                <div className="showcase-group">
                    <h3>Different Color Themes</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Active Users" value="8,492" variant="success" />
                        <MiniStatsCard label="Pending Orders" value="127" variant="warning" />
                        <MiniStatsCard label="Failed Transactions" value="23" variant="danger" />
                        <MiniStatsCard label="Total Views" value="45.2K" variant="info" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>With Trends</h2>
                <div className="showcase-group">
                    <h3>Positive Trends (Success)</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Revenue" value="$87,432" trend={12.5} trendVariant="success" />
                        <MiniStatsCard label="Users" value="2,543" unit="users" trend={8.3} trendVariant="success" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Negative Trends (Danger)</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Bounce Rate" value="32.4" unit="%" trend={-5.3} trendVariant="danger" />
                        <MiniStatsCard label="Active Sessions" value="1,234" trend={-3.2} trendVariant="danger" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Warning Trends</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Pending Reviews" value="156" trend={2.1} trendVariant="warning" />
                        <MiniStatsCard label="Response Time" value="2.3" unit="sec" trend={1.5} trendVariant="warning" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Alignment Options</h2>
                <div className="showcase-group">
                    <h3>Left Aligned</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Total Sales" value="$125,432" align="left" />
                        <MiniStatsCard label="New Orders" value="847" unit="orders" align="left" trend={5.2} trendVariant="success" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Center Aligned (Default)</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Total Sales" value="$125,432" align="center" />
                        <MiniStatsCard label="New Orders" value="847" unit="orders" align="center" trend={5.2} trendVariant="success" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Right Aligned</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Total Sales" value="$125,432" align="right" />
                        <MiniStatsCard label="New Orders" value="847" unit="orders" align="right" trend={5.2} trendVariant="success" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Label Position</h2>
                <div className="showcase-group">
                    <h3>Label at Top</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Revenue" value="$54,321" labelPosition="top" />
                        <MiniStatsCard label="Distance" value="32" unit="km" labelPosition="top" trend={8.5} trendVariant="success" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Label at Bottom (Default)</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard label="Revenue" value="$54,321" labelPosition="bottom" />
                        <MiniStatsCard label="Distance" value="32" unit="km" labelPosition="bottom" trend={8.5} trendVariant="success" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>With Footer</h2>
                <div className="showcase-group">
                    <h3>Footer with Links and Buttons</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard
                            label="Total Revenue"
                            value="$145,290"
                            variant="success"
                            trend={23.5}
                            trendVariant="success"
                            footer={<a href="#" style={{ fontSize: '12px', color: 'var(--links-color)' }}>View all</a>}
                        />

                        <MiniStatsCard
                            label="New Customers"
                            value="2,543"
                            variant="info"
                            trend={18.2}
                            trendVariant="success"
                            footer={<a href="#" style={{ fontSize: '12px', color: 'var(--links-color)' }}>View details</a>}
                        />

                        <MiniStatsCard
                            label="Pending Tasks"
                            value="127"
                            variant="warning"
                            footer={
                                <button
                                    style={{
                                        fontSize: '12px',
                                        padding: '4px 12px',
                                        background: 'transparent',
                                        color: 'var(--body-accent-color)',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Manage
                                </button>
                            }
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Complete Examples</h2>
                <div className="showcase-group">
                    <h3>Dashboard Cards</h3>
                    <div
                        className="component-group"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
                    >
                        <MiniStatsCard
                            label="Total Revenue"
                            value="$145,290"
                            variant="success"
                            trend={23.5}
                            trendVariant="success"
                            align="left"
                            footer={<a href="#" style={{ fontSize: '12px', color: 'var(--links-color)' }}>View more →</a>}
                        />

                        <MiniStatsCard
                            label="Distance Traveled"
                            value="1,234"
                            unit="km"
                            variant="info"
                            trend={12.3}
                            trendVariant="success"
                            labelPosition="top"
                            footer={<span style={{ fontSize: '12px', color: 'var(--body-color-muted)' }}>Last 30 days</span>}
                        />

                        <MiniStatsCard
                            label="Server Response"
                            value="247"
                            unit="ms"
                            variant="warning"
                            trend={-5.2}
                            trendVariant="danger"
                            align="right"
                            footer={<a href="#" style={{ fontSize: '12px', color: 'var(--links-color)' }}>Optimize</a>}
                        />

                        <MiniStatsCard
                            label="Active Users"
                            value="8,492"
                            variant="success"
                            trend={15.8}
                            trendVariant="success"
                            footer={<span style={{ fontSize: '12px', color: 'var(--body-color-muted)' }}>Updated just now</span>}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
