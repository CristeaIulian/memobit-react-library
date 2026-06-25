import React, { ReactNode } from 'react';

import { Icon, IconName } from '../Icon';

import './Chip.scss';

export type ChipVariant = 'plain' | 'default' | 'success' | 'info' | 'warning' | 'danger';
export type ChipSize = 'xsmall' | 'small' | 'medium' | 'large';

export interface ChipProps {
    children: ReactNode;
    className?: string;
    color?: string;
    count?: number | string;
    disabled?: boolean;
    icon?: IconName;
    onClick?: () => void;
    selected?: boolean;
    size?: ChipSize;
    title?: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: ChipVariant;
}

export const Chip: React.FC<ChipProps> = ({
    children,
    className = '',
    color,
    count,
    disabled = false,
    icon,
    onClick,
    selected = false,
    size = 'medium',
    title,
    type = 'button',
    variant = 'default',
}) => (
    <button
        className={`chip chip--${size} ${color ? 'chip--custom' : `chip--${variant}`} ${selected ? 'chip--selected' : ''} ${className}`}
        disabled={disabled}
        onClick={onClick}
        style={color ? ({ '--chip-color': color } as React.CSSProperties) : undefined}
        title={title}
        type={type}
    >
        {color && <span className="chip__swatch" style={{ backgroundColor: color }} />}
        {icon && <Icon name={icon} />}
        <span className="chip__label">{children}</span>
        {count !== undefined && <span className="chip__count">{count}</span>}
    </button>
);
