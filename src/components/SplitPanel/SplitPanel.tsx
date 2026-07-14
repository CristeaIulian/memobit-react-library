import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Tooltip } from '../Tooltip';

import './SplitPanel.scss';

interface SplitPanelProps {
    /** Left pane content (main page) */
    children: React.ReactNode;
    /** Right pane content (detail panel) */
    panel: React.ReactNode;
    isPanelOpen: boolean;
    onPanelClose: () => void;
    /** Optional title shown in the right pane header */
    panelTitle?: string;
    /** Initial left pane width as a percentage (default: 55) */
    defaultLeftPercent?: number;
    /** Minimum left pane width percentage (default: 25) */
    minLeftPercent?: number;
    /** Minimum right pane width percentage (default: 20) */
    minRightPercent?: number;
    className?: string;
}

export const SplitPanel: React.FC<SplitPanelProps> = ({
    children,
    panel,
    isPanelOpen,
    onPanelClose,
    panelTitle,
    defaultLeftPercent = 55,
    minLeftPercent = 25,
    minRightPercent = 20,
    className = '',
}) => {
    const [leftPercent, setLeftPercent] = useState(defaultLeftPercent);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    // Lock body scroll when panel is open so both panes scroll independently
    useEffect(() => {
        if (isPanelOpen) {
            document.body.classList.add('split-panel-active');
        } else {
            document.body.classList.remove('split-panel-active');
        }
        return () => {
            document.body.classList.remove('split-panel-active');
        };
    }, [isPanelOpen]);

    const handleDividerMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            isDragging.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            const handleMouseMove = (moveEvent: MouseEvent) => {
                if (!isDragging.current || !containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                const rawPercent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                const clamped = Math.max(minLeftPercent, Math.min(100 - minRightPercent, rawPercent));
                setLeftPercent(clamped);
            };

            const handleMouseUp = () => {
                isDragging.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        },
        [minLeftPercent, minRightPercent],
    );

    // Escape key closes the panel
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isPanelOpen) onPanelClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isPanelOpen, onPanelClose]);

    if (!isPanelOpen) {
        return <div className={`split-panel ${className}`}>{children}</div>;
    }

    return (
        <div className={`split-panel split-panel--open ${className}`} ref={containerRef}>
            <div className="split-panel__left" style={{ width: `${leftPercent}%` }}>
                {children}
            </div>

            <div className="split-panel__divider" onMouseDown={handleDividerMouseDown}>
                <div className="split-panel__divider-handle" />
            </div>

            <div className="split-panel__right">
                <div className="split-panel__right-header">
                    {panelTitle && <h2 className="split-panel__right-title">{panelTitle}</h2>}
                    <Tooltip title="Close panel">
                        <button className="split-panel__close" onClick={onPanelClose}>
                            ✕
                        </button>
                    </Tooltip>
                </div>
                <div className="split-panel__right-content">{panel}</div>
            </div>
        </div>
    );
};
