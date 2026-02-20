import React, { useState } from 'react';

import { InputPhone } from '../../../src';

export const InputPhonePage: React.FC = () => {
    const [phoneValue, setPhoneValue] = useState<string>('');
    const [phoneDigits, setPhoneDigits] = useState<string>('');
    const [customPhone, setCustomPhone] = useState<string>('');

    return (
        <div className="component-page">
            <h1>Input Phone Component</h1>
            <p>Phone input with formatting and digit extraction.</p>

            <section className="page-section">
                <h2>Default Format</h2>
                <div className="showcase-group">
                    <h3>International format</h3>
                    <div className="component-group">
                        <InputPhone
                            id="phone-default"
                            label="Phone number"
                            value={phoneValue}
                            onChange={(formatted, digits) => {
                                setPhoneValue(formatted);
                                setPhoneDigits(digits);
                            }}
                        />
                    </div>
                    <p>Formatted: {phoneValue || '(empty)'}</p>
                    <p>Digits: {phoneDigits || '(none)'}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Format</h2>
                <div className="showcase-group">
                    <h3>US short format</h3>
                    <div className="component-group">
                        <InputPhone
                            id="phone-custom"
                            label="Support line"
                            format="(###) ###-####"
                            value={customPhone}
                            onChange={(formatted, digits) => {
                                setCustomPhone(formatted);
                                setPhoneDigits(digits);
                            }}
                        />
                    </div>
                    <p>Formatted: {customPhone || '(empty)'}</p>
                </div>
            </section>
        </div>
    );
};
