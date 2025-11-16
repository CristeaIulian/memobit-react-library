import { type ReactElement, type CSSProperties } from 'react';

import { createPortal } from 'react-dom';

import './ContextMenu.scss';

interface ContextMenuProps {
    target: EventTarget;
    onClose?: () => void;
    children: ReactElement;
}

export const ContextMenu = ({ target, onClose, children }: ContextMenuProps) => {
    if (!target) {
        return null;
    }

    const rect = (target as Element).getBoundingClientRect();

    const menuStyle: CSSProperties = {
        top: rect.bottom + 'px',
        left: rect.left + 'px',
    };

    return createPortal(
        <>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999,
                }}
                className="memobit-context-menu-back-drop"
                onClick={onClose}
            />
            <div className="memobit-context-menu" style={menuStyle}>
                {children}
            </div>
        </>,
        document.body
    );
};
