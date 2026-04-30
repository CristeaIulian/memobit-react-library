import { FC, MouseEvent, ReactElement, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useComponentEffect } from '../../hooks/useComponentEffect';
import { Button, type ExternalButtonConfig } from '../Button';
import { Icon, IconName } from '../Icon';

import './Modal.scss';

interface ModalProps {
    children?: ReactNode;
    className?: string;
    isOpen: boolean;
    onClose?: () => void;
    onOverlayClick?: (event: MouseEvent) => void;
    primary?: ExternalButtonConfig;
    secondary?: ExternalButtonConfig;
    size?: 'small' | 'medium' | 'large' | 'auto';
    tertiary?: ExternalButtonConfig;
    title?: string;
    titleIcon?: IconName;
    usePortal?: boolean;
}

export const Modal: FC<ModalProps> = ({
    children,
    className,
    isOpen,
    onClose,
    onOverlayClick,
    primary,
    secondary,
    size = 'auto',
    tertiary,
    title,
    titleIcon,
    usePortal = false,
}: ModalProps): ReactElement | null => {
    const effectClass = useComponentEffect('Modal');
    useBodyScrollLock(isOpen);

    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

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

    const hasFooter = primary || secondary || tertiary;

    const modalContent = (
        <div ref={overlayRef} className="modal-overlay" onClick={onOverlayClick}>
            <div ref={modalRef} className={`modal modal--${size} ${className || ''} ${effectClass}`} onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h2>
                        {titleIcon ? <Icon name={titleIcon} /> : null} {title}
                    </h2>
                    <Button ariaLabel="Close modal" className="modal__close" onClick={onClose} size="medium" title="Close modal" variant="ghost">
                        &times;
                    </Button>
                </div>
                {children}
                {hasFooter && (
                    <div className="modal__footer">
                        {tertiary && (
                            <Button variant={tertiary.variant || 'default'} icon={tertiary.icon} onClick={tertiary.onClick} disabled={tertiary.disabled}>
                                {tertiary.text}
                            </Button>
                        )}
                        {secondary && (
                            <Button
                                variant={secondary.variant || 'default'}
                                icon={secondary.icon || 'clear'}
                                onClick={secondary.onClick}
                                disabled={secondary.disabled}
                            >
                                {secondary.text}
                            </Button>
                        )}
                        {primary && (
                            <Button
                                variant={primary.variant || 'success'}
                                icon={primary.icon || 'checkmark'}
                                onClick={primary.onClick}
                                disabled={primary.disabled}
                            >
                                {primary.text}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    if (usePortal) {
        return createPortal(modalContent, document.body);
    }

    return modalContent;
};
