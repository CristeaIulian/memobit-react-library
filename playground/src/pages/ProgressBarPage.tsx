import React, { useState, useEffect } from 'react';

import { ProgressBar, Button } from '../../../src';

export const ProgressBarPage: React.FC = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (isUploading && uploadProgress < 100) {
            const timer = setTimeout(() => {
                setUploadProgress(prev => Math.min(prev + Math.random() * 15, 100));
            }, 300);
            return () => clearTimeout(timer);
        } else if (uploadProgress >= 100) {
            setIsUploading(false);
        }
    }, [uploadProgress, isUploading]);

    const startUpload = () => {
        setUploadProgress(0);
        setIsUploading(true);
    };

    return (
        <div className="progress-bar-page">
            <h1>Progress Bar Component</h1>
            <p>A progress bar component for visualizing completion status.</p>

            <section className="page-section">
                <h2>Basic States</h2>

                <div className="showcase-group">
                    <h3>Default</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="default" value={23} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Success</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="success" value={75} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Info</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="info" value={50} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Warning</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="warning" value={65} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Danger</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="danger" value={30} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Striped Progress Bars</h2>

                <div className="showcase-group">
                    <h3>Default Striped</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="default" value={40} striped />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Success Striped</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="success" value={60} striped />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Info Striped</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="info" value={75} striped />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Warning Striped</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="warning" value={55} striped />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Danger Striped</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="danger" value={85} striped />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Animated Striped Progress Bars</h2>

                <div className="showcase-group">
                    <h3>Success Animated</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="success" value={70} striped animated />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Info Animated</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="info" value={45} striped animated />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Warning Animated</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="warning" value={60} striped animated />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Danger Animated</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="danger" value={90} striped animated />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>With/Without Percentage</h2>

                <div className="showcase-group">
                    <h3>With Percentage (Default)</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="info" value={68} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Without Percentage</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="info" value={68} showPercentage={false} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>With Custom Label</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="success" value={82} label="Download" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Label Only (No Percentage)</h3>
                    <div style={{ width: '300px' }}>
                        <ProgressBar state="warning" value={45} label="Processing" showPercentage={false} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Real-World Examples</h2>

                <div className="showcase-group">
                    <h3>File Upload Simulation</h3>
                    <div
                        style={{
                            width: '400px',
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}
                    >
                        <div style={{ marginBottom: '12px' }}>
                            <strong>document.pdf</strong> - {uploadProgress < 100 ? 'Uploading...' : 'Upload Complete!'}
                        </div>
                        <ProgressBar
                            state={uploadProgress < 100 ? 'info' : 'success'}
                            value={Math.round(uploadProgress)}
                            striped
                            animated={uploadProgress < 100}
                        />
                        <Button
                            variant={uploadProgress >= 100 ? 'success' : 'info'}
                            onClick={startUpload}
                            disabled={isUploading}
                            style={{ marginTop: '12px' }}
                        >
                            {uploadProgress >= 100 ? 'Upload Complete' : isUploading ? 'Uploading...' : 'Start Upload'}
                        </Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Storage Usage</h3>
                    <div
                        style={{
                            width: '400px',
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}
                    >
                        <div style={{ marginBottom: '8px' }}>
                            <strong>Storage Usage</strong>
                        </div>
                        <div style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--body-color-muted)' }}>
                            7.5 GB of 10 GB used
                        </div>
                        <ProgressBar state="warning" value={75} label="Storage" striped />
                        <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--body-color-muted)' }}>
                            You're running low on storage space
                        </p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Multi-Step Progress</h3>
                    <div
                        style={{
                            width: '400px',
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}
                    >
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ marginBottom: '8px' }}>
                                <strong>Installation Progress</strong>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>Step 1: Download</div>
                                    <ProgressBar state="success" value={100} showPercentage={false} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>Step 2: Extract</div>
                                    <ProgressBar state="success" value={100} showPercentage={false} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>Step 3: Install</div>
                                    <ProgressBar state="info" value={60} striped animated />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', marginBottom: '4px', color: 'var(--body-color-muted)' }}>
                                        Step 4: Configure
                                    </div>
                                    <ProgressBar state="default" value={0} showPercentage={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Skill Levels</h3>
                    <div
                        style={{
                            width: '400px',
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}
                    >
                        <div style={{ marginBottom: '8px' }}>
                            <strong>Skills & Expertise</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <div style={{ fontSize: '14px', marginBottom: '4px' }}>React</div>
                                <ProgressBar state="success" value={95} label="Expert" />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', marginBottom: '4px' }}>TypeScript</div>
                                <ProgressBar state="info" value={85} label="Advanced" />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', marginBottom: '4px' }}>Node.js</div>
                                <ProgressBar state="warning" value={70} label="Intermediate" />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', marginBottom: '4px' }}>Docker</div>
                                <ProgressBar state="default" value={45} label="Beginner" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
