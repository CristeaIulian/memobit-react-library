import React, { MouseEvent } from 'react';

import './Button.scss';

interface ButtonProps {
    borders?: 'sharp' | 'rounded';
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    prefixIcon?: string;
    size?: 'small' | 'medium' | 'large';
    type?: 'button' | 'submit' | 'reset';
    title?: string;
    variant?: 'plain' | 'default' | 'success' | 'info' | 'warning' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({
    borders = 'rounded',
    children,
    className,
    disabled = false,
    loading = false,
    onClick,
    prefixIcon,
    variant = 'default',
    size = 'medium',
    title,
    type = 'button',
}: ButtonProps) => {
    return (
        <button
            className={`button button-${size} button-${variant} ${borders === 'rounded' ? 'button-rounded' : ''} ${className || ''}`}
            disabled={disabled}
            onClick={onClick}
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
                </>
            )}
        </button>
    );
};
