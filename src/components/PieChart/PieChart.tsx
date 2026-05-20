import React, { useMemo } from 'react';

import './PieChart.scss';

export type PieChartVariant = 'default' | 'warning' | 'danger' | 'info' | 'success' | 'random' | 'custom';
export type PieChartValuePosition = 'inside' | 'outside' | 'none';
export type PieChartSize = 'small' | 'medium' | 'large';

export interface PieChartDataPoint {
    value: number;
    variant?: PieChartVariant;
    customColor?: string;
}

export interface PieChartProps {
    ariaLabel?: string;
    className?: string;
    data?: PieChartDataPoint[];
    emptyLabel?: React.ReactNode;
    gap?: number;
    size?: PieChartSize;
    valueFormatter?: (value: number, slice: PieChartDataPoint, index: number) => React.ReactNode;
    valuePosition?: PieChartValuePosition;
}

interface Position {
    x: number;
    y: number;
}

interface RenderedSlice {
    color: string;
    endAngle: number;
    index: number;
    label: React.ReactNode;
    midAngle: number;
    path: string;
    startAngle: number;
    value: number;
}

const chartSizeMap: Record<PieChartSize, number> = {
    small: 120,
    medium: 180,
    large: 240,
};

const variantColors: Record<Exclude<PieChartVariant, 'random' | 'custom'>, string> = {
    default: 'var(--progress-default-bar-fill-color)',
    warning: 'var(--progress-warning-bar-fill-color)',
    danger: 'var(--progress-danger-bar-fill-color)',
    info: 'var(--progress-info-bar-fill-color)',
    success: 'var(--progress-success-bar-fill-color)',
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number): Position => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
};

const createSlicePath = (center: number, radius: number, startAngle: number, endAngle: number): string => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return ['M', center, center, 'L', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y, 'Z'].join(' ');
};

const getGeneratedColor = (index: number): string => {
    const hue = Math.round((index * 137.508 + 28) % 360);
    return `hsl(${hue} 72% 52%)`;
};

const getSliceColor = (slice: PieChartDataPoint, index: number): string => {
    const variant = slice.variant ?? 'default';

    if (variant === 'custom') {
        return slice.customColor || variantColors.default;
    }

    if (variant === 'random') {
        return getGeneratedColor(index);
    }

    return variantColors[variant];
};

export const PieChart: React.FC<PieChartProps> = ({
    ariaLabel = 'Pie chart',
    className = '',
    data = [],
    emptyLabel,
    gap = 1,
    size = 'medium',
    valueFormatter,
    valuePosition = 'inside',
}: PieChartProps) => {
    const chartSize = chartSizeMap[size];
    const outsidePadding = valuePosition === 'outside' ? Math.round(chartSize * 0.18) : 0;
    const center = chartSize / 2;
    const radius = Math.max(center - Math.max(gap, 1), 1);
    const viewBox = `${-outsidePadding} ${-outsidePadding} ${chartSize + outsidePadding * 2} ${chartSize + outsidePadding * 2}`;

    const slices = useMemo<RenderedSlice[]>(() => {
        const validSlices = data.filter(slice => Number.isFinite(slice.value) && slice.value > 0);
        const total = validSlices.reduce((sum, slice) => sum + slice.value, 0);

        if (total <= 0) {
            return [];
        }

        let currentAngle = 0;

        return validSlices.map((slice, index) => {
            const angle = (slice.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = index === validSlices.length - 1 ? 360 : currentAngle + angle;
            const midAngle = startAngle + (endAngle - startAngle) / 2;
            currentAngle = endAngle;

            return {
                color: getSliceColor(slice, index),
                endAngle,
                index,
                label: valueFormatter ? valueFormatter(slice.value, slice, index) : slice.value,
                midAngle,
                path: createSlicePath(center, radius, startAngle, endAngle),
                startAngle,
                value: slice.value,
            };
        });
    }, [center, data, radius, valueFormatter]);

    const hasSlices = slices.length > 0;
    const labelRadius = radius * 0.58;
    const outsideLabelRadius = radius + outsidePadding * 0.58;
    const leaderStartRadius = radius + gap / 2;
    const leaderEndRadius = radius + outsidePadding * 0.35;
    const normalizedGap = Math.max(0, gap);
    const showValues = valuePosition !== 'none';

    return (
        <div className={`pie-chart pie-chart--${size} pie-chart--values-${valuePosition} ${className}`.trim()}>
            <svg width={chartSize} height={chartSize} viewBox={viewBox} role="img" aria-label={ariaLabel}>
                {!hasSlices && (
                    <>
                        <circle className="pie-chart__empty-circle" cx={center} cy={center} r={radius} />
                        {showValues && emptyLabel && (
                            <text className="pie-chart__empty-label" x={center} y={center} textAnchor="middle" dominantBaseline="central">
                                {emptyLabel}
                            </text>
                        )}
                    </>
                )}

                {hasSlices &&
                    (slices.length === 1 ? (
                        <circle className="pie-chart__slice" cx={center} cy={center} r={radius} fill={slices[0].color} strokeWidth={normalizedGap} />
                    ) : (
                        slices.map(slice => (
                            <path
                                key={`${slice.index}-${slice.value}-${slice.startAngle}`}
                                className="pie-chart__slice"
                                d={slice.path}
                                fill={slice.color}
                                strokeWidth={normalizedGap}
                            />
                        ))
                    ))}

                {hasSlices &&
                    showValues &&
                    valuePosition === 'outside' &&
                    slices.map(slice => {
                        const leaderStart = polarToCartesian(center, center, leaderStartRadius, slice.midAngle);
                        const leaderEnd = polarToCartesian(center, center, leaderEndRadius, slice.midAngle);
                        const labelPosition = polarToCartesian(center, center, outsideLabelRadius, slice.midAngle);
                        const isRightSide = labelPosition.x >= center;

                        return (
                            <g key={`outside-${slice.index}-${slice.value}`} className="pie-chart__outside-label-group">
                                <line
                                    className="pie-chart__leader-line"
                                    x1={leaderStart.x}
                                    y1={leaderStart.y}
                                    x2={leaderEnd.x}
                                    y2={leaderEnd.y}
                                    stroke={slice.color}
                                />
                                <text
                                    className="pie-chart__value-label pie-chart__value-label--outside"
                                    x={labelPosition.x}
                                    y={labelPosition.y}
                                    textAnchor={isRightSide ? 'start' : 'end'}
                                    dominantBaseline="central"
                                    fill={slice.color}
                                >
                                    {slice.label}
                                </text>
                            </g>
                        );
                    })}

                {hasSlices &&
                    showValues &&
                    valuePosition === 'inside' &&
                    slices.map(slice => {
                        const position = slices.length === 1 ? { x: center, y: center } : polarToCartesian(center, center, labelRadius, slice.midAngle);

                        return (
                            <text
                                key={`inside-${slice.index}-${slice.value}`}
                                className="pie-chart__value-label pie-chart__value-label--inside"
                                x={position.x}
                                y={position.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                            >
                                {slice.label}
                            </text>
                        );
                    })}
            </svg>
        </div>
    );
};
