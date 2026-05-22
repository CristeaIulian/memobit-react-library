import React, { type ReactNode } from 'react';

import { Button } from '../Button';

import './StickyBar.scss';

export type StickyBarPosition = 'top' | 'bottom';
export type StickyBarAlign = 'start' | 'center' | 'end' | 'between';

export interface StickyBarProps {
    children: ReactNode;
    /** Edge the bar sticks to. Default: 'bottom'. */
    position?: StickyBarPosition;
    /** Horizontal distribution of children. Default: 'between'. */
    align?: StickyBarAlign;
    /** When false the bar is not rendered. Default: true. */
    visible?: boolean;
    /** When provided, a close button is rendered that calls this handler. */
    onClose?: () => void;
    closeLabel?: string;
    /** Pixel offset from the edge, used to stack multiple bars. Default: 0. */
    offset?: number;
    className?: string;
}

export const StickyBar: React.FC<StickyBarProps> = ({
    children,
    position = 'bottom',
    align = 'between',
    visible = true,
    onClose,
    closeLabel = 'Close',
    offset = 0,
    className,
}) => {
    if (!visible) return null;

    const rootClassName = ['sticky-bar', `sticky-bar--${position}`, `sticky-bar--align-${align}`, className].filter(Boolean).join(' ');
    const style = offset ? { [position]: `${offset}px` } : undefined;

    return (
        <div className={rootClassName} style={style}>
            <div className="sticky-bar__content">{children}</div>
            {onClose && (
                <Button className="sticky-bar__close" icon="clear" onClick={onClose} size="small" variant="ghost" title={closeLabel}>
                    {closeLabel}
                </Button>
            )}
        </div>
    );
};
