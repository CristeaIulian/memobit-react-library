import React, { MouseEvent } from 'react';

import './Button.scss';

export type ButtonVariant = 'plain' | 'ghost' | 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface ButtonProps {
    ariaLabel?: string;
    borders?: 'sharp' | 'rounded';
    children?: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    prefixIcon?: string;
    size?: 'small' | 'medium' | 'large';
    style?: React.CSSProperties;
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
                    {prefixIcon && <span>{prefixIcon}</span>}
                    {children && <span>{children}</span>}
                    {sufixIcon && <span>{sufixIcon}</span>}
                </>
            )}
        </button>
    );
};
