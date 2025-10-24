import React from 'react';

import './Loading.scss';

export const Loading: React.FC = () => {
    return (
        <div className="loading">
            <div className="loading__spinner"></div>
        </div>
    );
};
