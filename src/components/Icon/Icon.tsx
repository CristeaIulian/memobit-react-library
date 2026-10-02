import React from 'react';

import type { IconName } from '@memobit/icons';
import { iconMap } from '@memobit/icons/map';

import './Icon.scss';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
export type IconVariant = 'default' | 'muted' | 'accent' | 'info' | 'success' | 'warning' | 'danger';

interface IconProps {
    className?: string;
    name: IconName;
    fade?: boolean;
    fadeOnHover?: boolean;
    pulse?: boolean;
    pulseOnHover?: boolean;
    size?: IconSize;
    spin?: boolean;
    spinOnHover?: boolean;
    variant?: IconVariant;
}

const reportedMissing = new Set<string>();

export const Icon: React.FC<IconProps> = ({ className = '', fade, fadeOnHover, name, pulse, pulseOnHover, size, spin, spinOnHover, variant }) => {
    const classes = [
        'icon',
        size ? `icon--${size}` : '',
        variant && variant !== 'default' ? `icon--${variant}` : '',
        spin ? 'icon--spin' : '',
        fade ? 'icon--fade' : '',
        pulse ? 'icon--pulse' : '',
        spinOnHover ? 'icon--spin-hover' : '',
        fadeOnHover ? 'icon--fade-hover' : '',
        pulseOnHover ? 'icon--pulse-hover' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const glyph = iconMap[name];

    if (glyph === undefined && !reportedMissing.has(name)) {
        // A trimmed build renders nothing for a name the Vite plugin did not keep, which
        // is invisible until somebody notices the gap — a missing hamburger menu shipped to
        // every app this way. Saying so once per name turns that into something findable.
        reportedMissing.add(name);
        console.warn(
            `[@memobit/libs] No icon named "${name}". If this app trims icons with ` +
                `@memobit/icons/vite, add it to the plugin's \`include\` option — a name that ` +
                `only exists at runtime cannot be found by the source scan.`,
        );
    }

    return <span className={classes}>{glyph}</span>;
};
