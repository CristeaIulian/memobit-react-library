import React from 'react';

import { clear } from '../../icons/clear';
import { delete_ } from '../../icons/delete';
import { down } from '../../icons/down';
import { edit } from '../../icons/edit';
import { logout } from '../../icons/logout';
import { save } from '../../icons/save';
import { search } from '../../icons/search';
import { settings } from '../../icons/settings';
import { themePicker } from '../../icons/theme-picker';
import { up } from '../../icons/up';

import './Icon.scss';

const iconMap = {
    clear,
    delete: delete_,
    down,
    edit,
    logout,
    save,
    search,
    settings,
    'theme-picker': themePicker,
    up,
} as const;

export type IconName = keyof typeof iconMap;
export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
export type IconVariant = 'default' | 'muted' | 'accent' | 'info' | 'success' | 'warning' | 'danger';

interface IconProps {
    className?: string;
    name: IconName;
    pulse?: boolean;
    pulseOnHover?: boolean;
    size?: IconSize;
    spin?: boolean;
    spinOnHover?: boolean;
    variant?: IconVariant;
}

export const Icon: React.FC<IconProps> = ({ className = '', name, pulse, pulseOnHover, size, spin, spinOnHover, variant }) => {
    const classes = [
        'icon',
        size ? `icon--${size}` : '',
        variant && variant !== 'default' ? `icon--${variant}` : '',
        spin ? 'icon--spin' : '',
        pulse ? 'icon--pulse' : '',
        spinOnHover ? 'icon--spin-hover' : '',
        pulseOnHover ? 'icon--pulse-hover' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <span className={classes}>{iconMap[name]}</span>;
};
