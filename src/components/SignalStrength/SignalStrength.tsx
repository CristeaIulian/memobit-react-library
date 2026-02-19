import { type ReactElement } from 'react';

import './SignalStrength.scss';

interface SignalStrengthProps {
    /** Signal strength value (0-100) */
    value: number;
    /** Signal state: excellent, good, fair, weak, unknown */
    state?: 'excellent' | 'good' | 'fair' | 'weak' | 'unknown';
    /** Size of the icon in pixels */
    size?: number;
    /** Optional class name */
    className?: string;
}

const getSignalState = (state: string | undefined, value: number): string => {
    if (state) {
        return state;
    }

    // Fallback to value-based state
    if (value >= 75) return 'excellent';
    if (value >= 50) return 'good';
    if (value >= 25) return 'fair';
    if (value > 0) return 'weak';
    return 'unknown';
};

const getSignalBars = (value: number): number => {
    if (value >= 75) return 4;
    if (value >= 50) return 3;
    if (value >= 25) return 2;
    if (value > 0) return 1;
    return 0;
};

export function SignalStrength({ value, state, size = 16, className = '' }: SignalStrengthProps): ReactElement {
    const signalState = getSignalState(state, value);
    const bars = getSignalBars(value);

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`SignalStrength SignalStrength--${signalState} ${className}`}
            aria-label={`Signal strength: ${value}%`}
        >
            {/* Bar 1 (shortest) */}
            <rect
                x="3"
                y="16"
                width="3"
                height="5"
                rx="1"
                fill={bars >= 1 ? 'var(--signal-color)' : 'var(--body-color-muted)'}
                className={`SignalStrength__bar ${bars >= 1 ? '' : 'SignalStrength__bar--inactive'}`}
            />

            {/* Bar 2 */}
            <rect
                x="8"
                y="12"
                width="3"
                height="9"
                rx="1"
                fill={bars >= 2 ? 'var(--signal-color)' : 'var(--body-color-muted)'}
                className={`SignalStrength__bar ${bars >= 2 ? '' : 'SignalStrength__bar--inactive'}`}
            />

            {/* Bar 3 */}
            <rect
                x="13"
                y="8"
                width="3"
                height="13"
                rx="1"
                fill={bars >= 3 ? 'var(--signal-color)' : 'var(--body-color-muted)'}
                className={`SignalStrength__bar ${bars >= 3 ? '' : 'SignalStrength__bar--inactive'}`}
            />

            {/* Bar 4 (tallest) */}
            <rect
                x="18"
                y="4"
                width="3"
                height="17"
                rx="1"
                fill={bars >= 4 ? 'var(--signal-color)' : 'var(--body-color-muted)'}
                className={`SignalStrength__bar ${bars >= 4 ? '' : 'SignalStrength__bar--inactive'}`}
            />
        </svg>
    );
}
