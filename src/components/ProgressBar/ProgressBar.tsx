import { useMemo } from 'react';

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
    labelAfterValue?: boolean;
}

export const ProgressBar = ({
    label,
    state = 'default',
    value = 0,
    showPercentage = true,
    striped = false,
    animated = false,
    thin = false,
    labelPosition = 'inside',
    labelAlign = 'left',
    labelAfterValue = false,
}: ProgressBarProps) => {
    const fillClassNames = ['progress-fill', `progress-bar-${state}`, striped && 'progress-bar-striped', animated && striped && 'progress-bar-animated']
        .filter(Boolean)
        .join(' ');
    const labelClassNames = `progress-bar__label progress-bar__label--${state} ${labelAlign ? `progress-bar__label-${labelAlign}` : ''}`;

    const displayText = useMemo((): string => {
        const displayTextContent = [];

        if (showPercentage) {
            displayTextContent.push(`${format2Digits(value)}%`);
        }

        if (label) {
            displayTextContent.push(label);
        }

        return (labelAfterValue ? displayTextContent : displayTextContent.reverse()).join(' - ');
    }, []);

    return (
        <div
            className={`progress-bar ${labelPosition === 'before' || labelPosition === 'after' ? 'progress-bar-inline' : ''}  ${thin ? 'progress-bar-thin' : ''}`}
        >
            {(labelPosition === 'above' || labelPosition === 'before') && displayText && <div className={labelClassNames}>{displayText}</div>}
            <div className="progress-bar__track">
                <div
                    className={`${fillClassNames} ${labelPosition === 'after' ? 'progress-bar__label-after' : ''} `}
                    style={{ width: `${value > 100 ? 100 : value}%` }}
                >
                    {labelPosition === 'inside' && displayText}
                </div>
            </div>
            {(labelPosition === 'below' || labelPosition === 'after') && displayText && <div className={labelClassNames}>{displayText}</div>}
        </div>
    );
};
