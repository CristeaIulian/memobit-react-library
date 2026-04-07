import { FC, ReactNode } from 'react';

import './Badge.scss';

export type BadgeVariant = 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface BadgeProps {
    children: ReactNode;
    className?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: BadgeVariant;
    isActive?: boolean;
    onClick?: () => void;
}

export const Badge: FC<BadgeProps> = ({ variant = 'default', children, className = '', size = 'medium', isActive, onClick }: BadgeProps) => {
    const activeClass = isActive !== undefined ? (isActive ? 'badge--active' : 'badge--inactive') : '';
    const clickableClass = onClick ? 'badge--clickable' : '';

    return (
        <span
            className={`badge badge-variant--${variant} ${className} badge-size--${size} ${activeClass} ${clickableClass}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
        >
            {children}
        </span>
    );
};
