import React from 'react';

import { AuthLogin, AuthProvider } from '../../../src';

const authConfig = {
    apiBaseUrl: window.location.origin,
    appName: 'Memobit Auth',
    storageKey: 'memobit_auth_token',
};

export const AuthLoginPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Auth Login Component</h1>
            <p>
                Full-page login experience powered by <code>AuthProvider</code>. Configure the auth API endpoints in your app to enable login.
            </p>

            <section className="page-section">
                <h2>Live Example</h2>
                <div className="showcase-group highlight">
                    <AuthProvider config={authConfig}>
                        <AuthLogin />
                    </AuthProvider>
                </div>
            </section>
        </div>
    );
};
