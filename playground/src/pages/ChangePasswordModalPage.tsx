import React, { useState } from 'react';

import { AuthProvider, Button, ChangePasswordModal } from '../../../src';

const authConfig = {
    apiBaseUrl: window.location.origin,
    appName: 'Memobit Auth',
    storageKey: 'memobit_auth_token',
};

export const ChangePasswordModalPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="component-page">
            <h1>ChangePasswordModal Component</h1>
            <p>Authenticated password change flow with validation, loading state, and success/error feedback.</p>

            <section className="page-section">
                <h2>Modal Flow</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Button icon="lock" onClick={() => setIsOpen(true)}>
                            Open change password
                        </Button>
                    </div>
                    <AuthProvider config={authConfig}>
                        <ChangePasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
                    </AuthProvider>
                </div>
            </section>
        </div>
    );
};
