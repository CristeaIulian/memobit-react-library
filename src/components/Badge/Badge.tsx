import { FC, ReactNode } from 'react';

import './Badge.scss';

export type BadgeVariant = 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface BadgeProps {
    children: ReactNode;
    className?: string;
    size?: 'xsmall' | 'small' | 'medium';
    variant?: BadgeVariant;
    /** Custom accent color — overrides variant, drives border/bg/hover/active styles */
    customColor?: string;
    isActive?: boolean;
    onClick?: () => void;
    onClear?: () => void;
}

export const Badge: FC<BadgeProps> = ({ variant = 'default', children, className = '', size = 'medium', customColor, isActive, onClick, onClear }: BadgeProps) => {
    const activeClass = isActive !== undefined ? (isActive ? 'badge--active' : 'badge--inactive') : '';
    const clickableClass = onClick ? 'badge--clickable' : '';
    const variantClass = customColor ? 'badge-variant--custom' : `badge-variant--${variant}`;
    const style = customColor ? { '--badge-custom-color': customColor } as React.CSSProperties : undefined;

    return (
        <span
            className={`badge ${variantClass} ${className} badge-size--${size} ${activeClass} ${clickableClass}`}
            style={style}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
        >
            {children}
            {onClear && (
                <button
                    className="badge__clear"
                    onClick={(e) => { e.stopPropagation(); onClear(); }}
                    title="Remove"
                >
                    ×
                </button>
            )}
        </span>
    );
};
