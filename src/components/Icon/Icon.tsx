import React from 'react';

import { admin } from '../../icons/admin';
import { archive } from '../../icons/archive';
import { batteryEmpty } from '../../icons/battery-empty';
import { batteryFull } from '../../icons/battery-full';
import { batteryHalf } from '../../icons/battery-half';
import { book } from '../../icons/book';
import { bottomArrow } from '../../icons/bottom-arrow';
import { breakfast } from '../../icons/breakfast';
import { carbs } from '../../icons/carbs';
import { chart } from '../../icons/chart';
import { checkmark } from '../../icons/checkmark';
import { clear } from '../../icons/clear';
import { clipboard } from '../../icons/clipboard';
import { connected } from '../../icons/connected';
import { delete_ } from '../../icons/delete';
import { detach } from '../../icons/detach';
import { dinner } from '../../icons/dinner';
import { document } from '../../icons/document';
import { down } from '../../icons/down';
import { download } from '../../icons/download';
import { edit } from '../../icons/edit';
import { empty } from '../../icons/empty';
import { evening } from '../../icons/evening';
import { fibers } from '../../icons/fibers';
import { file } from '../../icons/file';
import { grid } from '../../icons/grid';
import { history } from '../../icons/history';
import { home } from '../../icons/home';
import { leftArrow } from '../../icons/left-arrow';
import { lipids } from '../../icons/lipids';
import { list } from '../../icons/list';
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
import { proteins } from '../../icons/proteins';
import { reload } from '../../icons/reload';
import { rightArrow } from '../../icons/right-arrow';
import { salt } from '../../icons/salt';
import { save } from '../../icons/save';
import { search } from '../../icons/search';
import { settings } from '../../icons/settings';
import { signalFull } from '../../icons/signal-full';
import { signalLow } from '../../icons/signal-low';
import { signalMedium } from '../../icons/signal-medium';
import { stop } from '../../icons/stop';
import { sugar } from '../../icons/sugar';
import { table } from '../../icons/table';
import { themePicker } from '../../icons/theme-picker';
import { topArrow } from '../../icons/top-arrow';
import { unarchive } from '../../icons/unarchive';
import { up } from '../../icons/up';
import { upload } from '../../icons/upload';
import { wait } from '../../icons/wait';
import { view } from '../../icons/view';

import './Icon.scss';

const iconMap = {
    'battery-empty': batteryEmpty,
    'battery-full': batteryFull,
    'battery-half': batteryHalf,
    'bottom-arow': bottomArrow,
    'left-arrow': leftArrow,
    'not-found': notFound,
    'right-arrow': rightArrow,
    'signal-full': signalFull,
    'signal-low': signalLow,
    'signal-medium': signalMedium,
    'theme-picker': themePicker,
    'top-arrow': topArrow,
    admin,
    archive,
    book,
    breakfast,
    carbs,
    chart,
    checkmark,
    clear,
    clipboard,
    connected,
    delete: delete_,
    detach,
    dinner,
    document,
    down,
    download,
    edit,
    empty,
    evening,
    fibers,
    file,
    grid,
    history,
    home,
    lipids,
    list,
    lock,
    logout,
    lunch,
    minus,
    morning,
    motion,
    noon,
    off,
    on,
    pause,
    play,
    plus,
    proteins,
    reload,
    salt,
    save,
    search,
    settings,
    stop,
    sugar,
    table,
    unarchive,
    up,
    upload,
    wait,
    view,
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
