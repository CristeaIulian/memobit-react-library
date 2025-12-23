import React, { FC, ReactNode } from 'react';

import './Badge.scss';

export type BadgeVariant = 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface BadgeProps {
    children: ReactNode;
    className?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: BadgeVariant;
}

export const Badge: FC<BadgeProps> = ({ variant = 'default', children, className = '', size = 'medium' }: BadgeProps) => {
    return <span className={`badge badge-variant--${variant} ${className} badge-size--${size}`}>{children}</span>;
};
