import { format2Digits } from '../../helpers/Numbers';

import './ProgressBar.scss';

interface ProgressBarProps {
    label?: string;
    state?: 'default' | 'danger' | 'success' | 'warning' | 'info';
    value: number;
    showPercentage?: boolean;
    striped?: boolean;
    animated?: boolean;
    thin?: boolean;
    labelPosition?: 'inside' | 'above' | 'below' | 'before' | 'after';
    labelAlign?: 'left' | 'center' | 'right';
}

export const ProgressBar = ({
    label,
    state = 'default',
    value,
    showPercentage = true,
    striped = false,
    animated = false,
    thin = false,
    labelPosition = 'inside',
    labelAlign = 'left',
}: ProgressBarProps) => {
    const classNames = ['progress-fill', `progress-bar-${state}`, striped && 'progress-bar-striped', animated && striped && 'progress-bar-animated']
        .filter(Boolean)
        .join(' ');

    const displayText = showPercentage ? `${label ? `${label} - ` : ''}${format2Digits(value)}%` : label || '';

    return (
        <div
            className={`progress-bar ${labelPosition === 'before' || labelPosition === 'after' ? 'progress-bar-inline' : ''}  ${thin ? 'progress-bar-thin' : ''}`}
        >
            {(labelPosition === 'above' || labelPosition === 'before') && displayText && (
                <div className={`progress-bar__label ${labelAlign ? `progress-bar__label-${labelAlign}` : ''}`}>{displayText}</div>
            )}
            <div className="progress-bar__track">
                <div className={classNames} style={{ width: `${value > 100 ? 100 : value}%` }}>
                    {labelPosition === 'inside' && displayText}
                </div>
            </div>
            {(labelPosition === 'below' || labelPosition === 'after') && displayText && (
                <div
                    className={`progress-bar__label ${labelPosition === 'after' ? 'progress-bar__label-after' : ''} progress-bar__label ${labelAlign ? `progress-bar__label-${labelAlign}` : ''}`}
                >
                    {displayText}
                </div>
            )}
        </div>
    );
};
