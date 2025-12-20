import React from 'react';
import './Separator.scss';

export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorStyle = 'solid' | 'dashed' | 'dotted';
export type SeparatorAlign = 'left' | 'center' | 'right';

export interface SeparatorProps {
    orientation?: SeparatorOrientation;
    style?: SeparatorStyle;
    thickness?: number;
    spacing?: number;
    label?: string;
    labelAlign?: SeparatorAlign;
    className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({
    orientation = 'horizontal',
    style = 'solid',
    thickness = 1,
    spacing = 16,
    label,
    labelAlign = 'center',
    className = '',
}: SeparatorProps) => {
    const separatorClass = `separator separator--${orientation} separator--${style} ${className}`;

    const separatorStyle: React.CSSProperties = {
        borderWidth: `${thickness}px`,
        ...(orientation === 'horizontal'
            ? { marginTop: `${spacing}px`, marginBottom: `${spacing}px` }
            : { marginLeft: `${spacing}px`, marginRight: `${spacing}px` }),
    };

    if (label && orientation === 'horizontal') {
        const alignClass = `separator--align-${labelAlign}`;
        return (
            <div className={`${separatorClass} separator--with-label ${alignClass}`}>
                <div className="separator__line" style={separatorStyle} />
                <span className="separator__label">{label}</span>
                <div className="separator__line" style={separatorStyle} />
            </div>
        );
    }

    return <div className={separatorClass} style={separatorStyle} />;
};
