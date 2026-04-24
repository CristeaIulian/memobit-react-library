import React, { MouseEvent } from 'react';

import { Icon, IconName } from '../Icon';

import './Button.scss';

export type ButtonVariant = 'plain' | 'ghost' | 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface ButtonProps {
    ariaLabel?: string;
    borders?: 'sharp' | 'rounded';
    children?: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    /** Icon rendered before children. Accepts an IconName string or a ReactElement. */
    icon?: IconName | React.ReactElement;
    loading?: boolean;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /** @deprecated Use `icon` instead. */
    prefixIcon?: string;
    size?: 'small' | 'medium' | 'large';
    style?: React.CSSProperties;
    /** @deprecated Use `icon` instead. */
    sufixIcon?: string;
    type?: 'button' | 'submit' | 'reset';
    title?: string;
    variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
    ariaLabel,
    borders = 'rounded',
    children,
    className,
    disabled = false,
    fullWidth = false,
    icon,
    loading = false,
    onClick,
    prefixIcon,
    variant = 'default',
    style,
    sufixIcon,
    size = 'medium',
    title,
    type = 'button',
}: ButtonProps) => {
    return (
        <button
            aria-label={ariaLabel}
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
                    {icon !== undefined && (typeof icon === 'string' ? <Icon name={icon} /> : icon)}
                    {prefixIcon && <span>{prefixIcon}</span>}
                    {children && <span>{children}</span>}
                    {sufixIcon && <span>{sufixIcon}</span>}
                </>
            )}
        </button>
    );
};
