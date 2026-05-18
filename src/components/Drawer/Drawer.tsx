import React, { useEffect } from 'react';

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Button, type ButtonProps, type ExternalButtonConfig } from '../Button';
import { Icon, IconName } from '../Icon';
import { Tooltip } from '../Tooltip';

import './Drawer.scss';

export type DrawerPosition = 'left' | 'right';

export interface DrawerHeaderAction {
    id: string;
    label?: string;
    icon?: IconName;
    emojiIcon?: string;
    title?: string;
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
    disabled?: boolean;
    onClick?: ButtonProps['onClick'];
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
    icon?: IconName;
    className?: string;
    showOverlay?: boolean;
    actions?: DrawerHeaderAction[];
    primary?: ExternalButtonConfig;
    secondary?: ExternalButtonConfig;
    footer?: React.ReactNode;
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
    icon,
    className = '',
    showOverlay = true,
    actions = [],
    primary,
    secondary,
    footer,
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
    const hasFooter = footer || primary || secondary;

    return (
        <>
            {showOverlay && <div className="drawer-overlay" onClick={onClose} />}
            <div className={`drawer drawer--${position} ${className}`} style={drawerStyle}>
                <div className="drawer__header">
                    {(title || icon) && (
                        <h2 className="drawer__title">
                            {icon && <Icon name={icon} />}
                            {title && <span className="drawer__title-text">{title}</span>}
                        </h2>
                    )}
                    {actions.length > 0 && (
                        <div className="drawer__header-actions">
                            {actions.map(action => {
                                const button = (
                                    <Button
                                        disabled={action.disabled}
                                        onClick={action.onClick}
                                        icon={action.icon}
                                        emojiIcon={action.emojiIcon}
                                        size={action.size ?? 'small'}
                                        variant={action.variant ?? 'ghost'}
                                    >
                                        {action.label}
                                    </Button>
                                );
                                const tooltipText = action.title ?? action.label;

                                return tooltipText ? (
                                    <Tooltip key={action.id} title={tooltipText} position="bottom">
                                        {button}
                                    </Tooltip>
                                ) : (
                                    <React.Fragment key={action.id}>{button}</React.Fragment>
                                );
                            })}
                        </div>
                    )}
                    <Button className="drawer__close" onClick={onClose} size="medium" title="Close drawer" variant="ghost">
                        &times;
                    </Button>
                </div>
                <div className="drawer__content">{children}</div>
                {hasFooter && (
                    <div className="drawer__footer">
                        {footer && <div className="drawer__footer-content">{footer}</div>}
                        {(primary || secondary) && (
                            <div className="drawer__footer-actions">
                                {secondary && (
                                    <Button
                                        variant={secondary.variant || 'default'}
                                        icon={secondary.icon}
                                        disabled={secondary.disabled}
                                        onClick={secondary.onClick}
                                    >
                                        {secondary.text}
                                    </Button>
                                )}
                                {primary && (
                                    <Button variant={primary.variant || 'info'} icon={primary.icon} disabled={primary.disabled} onClick={primary.onClick}>
                                        {primary.text}
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
