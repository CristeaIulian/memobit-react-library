import type { CSSProperties } from 'react';

interface ChartTooltipStyle {
    contentStyle: CSSProperties;
    itemStyle: CSSProperties;
    labelStyle: CSSProperties;
}

// Theme-aware styling for chart tooltips (e.g. recharts' <Tooltip {...chartTooltipStyle} />),
// so every app's charts follow the active theme instead of hardcoding colors.
export const chartTooltipStyle: ChartTooltipStyle = {
    contentStyle: {
        backgroundColor: 'var(--tooltip-background-color)',
        border: '1px solid var(--tooltip-border-color)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--tooltip-color)',
    },
    itemStyle: { color: 'var(--tooltip-color)' },
    labelStyle: { color: 'var(--tooltip-color)' },
};

// Axis / grid colors for chart primitives that take plain color props.
export const chartColors = {
    axis: 'var(--body-color-muted)',
    grid: 'var(--border-color)',
    text: 'var(--body-color)',
} as const;
