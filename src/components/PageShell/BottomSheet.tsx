import { FC, ReactNode, useEffect } from 'react';

import { createPortal } from 'react-dom';

interface BottomSheetProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    /** Shown before the title, e.g. a back button. */
    start?: ReactNode;
    /** Shown after the title, e.g. "Clear all". */
    end?: ReactNode;
    footer?: ReactNode;
    /** Takes nearly the whole screen instead of growing with its content. */
    tall?: boolean;
    children: ReactNode;
}

/** A phone sheet that slides up from the bottom edge. Escape or a tap on the backdrop closes it. */
export const BottomSheet: FC<BottomSheetProps> = ({ isOpen, title, onClose, start, end, footer, tall = false, children }) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="page-sheet">
            <div className="page-sheet__backdrop" onClick={onClose} />
            <div className={['page-sheet__panel', tall ? 'page-sheet__panel--tall' : ''].filter(Boolean).join(' ')}>
                <span className="page-sheet__grab" />
                <div className="page-sheet__header">
                    {start}
                    <span className="page-sheet__title">{title}</span>
                    {end}
                </div>
                <div className="page-sheet__body">{children}</div>
                {footer && <div className="page-sheet__footer">{footer}</div>}
            </div>
        </div>,
        document.body
    );
};
