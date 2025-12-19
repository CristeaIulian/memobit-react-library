import React, { useEffect } from 'react';

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

import './Drawer.scss';

export type DrawerPosition = 'left' | 'right';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    position?: DrawerPosition;
    width?: string;
    children: React.ReactNode;
    title?: string;
    className?: string;
    showOverlay?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    position = 'left',
    width = '320px',
    children,
    title,
    className = '',
    showOverlay = true,
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

    return (
        <>
            {showOverlay && <div className="drawer-overlay" onClick={onClose} />}
            <div className={`drawer drawer--${position} ${className}`} style={{ width }}>
                <div className="drawer__header">
                    {title && <h2 className="drawer__title">{title}</h2>}
                    <button className="drawer__close" onClick={onClose} aria-label="Close drawer">
                        ✕
                    </button>
                </div>
                <div className="drawer__content">{children}</div>
            </div>
        </>
    );
};
