import React from 'react';

import { Button } from '../Button';

import './Modal.scss';

interface ModalProps {
    children?: React.ReactNode;
    className?: string;
    onClose?: () => void;
    onOverlayClick?: (event: React.MouseEvent) => void;
    size?: 'small' | 'medium' | 'large' | 'auto';
    title?: string;
}

export const Modal: React.FC<ModalProps> = ({ children, className, onClose, onOverlayClick, size = 'auto', title }: ModalProps) => {
    return (
        <div className="modal-overlay" onClick={onOverlayClick}>
            <div className={`modal modal--${size} ${className || ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h2>{title}</h2>
                    <Button variant="plain" prefixIcon="✖" onClick={onClose}></Button>
                </div>

                {children}
            </div>
        </div>
    );
};
