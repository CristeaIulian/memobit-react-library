import { type CSSProperties, useMemo } from 'react';

import { format2Digits } from '../../helpers/Numbers';
import { Tooltip } from '../Tooltip';

import './StackedBar.scss';

export type StackedBarSegmentState = 'default' | 'danger' | 'success' | 'warning' | 'info';
export type StackedBarSegmentPattern = 'solid' | 'striped' | 'hatched';
export type StackedBarOrientation = 'horizontal' | 'vertical';

export interface StackedBarSegment {
    label?: string;
    pattern?: StackedBarSegmentPattern;
    state?: StackedBarSegmentState;
    value: number;
}

export interface StackedBarProps {
    animated?: boolean;
    height?: CSSProperties['height'];
    normalize?: boolean;
    orientation?: StackedBarOrientation;
    segments: StackedBarSegment[];
    /**
     * Draw a hairline between adjacent segments. Needed when a segment's colour encodes a *state*
     * rather than an identity, since two neighbours can then share a colour and visually merge into
     * one block. Opt-in, so existing bars keep their current look.
     */
    separators?: boolean;
    showLabels?: boolean;
    showPercentage?: boolean;
    thin?: boolean;
    width?: CSSProperties['width'];
}

const buildSegmentText = (segment: StackedBarSegment, percent: number, showPercentage: boolean): string => {
    const formatted = `${format2Digits(percent)}%`;

    if (segment.label && showPercentage) {
        return `${segment.label} - ${formatted}`;
    }

    if (segment.label) {
        return segment.label;
    }

    return formatted;
};

export const StackedBar = ({
    animated = false,
    height,
    normalize = true,
    orientation = 'horizontal',
    segments,
    separators = false,
    showLabels = true,
    showPercentage = true,
    thin = false,
    width,
}: StackedBarProps) => {
    const percents = useMemo((): number[] => {
        if (segments.length === 0) {
            return [];
        }

        if (!normalize) {
            return segments.map(s => Math.max(0, s.value));
        }

        const total = segments.reduce((acc, s) => acc + Math.max(0, s.value), 0);

        if (total === 0) {
            return segments.map(() => 0);
        }

        return segments.map(s => (Math.max(0, s.value) / total) * 100);
    }, [segments, normalize]);

    const isVertical = orientation === 'vertical';

    const trackStyle: CSSProperties = {};
    if (height !== undefined) {
        trackStyle.height = height;
    }
    if (width !== undefined) {
        trackStyle.width = width;
    }

    const trackClassName = [
        'stacked-bar',
        `stacked-bar--${orientation}`,
        thin ? 'stacked-bar--thin' : '',
        separators ? 'stacked-bar--separators' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={trackClassName} style={trackStyle}>
            {segments.map((segment, index) => {
                const percent = percents[index];

                if (percent <= 0) {
                    return null;
                }

                const state = segment.state || 'default';
                const pattern = segment.pattern || 'solid';
                const text = buildSegmentText(segment, percent, showPercentage);
                const segmentClassName = [
                    'stacked-bar__segment',
                    `stacked-bar__segment--${state}`,
                    `stacked-bar__segment--${pattern}`,
                    animated && pattern !== 'solid' ? 'stacked-bar__segment--animated' : '',
                ]
                    .filter(Boolean)
                    .join(' ');

                const sizeStyle: CSSProperties = isVertical ? { height: `${percent}%` } : { width: `${percent}%` };

                return (
                    <Tooltip key={`stacked-bar-segment-${index}`} title={text}>
                        <div className={segmentClassName} style={sizeStyle}>
                            {showLabels && <span className="stacked-bar__segment-label">{text}</span>}
                        </div>
                    </Tooltip>
                );
            })}
        </div>
    );
};
