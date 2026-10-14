import React, { useEffect, useState } from 'react';

import type { IconName } from '@memobit/icons';
import { canLoadMoreIcons, getIcon, loadIcon } from '@memobit/icons/map';

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

const reportMissing = (name: string) => {
    if (reportedMissing.has(name)) {
        return;
    }

    // A trimmed build renders nothing for a name the Vite plugin did not keep, which
    // is invisible until somebody notices the gap — a missing hamburger menu shipped to
    // every app this way. Saying so once per name turns that into something findable.
    reportedMissing.add(name);
    console.warn(
        canLoadMoreIcons
            ? `[@memobit/libs] No icon named "${name}".`
            : `[@memobit/libs] No icon named "${name}". If this app trims icons with ` +
                  `@memobit/icons/vite, add it to the plugin's \`include\` option or use \`lazy\` — a name that ` +
                  `only exists at runtime cannot be found by the source scan.`,
    );
};

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

    // Set when a lazily loaded glyph arrives, so the next render finds it in the registry.
    const [, setLoadedName] = useState<string | null>(null);
    const glyph = getIcon(name);

    useEffect(() => {
        if (glyph !== undefined || !canLoadMoreIcons) {
            return;
        }

        let isCurrent = true;

        loadIcon(name).then(
            icon => {
                if (!isCurrent) {
                    return;
                }

                if (icon === undefined) {
                    reportMissing(name);
                    return;
                }

                setLoadedName(name);
            },
            () => {
                // The chunk failed to load. The span stays empty; the icon is requested again when it remounts.
            },
        );

        return () => {
            isCurrent = false;
        };
    }, [glyph, name]);

    if (glyph === undefined && !canLoadMoreIcons) {
        reportMissing(name);
    }

    return <span className={classes}>{glyph}</span>;
};
