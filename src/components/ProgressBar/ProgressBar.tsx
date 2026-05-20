import { type CSSProperties, useMemo } from 'react';

import { format2Digits } from '../../helpers/Numbers';

import './ProgressBar.scss';

export type ProgressBarState = 'default' | 'danger' | 'success' | 'warning' | 'info';
export type ProgressBarOrientation = 'horizontal' | 'vertical';
export type ProgressBarLabelPosition = 'inside' | 'above' | 'below' | 'before' | 'after';
export type ProgressBarLabelAlign = 'left' | 'center' | 'right';

export interface ProgressBarProps {
    animated?: boolean;
    height?: CSSProperties['height'];
    label?: string;
    labelAfterValue?: boolean;
    labelAlign?: ProgressBarLabelAlign;
    labelPosition?: ProgressBarLabelPosition;
    orientation?: ProgressBarOrientation;
    showPercentage?: boolean;
    state?: ProgressBarState;
    striped?: boolean;
    thin?: boolean;
    value: number;
}

export const ProgressBar = ({
    animated = false,
    height,
    label,
    labelAfterValue = false,
    labelAlign = 'left',
    labelPosition = 'inside',
    orientation = 'horizontal',
    showPercentage = true,
    state = 'default',
    striped = false,
    thin = false,
    value = 0,
}: ProgressBarProps) => {
    const fillClassNames = ['progress-fill', `progress-bar-${state}`, striped && 'progress-bar-striped', animated && striped && 'progress-bar-animated']
        .filter(Boolean)
        .join(' ');
    const labelClassNames = `progress-bar__label progress-bar__label--${state} ${labelAlign ? `progress-bar__label-${labelAlign}` : ''}`;

    const clampedValue = value > 100 ? 100 : value < 0 ? 0 : value;

    const displayText = useMemo((): string => {
        const displayTextContent = [];

        if (showPercentage) {
            displayTextContent.push(`${format2Digits(value)}%`);
        }

        if (label) {
            displayTextContent.push(label);
        }

        return (labelAfterValue ? displayTextContent : displayTextContent.reverse()).join(' - ');
    }, [showPercentage, value, label, labelAfterValue]);

    const showInsideLabel = labelPosition === 'inside' && Boolean(displayText);
    const isVertical = orientation === 'vertical';
    const trackStyle = isVertical && height ? ({ height } as CSSProperties) : undefined;
    const fillStyle = isVertical ? ({ height: `${clampedValue}%` } as CSSProperties) : ({ width: `${clampedValue}%` } as CSSProperties);

    return (
        <div
            className={`progress-bar progress-bar--${orientation} ${
                labelPosition === 'before' || labelPosition === 'after' ? 'progress-bar-inline' : ''
            }  ${thin ? 'progress-bar-thin' : ''}`}
        >
            {(labelPosition === 'above' || labelPosition === 'before') && displayText && <div className={labelClassNames}>{displayText}</div>}
            <div className="progress-bar__track" style={trackStyle}>
                <div className={`${fillClassNames} ${labelPosition === 'after' ? 'progress-bar__label-after' : ''} `} style={fillStyle} />
                {showInsideLabel && <span className={`progress-bar__inline-label progress-bar__inline-label-${labelAlign}`}>{displayText}</span>}
            </div>
            {(labelPosition === 'below' || labelPosition === 'after') && displayText && <div className={labelClassNames}>{displayText}</div>}
        </div>
    );
};
