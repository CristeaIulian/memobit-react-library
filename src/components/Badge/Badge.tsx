import { FC, KeyboardEvent, MouseEvent, ReactNode } from 'react';

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
    onClick?: (event: MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>) => void;
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
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onClick(e);
                          }
                      }
                    : undefined
            }
        >
            {children}
            {onClear && (
                <button
                    className="badge__clear"
                    onClick={e => {
                        e.stopPropagation();
                        onClear();
                    }}
                    type="button"
                    title="Remove"
                >
                    ×
                </button>
            )}
        </span>
    );
};
