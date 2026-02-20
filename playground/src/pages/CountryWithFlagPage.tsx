import React from 'react';

import { CountryWithFlag } from '../../../src';

export const CountryWithFlagPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Country With Flag Component</h1>
            <p>Country labels paired with the matching flag asset.</p>

            <section className="page-section">
                <h2>Default Usage</h2>
                <div className="showcase-group">
                    <h3>Common destinations</h3>
                    <div className="component-group">
                        <CountryWithFlag code="us" label="United States" />
                        <CountryWithFlag code="gb" label="United Kingdom" />
                        <CountryWithFlag code="de" label="Germany" />
                        <CountryWithFlag code="ro" label="Romania" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Sizes</h2>
                <div className="showcase-group">
                    <h3>Compact to large</h3>
                    <div className="component-group">
                        <CountryWithFlag code="fr" size="xs" label="France" />
                        <CountryWithFlag code="es" size="sm" label="Spain" />
                        <CountryWithFlag code="it" size="md" label="Italy" />
                        <CountryWithFlag code="jp" size="lg" label="Japan" />
                        <CountryWithFlag code="br" size="xl" label="Brazil" />
                    </div>
                </div>
            </section>
        </div>
    );
};
