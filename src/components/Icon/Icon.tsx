import React from 'react';

import { batteryEmpty } from '../../icons/battery-empty';
import { batteryFull } from '../../icons/battery-full';
import { batteryHalf } from '../../icons/battery-half';
import { breakfast } from '../../icons/breakfast';
import { chart } from '../../icons/chart';
import { checkmark } from '../../icons/checkmark';
import { clear } from '../../icons/clear';
import { connected } from '../../icons/connected';
import { delete_ } from '../../icons/delete';
import { dinner } from '../../icons/dinner';
import { down } from '../../icons/down';
import { edit } from '../../icons/edit';
import { empty } from '../../icons/empty';
import { evening } from '../../icons/evening';
import { grid } from '../../icons/grid';
import { lock } from '../../icons/lock';
import { logout } from '../../icons/logout';
import { lunch } from '../../icons/lunch';
import { minus } from '../../icons/minus';
import { morning } from '../../icons/morning';
import { motion } from '../../icons/motion';
import { noon } from '../../icons/noon';
import { notFound } from '../../icons/not-found';
import { off } from '../../icons/off';
import { on } from '../../icons/on';
import { pause } from '../../icons/pause';
import { play } from '../../icons/play';
import { plus } from '../../icons/plus';
import { save } from '../../icons/save';
import { search } from '../../icons/search';
import { settings } from '../../icons/settings';
import { signalFull } from '../../icons/signal-full';
import { signalLow } from '../../icons/signal-low';
import { signalMedium } from '../../icons/signal-medium';
import { stop } from '../../icons/stop';
import { table } from '../../icons/table';
import { themePicker } from '../../icons/theme-picker';
import { up } from '../../icons/up';

import './Icon.scss';

const iconMap = {
    'battery-empty': batteryEmpty,
    'battery-full': batteryFull,
    'battery-half': batteryHalf,
    breakfast,
    chart,
    checkmark,
    clear,
    connected,
    delete: delete_,
    dinner,
    down,
    edit,
    empty,
    evening,
    grid,
    lock,
    logout,
    lunch,
    minus,
    morning,
    motion,
    noon,
    'not-found': notFound,
    off,
    on,
    pause,
    play,
    plus,
    save,
    search,
    settings,
    'signal-full': signalFull,
    'signal-low': signalLow,
    'signal-medium': signalMedium,
    stop,
    table,
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
