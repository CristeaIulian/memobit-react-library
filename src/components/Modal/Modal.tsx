import React, { FC, MouseEvent, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useComponentEffect } from '../../hooks/useComponentEffect';
import { Button, ButtonVariant } from '../Button';

import './Modal.scss';

export interface ModalButtonConfig {
    text: string;
    onClick: () => void;
    icon?: string;
    variant?: ButtonVariant;
    disabled?: boolean;
}

interface ModalProps {
    children?: ReactNode;
    className?: string;
    isOpen: boolean;
    onClose?: () => void;
    onOverlayClick?: (event: MouseEvent) => void;
    primaryButton?: ModalButtonConfig;
    secondaryButton?: ModalButtonConfig;
    size?: 'small' | 'medium' | 'large' | 'auto';
    title?: string;
}

export const Modal: FC<ModalProps> = ({
    children,
    className,
    isOpen,
    onClose,
    onOverlayClick,
    primaryButton,
    secondaryButton,
    size = 'auto',
    title,
}: ModalProps): ReactElement | null => {
    const effectClass = useComponentEffect('Modal');
    useBodyScrollLock(isOpen);

    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [positionMode, setPositionMode] = useState<'center' | 'top'>('center');

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && onClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const hasFooter = primaryButton || secondaryButton;

    return (
        <div ref={overlayRef} className="modal-overlay" onClick={onOverlayClick}>
            <div ref={modalRef} className={`modal modal--${size} ${className || ''} ${effectClass}`} onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h2>{title}</h2>
                    <Button variant="plain" prefixIcon="✖" onClick={onClose}></Button>
                </div>
                {children}
                {hasFooter && (
                    <div className="modal__footer">
                        {primaryButton && (
                            <Button
                                variant={primaryButton.variant || 'success'}
                                prefixIcon={primaryButton.icon}
                                onClick={primaryButton.onClick}
                                disabled={primaryButton.disabled}
                            >
                                {primaryButton.text}
                            </Button>
                        )}
                        {secondaryButton && (
                            <Button
                                variant={secondaryButton.variant || 'default'}
                                prefixIcon={secondaryButton.icon}
                                onClick={secondaryButton.onClick}
                                disabled={secondaryButton.disabled}
                            >
                                {secondaryButton.text}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
