import React from 'react';

import { ChatBot } from '../../../src';

export const ChatBotPage: React.FC = () => {
    return (
        <div className="chatbot-page">
            <h1>ChatBot Component</h1>
            <p>An interactive chatbot component for AI-powered conversations.</p>

            <section className="page-section" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <h2>ChatBot</h2>
                <div className="showcase-group">
                    <div className="component-group" style={{ width: '500px' }}>
                        <ChatBot />
                    </div>
                </div>
            </section>
        </div>
    );
};
