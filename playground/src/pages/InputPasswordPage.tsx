import React, { useState } from 'react';

import { InputPassword } from '../../../src';

export const InputPasswordPage: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [confirmed, setConfirmed] = useState<string>('');

    const passwordError = password && password.length < 8 ? 'Password must be at least 8 characters.' : '';
    const confirmError = confirmed && confirmed !== password ? 'Passwords do not match.' : '';

    return (
        <div className="component-page">
            <h1>Input Password Component</h1>
            <p>Masked password input with labels and inline error messaging.</p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Single password field</h3>
                    <div className="component-group">
                        <InputPassword
                            id="password"
                            label="Password"
                            placeholder="Enter a secure password"
                            value={password}
                            onChange={setPassword}
                            required
                            error={passwordError}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Confirmation</h2>
                <div className="showcase-group">
                    <h3>Confirm password</h3>
                    <div className="component-group">
                        <InputPassword
                            id="confirm-password"
                            label="Confirm password"
                            placeholder="Re-enter your password"
                            value={confirmed}
                            onChange={setConfirmed}
                            required
                            error={confirmError}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>States</h2>
                <div className="showcase-group">
                    <h3>Disabled</h3>
                    <div className="component-group">
                        <InputPassword id="disabled-password" label="Disabled" value="password" disabled />
                    </div>
                </div>
            </section>
        </div>
    );
};
