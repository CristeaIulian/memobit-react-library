import React, { useState } from 'react';

import { Checkbox } from '../../../src';

export const CheckboxPage: React.FC = () => {
    const [isChecked, setChecked] = useState<boolean>(false);

    return (
        <div className="checkbox-page">
            <h1>Checkbox Component</h1>
            <p>A checkbox component for selection inputs.</p>

            <section className="page-section">
                <h2>Basic Checkbox</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Checkbox checked={isChecked} onChange={() => setChecked(!isChecked)} label="Checkbox label" />
                    </div>
                </div>
            </section>
        </div>
    );
};
