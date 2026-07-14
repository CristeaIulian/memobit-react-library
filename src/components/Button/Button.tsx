import React, { MouseEvent } from 'react';

import { Icon, IconName, IconVariant } from '../Icon';

import './Button.scss';

export type ButtonVariant = 'plain' | 'ghost' | 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface ButtonProps {
    borders?: 'sharp' | 'rounded';
    children?: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    /** Icon rendered before children. Accepts an IconName string or a ReactElement. */
    icon?: IconName | React.ReactElement;
    iconVariant?: IconVariant;
    loading?: boolean;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    emojiIcon?: string;
    size?: 'small' | 'medium' | 'large';
    style?: React.CSSProperties;
    /** Icon rendered after children. Accepts an IconName string or a ReactElement. */
    sufixIcon?: IconName | React.ReactElement;
    type?: 'button' | 'submit' | 'reset';
    title?: string;
    variant?: ButtonVariant;
}

export interface ExternalButtonConfig extends ButtonProps {
    text: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    borders = 'rounded',
    children,
    className,
    disabled = false,
    fullWidth = false,
    icon,
    iconVariant = 'default',
    loading = false,
    onClick,
    emojiIcon,
    size = 'medium',
    style,
    sufixIcon,
    title,
    type = 'button',
    variant = 'default',
}, ref) => {
    return (
        <button
            ref={ref}
            className={`button button-${size} button-${variant} ${borders === 'rounded' ? 'button-rounded' : ''} ${fullWidth ? 'is-full-width' : ''} ${className || ''}`}
            disabled={disabled}
            onClick={onClick}
            style={style}
            title={title}
            type={type}
        >
            {loading ? (
                <>
                    <span className="button__spinner"></span>
                    <span>{children || 'Loading...'}</span>
                </>
            ) : (
                <>
                    {icon !== undefined && (typeof icon === 'string' ? <Icon size="lg" name={icon} variant={iconVariant} /> : icon)}
                    {emojiIcon && <span>{emojiIcon}</span>}
                    {children && <span>{children}</span>}
                    {sufixIcon !== undefined && (typeof sufixIcon === 'string' ? <Icon size="lg" name={sufixIcon} variant={iconVariant} /> : sufixIcon)}
                </>
            )}
        </button>
    );
});

Button.displayName = 'Button';
