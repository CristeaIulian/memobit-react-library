import React, { MouseEvent } from 'react';

import './Button.scss';

export type BadgeVariant = 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface BadgeProps {
    variant: BadgeVariant;
    children: React.ReactNode;
    className: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }: BadgeProps) => {
    return <span className={`badge badge--${variant} ${className}`}>{children}</span>;
};
