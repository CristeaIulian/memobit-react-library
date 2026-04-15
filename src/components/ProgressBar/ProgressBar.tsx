
import { format2Digits } from '../../helpers/Numbers';

import './ProgressBar.scss';

interface ProgressBarProps {
    label?: string;
    state?: 'default' | 'danger' | 'success' | 'warning' | 'info';
    value: number;
    showPercentage?: boolean;
    striped?: boolean;
    animated?: boolean;
    labelPosition?: 'inside' | 'above' | 'below';
}

export const ProgressBar = ({ label, state = 'default', value, showPercentage = true, striped = false, animated = false, labelPosition = 'inside' }: ProgressBarProps) => {
    const classNames = [
        'progress-fill',
        `progress-bar-${state}`,
        striped && 'progress-bar-striped',
        animated && striped && 'progress-bar-animated',
    ]
        .filter(Boolean)
        .join(' ');

    const displayText = showPercentage ? `${label ? `${label} - ` : ''}${format2Digits(value)}%` : label || '';

    return (
        <div className="progress-bar">
            {labelPosition === 'above' && displayText && (
                <div className="progress-bar__label">{displayText}</div>
            )}
            <div className="progress-bar__track">
                <div className={classNames} style={{ width: `${value > 100 ? 100 : value}%` }}>
                    {labelPosition === 'inside' && displayText}
                </div>
            </div>
            {labelPosition === 'below' && displayText && (
                <div className="progress-bar__label">{displayText}</div>
            )}
        </div>
    );
};
