import React from 'react';

import { admin } from '../../icons/admin';
import { analysis } from '../../icons/analysis';
import { archive } from '../../icons/archive';
import { batteryEmpty } from '../../icons/battery-empty';
import { batteryFull } from '../../icons/battery-full';
import { batteryHalf } from '../../icons/battery-half';
import { birthdayCake } from '../../icons/birthday-cake';
import { book } from '../../icons/book';
import { bottomArrow } from '../../icons/bottom-arrow';
import { breakfast } from '../../icons/breakfast';
import { calendar } from '../../icons/calendar';
import { carbs } from '../../icons/carbs';
import { categories } from '../../icons/categories';
import { chart } from '../../icons/chart';
import { checkmark } from '../../icons/checkmark';
import { clear } from '../../icons/clear';
import { clipboard } from '../../icons/clipboard';
import { connected } from '../../icons/connected';
import { dashboard } from '../../icons/dashboard';
import { delete_ } from '../../icons/delete';
import { detach } from '../../icons/detach';
import { dinner } from '../../icons/dinner';
import { doctor } from '../../icons/doctor';
import { document } from '../../icons/document';
import { documents } from '../../icons/documents';
import { down } from '../../icons/down';
import { download } from '../../icons/download';
import { edit } from '../../icons/edit';
import { empty } from '../../icons/empty';
import { evening } from '../../icons/evening';
import { export_ } from '../../icons/export';
import { fibers } from '../../icons/fibers';
import { file } from '../../icons/file';
import { food } from '../../icons/food';
import { grid } from '../../icons/grid';
import { hearth } from '../../icons/hearth';
import { history } from '../../icons/history';
import { home } from '../../icons/home';
import { import_ } from '../../icons/import';
import { leftArrow } from '../../icons/left-arrow';
import { lipids } from '../../icons/lipids';
import { list } from '../../icons/list';
import { lock } from '../../icons/lock';
import { logout } from '../../icons/logout';
import { lunch } from '../../icons/lunch';
import { memory } from '../../icons/memory';
import { minus } from '../../icons/minus';
import { morning } from '../../icons/morning';
import { motion } from '../../icons/motion';
import { noon } from '../../icons/noon';
import { notFound } from '../../icons/not-found';
import { notes } from '../../icons/notes';
import { off } from '../../icons/off';
import { on } from '../../icons/on';
import { pause } from '../../icons/pause';
import { play } from '../../icons/play';
import { plus } from '../../icons/plus';
import { proteins } from '../../icons/proteins';
import { reload } from '../../icons/reload';
import { repeat } from '../../icons/repeat';
import { rightArrow } from '../../icons/right-arrow';
import { salt } from '../../icons/salt';
import { save } from '../../icons/save';
import { search } from '../../icons/search';
import { settings } from '../../icons/settings';
import { signalFull } from '../../icons/signal-full';
import { signalLow } from '../../icons/signal-low';
import { signalMedium } from '../../icons/signal-medium';
import { sources } from '../../icons/sources';
import { stop } from '../../icons/stop';
import { sugar } from '../../icons/sugar';
import { table } from '../../icons/table';
import { themePicker } from '../../icons/theme-picker';
import { topArrow } from '../../icons/top-arrow';
import { unarchive } from '../../icons/unarchive';
import { up } from '../../icons/up';
import { upload } from '../../icons/upload';
import { user } from '../../icons/user';
import { users } from '../../icons/users';
import { view } from '../../icons/view';
import { wait } from '../../icons/wait';
import { workout } from '../../icons/workout';

import './Icon.scss';

const iconMap = {
    'battery-empty': batteryEmpty,
    'battery-full': batteryFull,
    'battery-half': batteryHalf,
    'birthday-cake': birthdayCake,
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
    analysis,
    archive,
    book,
    breakfast,
    calendar,
    carbs,
    categories,
    chart,
    checkmark,
    clear,
    clipboard,
    connected,
    dashboard,
    delete: delete_,
    detach,
    dinner,
    doctor,
    document,
    documents,
    down,
    download,
    edit,
    empty,
    evening,
    export: export_,
    fibers,
    file,
    food,
    grid,
    hearth,
    history,
    home,
    import: import_,
    lipids,
    list,
    lock,
    logout,
    lunch,
    memory,
    minus,
    morning,
    motion,
    noon,
    notes,
    off,
    on,
    pause,
    play,
    plus,
    proteins,
    reload,
    repeat,
    salt,
    save,
    search,
    settings,
    sources,
    stop,
    sugar,
    table,
    unarchive,
    up,
    upload,
    user,
    users,
    view,
    wait,
    workout,
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
