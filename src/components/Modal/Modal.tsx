import { FC, MouseEvent, ReactElement, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useComponentEffect } from '../../hooks/useComponentEffect';
import { Button, ButtonProps, ButtonVariant } from '../Button';

import './Modal.scss';

export interface ModalButtonConfig {
    text: string;
    onClick: () => void;
    icon?: string;
    variant?: ButtonVariant;
    disabled?: boolean;
}

interface ModalProps {
    buttons?: ButtonProps[];
    children?: ReactNode;
    className?: string;
    isOpen: boolean;
    onClose?: () => void;
    onOverlayClick?: (event: MouseEvent) => void;
    /** @deprecated Use `buttons` instead. */
    primaryButton?: ModalButtonConfig;
    /** @deprecated Use `buttons` instead. */
    secondaryButton?: ModalButtonConfig;
    /** @deprecated Use `buttons` instead. */
    tertiaryButton?: ModalButtonConfig;
    size?: 'small' | 'medium' | 'large' | 'auto';
    title?: string;
    usePortal?: boolean;
}

export const Modal: FC<ModalProps> = ({
    buttons,
    children,
    className,
    isOpen,
    onClose,
    onOverlayClick,
    primaryButton,
    secondaryButton,
    tertiaryButton,
    size = 'auto',
    title,
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

    const hasFooter = buttons?.length || primaryButton || secondaryButton || tertiaryButton;

    const modalContent = (
        <div ref={overlayRef} className="modal-overlay" onClick={onOverlayClick}>
            <div ref={modalRef} className={`modal modal--${size} ${className || ''} ${effectClass}`} onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h2>{title}</h2>
                    <Button ariaLabel="Close modal" className="modal__close" onClick={onClose} size="medium" title="Close modal" variant="ghost">
                        &times;
                    </Button>
                </div>
                {children}
                {hasFooter && (
                    <div className="modal__footer">
                        {buttons?.map(({ children: label, ...btnProps }, i) => (
                            <Button key={i} {...btnProps}>{label}</Button>
                        ))}
                        {tertiaryButton && (
                            <Button
                                variant={tertiaryButton.variant || 'default'}
                                prefixIcon={tertiaryButton.icon}
                                onClick={tertiaryButton.onClick}
                                disabled={tertiaryButton.disabled}
                            >
                                {tertiaryButton.text}
                            </Button>
                        )}
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

    if (usePortal) {
        return createPortal(modalContent, document.body);
    }

    return modalContent;
};
