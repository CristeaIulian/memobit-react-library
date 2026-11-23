import React from 'react';

import type { IconName } from '@memobit/icons';
import { getColoredIcon } from '@memobit/icons/colored';

import { Icon, type IconSize } from './Icon';

import './Icon.scss';

interface ColoredIconProps {
    className?: string;
    name: IconName;
    size?: IconSize;
    /** Sits the icon on a rounded square washed in its main colour, like an app icon. */
    backdrop?: boolean;
}

/**
 * The multi-colour variant of an icon, for places where it should be told apart at a glance (an app
 * launcher's tiles). Falls back to the single-colour icon while the name has no coloured variant.
 */
export const ColoredIcon: React.FC<ColoredIconProps> = ({ backdrop, className = '', name, size }) => {
    const colored = getColoredIcon(name);

    if (!backdrop) {
        if (!colored) {
            return <Icon className={className} name={name} size={size} />;
        }

        const classes = ['icon', size ? `icon--${size}` : '', className].filter(Boolean).join(' ');

        return <span className={classes}>{colored.icon}</span>;
    }

    const classes = ['icon', 'icon--backdrop', size ? `icon--${size}` : '', className].filter(Boolean).join(' ');

    // The wash takes the backdrop's text colour: the icon's hue, or the inherited colour behind a single-colour icon.
    return (
        <span className={classes} style={colored ? { color: colored.hue } : undefined}>
            {colored ? colored.icon : <Icon name={name} />}
        </span>
    );
};
