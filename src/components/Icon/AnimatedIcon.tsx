import React from 'react';

import { animatedIconMap, type AnimatedIconName } from '@memobit/icons/animated';

import type { IconSize, IconVariant } from './Icon';

import './Icon.scss';

interface AnimatedIconProps {
    className?: string;
    name: AnimatedIconName;
    size?: IconSize;
    variant?: IconVariant;
}

/**
 * An icon that moves on its own, for something happening right now (motion in a room, a job
 * running). Sized and coloured like `Icon`; the animation lives in the SVG itself.
 */
export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ className = '', name, size, variant }) => {
    const classes = ['icon', size ? `icon--${size}` : '', variant && variant !== 'default' ? `icon--${variant}` : '', className].filter(Boolean).join(' ');

    return <span className={classes}>{animatedIconMap[name]}</span>;
};
