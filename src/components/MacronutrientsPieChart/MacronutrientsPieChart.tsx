import React from 'react';

interface MacronutrientData {
    carbs: number;
    proteins: number;
    lipids: number;
}

interface Position {
    x: number;
    y: number;
}

interface ExternalPosition {
    leaderStart: Position;
    leaderEnd: Position;
    labelPos: Position;
}

interface Macro {
    value: number;
    color: string;
    angle: number;
}

interface PieSlice {
    path: string;
    color: string;
    value: number;
    isLarge: boolean;
    internalPos: Position | null;
    externalPos: ExternalPosition | null;
    angle: number;
}

interface MacronutrientPieChartProps {
    data: MacronutrientData;
    size?: number;
}

export const MacronutrientsPieChart: React.FC<MacronutrientPieChartProps> = ({ data, size = 40 }) => {
    const { carbs, proteins, lipids } = data;
    const total = carbs + proteins + lipids;

    // If no data, show empty circle
    if (total === 0) {
        return (
            <div style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill="#f0f0f0" stroke="#ddd" strokeWidth="1" />
                </svg>
            </div>
        );
    }

    // Create array of non-zero macros only
    const nonZeroMacros: Macro[] = [];
    if (carbs > 0) nonZeroMacros.push({ value: carbs, color: '#f5909a', angle: 0 });
    if (proteins > 0) nonZeroMacros.push({ value: proteins, color: '#30aeb6', angle: 0 });
    if (lipids > 0) nonZeroMacros.push({ value: lipids, color: '#e99d67', angle: 0 });

    // If no non-zero values, show empty circle
    if (nonZeroMacros.length === 0) {
        return (
            <div style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill="#f0f0f0" stroke="#ddd" strokeWidth="1" />
                </svg>
            </div>
        );
    }

    // Calculate total from non-zero values only
    const nonZeroTotal = nonZeroMacros.reduce((sum, macro) => sum + macro.value, 0);

    // Calculate angles based on non-zero values only
    nonZeroMacros.forEach(macro => {
        macro.angle = (macro.value / nonZeroTotal) * 360;
    });

    // Function to create SVG path for pie slice
    const createArcPath = (startAngle: number, endAngle: number) => {
        const radius = size / 2 - 6; // Leave some space for external labels
        const start = polarToCartesian(size / 2, size / 2, radius, endAngle);
        const end = polarToCartesian(size / 2, size / 2, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        return ['M', size / 2, size / 2, 'L', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y, 'Z'].join(' ');
    };

    // Helper function to convert polar coordinates to cartesian
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    };

    // Function to determine if slice is large enough for internal text
    const isSliceLargeEnough = (angle: number) => {
        // Base threshold on both angle and actual size
        const minAngle = 25; // Minimum angle in degrees
        const minPixelWidth = size * 0.15; // Minimum width in pixels
        const slicePixelWidth = (angle / 360) * (2 * Math.PI * (size / 4)); // Approximate arc length

        return angle >= minAngle && slicePixelWidth >= minPixelWidth;
    };

    // Function to get internal label position
    const getInternalPosition = (startAngle: number, endAngle: number) => {
        const midAngle = (startAngle + endAngle) / 2;
        const textRadius = (size / 2 - 6) * 0.6; // 60% from center
        return polarToCartesian(size / 2, size / 2, textRadius, midAngle);
    };

    // Function to get external label and leader line positions
    const getExternalPosition = (startAngle: number, endAngle: number) => {
        const midAngle = (startAngle + endAngle) / 2;
        const pieRadius = size / 2 - 6;
        const leaderStartRadius = pieRadius;
        const leaderEndRadius = pieRadius + 4;
        const labelRadius = pieRadius + 12; // Increased distance to avoid overlap

        const leaderStart = polarToCartesian(size / 2, size / 2, leaderStartRadius, midAngle);
        const leaderEnd = polarToCartesian(size / 2, size / 2, leaderEndRadius, midAngle);
        const labelPos = polarToCartesian(size / 2, size / 2, labelRadius, midAngle);

        return {
            leaderStart,
            leaderEnd,
            labelPos,
        };
    };

    let currentAngle = 0;
    const slices: PieSlice[] = [];

    // Create slices only from non-zero macros
    nonZeroMacros.forEach(macro => {
        const isLarge = isSliceLargeEnough(macro.angle);
        const internalPos = isLarge ? getInternalPosition(currentAngle, currentAngle + macro.angle) : null;
        const externalPos = !isLarge ? getExternalPosition(currentAngle, currentAngle + macro.angle) : null;

        slices.push({
            path: createArcPath(currentAngle, currentAngle + macro.angle),
            color: macro.color,
            value: macro.value,
            isLarge,
            internalPos,
            externalPos,
            angle: macro.angle,
        });
        currentAngle += macro.angle;
    });

    const viewBoxSize = size + 24; // Extra space for external labels with more spacing

    return (
        <div style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`-12 -12 ${viewBoxSize} ${viewBoxSize}`}>
                {/* Render slices */}
                {slices.map((slice, index) => (
                    <path key={index} d={slice.path} fill={slice.color} stroke="white" strokeWidth="1" />
                ))}

                {/* Render leader lines for external labels */}
                {slices.map((slice, index) =>
                    slice.externalPos ? (
                        <line
                            key={`leader-${index}`}
                            x1={slice.externalPos.leaderStart.x}
                            y1={slice.externalPos.leaderStart.y}
                            x2={slice.externalPos.leaderEnd.x}
                            y2={slice.externalPos.leaderEnd.y}
                            stroke={slice.color}
                            strokeWidth="1.5"
                        />
                    ) : null
                )}

                {/* Render internal labels for large slices */}
                {slices.map((slice, index) =>
                    slice.isLarge && slice.internalPos ? (
                        <text
                            key={`internal-${index}`}
                            x={slice.internalPos.x}
                            y={slice.internalPos.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={Math.max(size / 5, 8)}
                            fill="#222"
                            fontWeight="bold"
                        >
                            {slice.value.toFixed(1)}
                        </text>
                    ) : null
                )}

                {/* Render external labels for small slices */}
                {slices.map((slice, index) =>
                    !slice.isLarge && slice.externalPos ? (
                        <text
                            key={`external-${index}`}
                            x={slice.externalPos.labelPos.x}
                            y={slice.externalPos.labelPos.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={Math.max(size / 5, 7)}
                            fill={slice.color}
                            fontWeight="bold"
                        >
                            {slice.value.toFixed(1)}
                        </text>
                    ) : null
                )}
            </svg>
        </div>
    );
};
