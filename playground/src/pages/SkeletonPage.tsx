import React from 'react';
import { Skeleton } from '../../../src';

export const SkeletonPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Skeleton Component</h1>
            <p>
                Loading placeholder components to improve perceived performance while content is being fetched.
            </p>

            <section className="page-section">
                <h2>Variants</h2>
                <div className="showcase-group">
                    <h3>Text (Default)</h3>
                    <div className="component-group">
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Circular</h3>
                    <div className="component-group">
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="circular" width={60} height={60} />
                            <Skeleton variant="circular" width={80} height={80} />
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Rectangular</h3>
                    <div className="component-group">
                        <Skeleton variant="rectangular" height={200} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Rounded</h3>
                    <div className="component-group">
                        <Skeleton variant="rounded" height={100} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Animations</h2>
                <div className="showcase-group">
                    <h3>Pulse (Default)</h3>
                    <div className="component-group">
                        <Skeleton animation="pulse" height={60} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Wave</h3>
                    <div className="component-group">
                        <Skeleton animation="wave" height={60} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>None</h3>
                    <div className="component-group">
                        <Skeleton animation="none" height={60} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Sizing</h2>
                <div className="showcase-group">
                    <h3>Fixed Width</h3>
                    <div className="component-group">
                        <Skeleton width={200} height={40} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Percentage Width</h3>
                    <div className="component-group">
                        <Skeleton width="50%" height={40} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Custom Border Radius</h3>
                    <div className="component-group">
                        <Skeleton height={60} borderRadius={20} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Multiple Skeletons (Count)</h2>
                <div className="showcase-group">
                    <h3>Text Lines</h3>
                    <div className="component-group">
                        <Skeleton variant="text" count={5} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Circular Avatars</h3>
                    <div className="component-group">
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Skeleton variant="circular" width={50} height={50} count={4} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Real-World Examples</h2>
                <div className="showcase-group">
                    <h3>User Profile Card</h3>
                    <div
                        className="component-group"
                        style={{
                            padding: '20px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            maxWidth: '400px',
                        }}
                    >
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                            <Skeleton variant="circular" width={60} height={60} />
                            <div style={{ flex: 1 }}>
                                <Skeleton variant="text" width="60%" height={20} />
                                <Skeleton variant="text" width="40%" height={16} />
                            </div>
                        </div>
                        <Skeleton variant="text" count={3} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Article Card</h3>
                    <div
                        className="component-group"
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            maxWidth: '400px',
                            overflow: 'hidden',
                        }}
                    >
                        <Skeleton variant="rectangular" height={200} animation="wave" />
                        <div style={{ padding: '16px' }}>
                            <Skeleton variant="text" width="80%" height={24} />
                            <Skeleton variant="text" count={3} />
                            <div style={{ marginTop: '16px' }}>
                                <Skeleton variant="rounded" height={40} width={120} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Comment List</h3>
                    <div className="component-group" style={{ maxWidth: '600px' }}>
                        {[1, 2, 3].map(index => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginBottom: '20px',
                                    padding: '16px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                }}
                            >
                                <Skeleton variant="circular" width={40} height={40} />
                                <div style={{ flex: 1 }}>
                                    <Skeleton variant="text" width="30%" height={16} />
                                    <Skeleton variant="text" count={2} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Product Grid</h3>
                    <div
                        className="component-group"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '16px',
                        }}
                    >
                        {[1, 2, 3, 4].map(index => (
                            <div
                                key={index}
                                style={{
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                }}
                            >
                                <Skeleton variant="rectangular" height={200} animation="wave" />
                                <div style={{ padding: '12px' }}>
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="rounded" height={36} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Table Loading</h3>
                    <div className="component-group">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Email</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map(index => (
                                    <tr key={index}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                            <Skeleton width="80%" />
                                        </td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                            <Skeleton width="90%" />
                                        </td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                            <Skeleton width={60} height={24} borderRadius={12} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Form Loading</h3>
                    <div
                        className="component-group"
                        style={{
                            maxWidth: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                    >
                        <div>
                            <Skeleton variant="text" width={100} height={16} />
                            <Skeleton variant="rounded" height={40} />
                        </div>
                        <div>
                            <Skeleton variant="text" width={80} height={16} />
                            <Skeleton variant="rounded" height={40} />
                        </div>
                        <div>
                            <Skeleton variant="text" width={120} height={16} />
                            <Skeleton variant="rounded" height={100} />
                        </div>
                        <Skeleton variant="rounded" height={44} width={150} />
                    </div>
                </div>
            </section>
        </div>
    );
};
