import React from 'react';

import { useBreakpoint, formatMoney } from '../../../src';

export const UseBreakpointPage: React.FC = () => {
    const { currentBreakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();

    return (
        <div className="use-breakpoint-page">
            <h1>useBreakpoint Hook</h1>
            <p>A custom React hook for responsive design breakpoint detection.</p>

            <section className="page-section">
                <h2>Current Breakpoint Information</h2>
                <div className="info-grid">
                    <div className="info-card">
                        <strong>Current:</strong> {currentBreakpoint}
                    </div>
                    <div className="info-card">
                        <strong>Mobile:</strong> {isMobile ? 'Yes' : 'No'}
                    </div>
                    <div className="info-card">
                        <strong>Tablet:</strong> {isTablet ? 'Yes' : 'No'}
                    </div>
                    <div className="info-card">
                        <strong>Desktop:</strong> {isDesktop ? 'Yes' : 'No'}
                    </div>
                    <div className="info-card">
                        <strong>Format Money:</strong> {formatMoney(23)}
                    </div>
                </div>
            </section>
        </div>
    );
};
