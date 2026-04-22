import React, { useEffect } from 'react';

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Button, ButtonProps } from '../Button';

import './Drawer.scss';

export type DrawerPosition = 'left' | 'right';

export interface DrawerHeaderAction {
    id: string;
    label?: string;
    icon?: string;
    title?: string;
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
    disabled?: boolean;
    onClick?: ButtonProps['onClick'];
}

export interface DrawerFooterButton {
    text: string;
    onClick?: ButtonProps['onClick'];
    icon?: string;
    variant?: ButtonProps['variant'];
    disabled?: boolean;
}

export interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    position?: DrawerPosition;
    /** CSS width for the drawer. Accepts any CSS length or expression. */
    width?: string;
    /** Optional CSS max-width for responsive drawers. */
    maxWidth?: string | number;
    margin?: string | number;
    borderRadius?: string | number;
    shadow?: string;
    children: React.ReactNode;
    title?: string;
    className?: string;
    showOverlay?: boolean;
    actions?: DrawerHeaderAction[];
    footer?: React.ReactNode;
    primaryButton?: DrawerFooterButton;
    secondaryButton?: DrawerFooterButton;
    tertiaryButton?: DrawerFooterButton;
}

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    position = 'left',
    width = '320px',
    maxWidth = 'none',
    margin = 0,
    borderRadius = 0,
    shadow = 'none',
    children,
    title,
    className = '',
    showOverlay = true,
    actions = [],
    footer,
    primaryButton,
    secondaryButton,
    tertiaryButton,
}) => {
    useBodyScrollLock(isOpen);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const formatCssValue = (value: string | number): string => (typeof value === 'number' ? `${value}px` : value);
    const drawerStyle = {
        '--drawer-width': width,
        '--drawer-max-width': formatCssValue(maxWidth),
        '--drawer-margin': formatCssValue(margin),
        '--drawer-border-radius': formatCssValue(borderRadius),
        '--drawer-shadow': shadow,
    } as React.CSSProperties;
    const hasFooter = footer || primaryButton || secondaryButton || tertiaryButton;

    return (
        <>
            {showOverlay && <div className="drawer-overlay" onClick={onClose} />}
            <div className={`drawer drawer--${position} ${className}`} style={drawerStyle}>
                <div className="drawer__header">
                    {title && <h2 className="drawer__title">{title}</h2>}
                    {actions.length > 0 && (
                        <div className="drawer__header-actions">
                            {actions.map(action => (
                                <Button
                                    key={action.id}
                                    disabled={action.disabled}
                                    onClick={action.onClick}
                                    prefixIcon={action.icon}
                                    size={action.size ?? 'small'}
                                    title={action.title ?? action.label}
                                    variant={action.variant ?? 'ghost'}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    )}
                    <Button ariaLabel="Close drawer" className="drawer__close" onClick={onClose} size="medium" title="Close drawer" variant="ghost">
                        &times;
                    </Button>
                </div>
                <div className="drawer__content">{children}</div>
                {hasFooter && (
                    <div className="drawer__footer">
                        {footer && <div className="drawer__footer-content">{footer}</div>}
                        {(tertiaryButton || secondaryButton || primaryButton) && (
                            <div className="drawer__footer-actions">
                                {tertiaryButton && (
                                    <Button
                                        disabled={tertiaryButton.disabled}
                                        onClick={tertiaryButton.onClick}
                                        prefixIcon={tertiaryButton.icon}
                                        variant={tertiaryButton.variant ?? 'default'}
                                    >
                                        {tertiaryButton.text}
                                    </Button>
                                )}
                                {secondaryButton && (
                                    <Button
                                        disabled={secondaryButton.disabled}
                                        onClick={secondaryButton.onClick}
                                        prefixIcon={secondaryButton.icon}
                                        variant={secondaryButton.variant ?? 'default'}
                                    >
                                        {secondaryButton.text}
                                    </Button>
                                )}
                                {primaryButton && (
                                    <Button
                                        disabled={primaryButton.disabled}
                                        onClick={primaryButton.onClick}
                                        prefixIcon={primaryButton.icon}
                                        variant={primaryButton.variant ?? 'success'}
                                    >
                                        {primaryButton.text}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
