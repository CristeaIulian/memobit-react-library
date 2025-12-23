import React, { FC, ReactNode } from 'react';

import './Badge.scss';

export type BadgeVariant = 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface BadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
    className?: string;
}

export const Badge: FC<BadgeProps> = ({ variant = 'default', children, className = '' }: BadgeProps) => {
    return <span className={`badge badge--${variant} ${className}`}>{children}</span>;
};
