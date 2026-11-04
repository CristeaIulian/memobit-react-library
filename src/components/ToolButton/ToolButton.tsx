import { type ReactElement } from 'react';

import type { IconName } from '@memobit/icons';

import { Button } from '../Button';
import { Tooltip, type TooltipPosition } from '../Tooltip';

import './ToolButton.scss';

export interface ToolButtonProps {
    icon: IconName | ReactElement;
    /** What it does, with its shortcut if any ("Rotate right (Ctrl+R)"), shown in a Tooltip. */
    hint: string;
    onClick: () => void;
    disabled?: boolean;
    /** Shown pressed: the current tool, or a toggle that is on. */
    active?: boolean;
    /** Red, for the destructive action of a toolbar. */
    danger?: boolean;
    /** Flips the icon, e.g. to turn a clockwise arrow into the counter-clockwise one. */
    mirrored?: boolean;
    /** A short tag on the icon's corner that sets it apart from the plain action, e.g. "WEB" on a floppy. */
    badge?: string;
    hintPosition?: TooltipPosition;
    className?: string;
}

/** An icon-only toolbar button, its label in a Tooltip rather than a native title. */
export const ToolButton = ({ icon, hint, onClick, disabled, active, danger, mirrored, badge, hintPosition = 'bottom', className }: ToolButtonProps) => {
    const classes = ['tool-button', mirrored && 'tool-button--mirrored', danger && 'tool-button--danger', active && 'tool-button--active', className]
        .filter(Boolean)
        .join(' ');
    const button = <Button variant="plain" size="small" icon={icon} onClick={onClick} disabled={disabled} className={classes} />;
    return (
        <Tooltip title={hint} position={hintPosition} disabled={disabled}>
            {badge ? (
                <span className={`tool-button__badged${disabled ? ' tool-button__badged--disabled' : ''}`}>
                    {button}
                    <span className="tool-button__badge">{badge}</span>
                </span>
            ) : (
                button
            )}
        </Tooltip>
    );
};
