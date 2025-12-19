import React from 'react';
import { Link } from 'react-router-dom';

import { sortedRoutes } from '../routes';
import { useBreakpoint, formatMoney } from '../../../src';

import './Home.scss';

export const Home: React.FC = () => {
    const { currentBreakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();

    return (
        <div className="home">
            <header className="home__header">
                <h1>Component Library Playground</h1>
                <p>Welcome to the interactive playground for testing and previewing components. Select a component from the sidebar to explore its features and variations.</p>
            </header>

            <section className="page-section">
                <h2>Current Environment</h2>
                <div className="info-grid">
                    <div className="info-card">
                        <strong>Breakpoint:</strong> {currentBreakpoint}
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

            <section className="page-section">
                <h2>Available Components ({sortedRoutes.length})</h2>
                <div className="home__grid">
                    {sortedRoutes.map(route => (
                        <Link key={route.path} to={route.path} className="home__card">
                            <h3>{route.label}</h3>
                            <span className="home__card-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};
