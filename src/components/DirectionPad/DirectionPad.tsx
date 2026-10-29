import { type ReactElement, type ReactNode } from 'react';

import { Icon } from '../Icon';

import './DirectionPad.scss';

export type DirectionPadDirection = 'up' | 'down' | 'left' | 'right';

export type DirectionPadSize = 'compact' | 'large';

export interface DirectionPadProps {
    onDirection: (direction: DirectionPadDirection) => void;
    /** 'compact' sits beside a row of small buttons, 'large' fills a settings section. */
    size?: DirectionPadSize;
    /** Translucent base, for sitting over a video or an image. */
    floating?: boolean;
    disabled?: boolean;
    /** Replaces the plain centre hub, e.g. with a "home" or "stop" button. */
    center?: ReactNode;
    className?: string;
}

const DIRECTIONS: DirectionPadDirection[] = ['up', 'left', 'right', 'down'];

/** A round pan/tilt pad: four arrows around a centre hub, like a camera app's joystick. */
export function DirectionPad({ onDirection, size = 'compact', floating = false, disabled = false, center, className }: DirectionPadProps): ReactElement {
    const classes = [
        'DirectionPad',
        `DirectionPad--${size}`,
        floating ? 'DirectionPad--floating' : '',
        disabled ? 'DirectionPad--disabled' : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes}>
            {DIRECTIONS.map(direction => (
                <button
                    key={direction}
                    type="button"
                    className={`DirectionPad__button DirectionPad__button--${direction}`}
                    disabled={disabled}
                    onClick={() => onDirection(direction)}
                >
                    <Icon name={`caret-${direction}`} />
                </button>
            ))}
            {center === undefined ? <span className="DirectionPad__hub" /> : <div className="DirectionPad__hub DirectionPad__hub--content">{center}</div>}
        </div>
    );
}
