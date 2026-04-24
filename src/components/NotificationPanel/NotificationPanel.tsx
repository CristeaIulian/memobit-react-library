import { type CSSProperties, type FC, type ReactElement, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import './NotificationPanel.scss';

export interface NotificationPanelItem {
    id: string;
    severity: 'critical' | 'warning';
    message: string;
}

interface NotificationPanelProps {
    items: NotificationPanelItem[];
    buttonLabel?: string;
    panelTitle?: string;
    emptyMessage?: string;
}

export const NotificationPanel: FC<NotificationPanelProps> = ({
    items,
    buttonLabel = 'Alerts',
    panelTitle = 'Notifications',
    emptyMessage = 'No active notifications.',
}): ReactElement => {
    const [isOpen, setIsOpen] = useState(false);
    const [panelStyle, setPanelStyle] = useState<CSSProperties>({ opacity: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const hasCritical = items.some(a => a.severity === 'critical');

    useEffect(() => {
        if (!isOpen || !buttonRef.current || !panelRef.current) return;

        const frameId = requestAnimationFrame(() => {
            if (!buttonRef.current || !panelRef.current) return;

            const btnRect = buttonRef.current.getBoundingClientRect();
            const panelRect = panelRef.current.getBoundingClientRect();
            const vw = document.documentElement.clientWidth;
            const vh = document.documentElement.clientHeight;
            const padding = 8;

            let top = btnRect.bottom + padding;
            let left = btnRect.right - panelRect.width;

            if (left < padding) left = padding;
            if (left + panelRect.width > vw - padding) left = vw - panelRect.width - padding;
            if (top + panelRect.height > vh - padding) top = btnRect.top - panelRect.height - padding;
            if (top < padding) top = padding;

            setPanelStyle({ position: 'fixed', top, left, opacity: 1 });
        });

        return () => cancelAnimationFrame(frameId);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen]);

    const toggle = () => {
        setPanelStyle({ opacity: 0 });
        setIsOpen(prev => !prev);
    };

    return (
        <div className="NotificationPanel">
            <button
                ref={buttonRef}
                type="button"
                className={`NotificationPanel__button${hasCritical ? ' NotificationPanel__button--critical' : ''}`}
                onClick={toggle}
            >
                {buttonLabel}
                {items.length > 0 && <span className="NotificationPanel__badge">{items.length}</span>}
            </button>

            {isOpen &&
                createPortal(
                    <>
                        <div className="NotificationPanel__backdrop" onClick={() => setIsOpen(false)} />
                        <div ref={panelRef} className="NotificationPanel__panel" style={panelStyle}>
                            <h4 className="NotificationPanel__title">{panelTitle}</h4>
                            {items.length === 0 ? (
                                <p className="NotificationPanel__empty">{emptyMessage}</p>
                            ) : (
                                <ul className="NotificationPanel__list">
                                    {items.map(item => (
                                        <li
                                            key={item.id}
                                            className={`NotificationPanel__item${item.severity === 'critical' ? ' NotificationPanel__item--critical' : ''}`}
                                        >
                                            {item.message}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>,
                    document.body
                )}
        </div>
    );
};
