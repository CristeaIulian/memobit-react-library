import React from 'react';

import { format2Digits } from '../../helpers/Numbers';

import './ProgressBar.scss';

interface ProgressBarProps {
    label?: string;
    state: 'default' | 'danger' | 'success' | 'warning' | 'info';
    value: number;
}

export const ProgressBar = ({ label, state = 'default', value }: ProgressBarProps) => {
    return (
        <div className="progress-bar">
            <div
                className={`progress-fill progress-bar-${state}`}
                style={{ width: `${value > 100 ? 100 : value}%` }}
            >{`${label ? `${label} - ` : ''} ${format2Digits(value)}%`}</div>
        </div>
    );
};
