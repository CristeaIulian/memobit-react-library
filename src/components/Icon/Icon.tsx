import React from 'react';

import { access } from '../../icons/access';
import { alarm } from '../../icons/alarm';
import { analysis } from '../../icons/analysis';
import { anomaly } from '../../icons/anomaly';
import { appliances } from '../../icons/appliances';
import { archive } from '../../icons/archive';
import { attention } from '../../icons/attention';
import { batteryEmpty } from '../../icons/battery-empty';
import { batteryFull } from '../../icons/battery-full';
import { batteryHalf } from '../../icons/battery-half';
import { birthdayCake } from '../../icons/birthday-cake';
import { book } from '../../icons/book';
import { bottomArrow } from '../../icons/bottom-arrow';
import { breakfast } from '../../icons/breakfast';
import { button } from '../../icons/button';
import { calendar } from '../../icons/calendar';
import { calibrate } from '../../icons/calibrate';
import { camera } from '../../icons/camera';
import { carbs } from '../../icons/carbs';
import { categories } from '../../icons/categories';
import { chart } from '../../icons/chart';
import { checkmark } from '../../icons/checkmark';
import { clear } from '../../icons/clear';
import { clipboard } from '../../icons/clipboard';
import { cloud } from '../../icons/cloud';
import { connected } from '../../icons/connected';
import { context } from '../../icons/context';
import { cooling } from '../../icons/cooling';
import { correlation } from '../../icons/correlation';
import { dashboard } from '../../icons/dashboard';
import { delete_ } from '../../icons/delete';
import { deselectAll } from '../../icons/deselect-all';
import { detach } from '../../icons/detach';
import { devices } from '../../icons/devices';
import { dinner } from '../../icons/dinner';
import { dishwasher } from '../../icons/dishwasher';
import { doctor } from '../../icons/doctor';
import { document } from '../../icons/document';
import { documents } from '../../icons/documents';
import { door } from '../../icons/door';
import { down } from '../../icons/down';
import { download } from '../../icons/download';
import { dryingMachine } from '../../icons/drying-machine';
import { earth } from '../../icons/earth';
import { edit } from '../../icons/edit';
import { empty } from '../../icons/empty';
import { evening } from '../../icons/evening';
import { export_ } from '../../icons/export';
import { favorite } from '../../icons/favorite';
import { fibers } from '../../icons/fibers';
import { file } from '../../icons/file';
import { food } from '../../icons/food';
import { fridge } from '../../icons/fridge';
import { gasDetector } from '../../icons/gas-detector';
import { gateway } from '../../icons/gateway';
import { grid } from '../../icons/grid';
import { hd } from '../../icons/hd';
import { hearth } from '../../icons/hearth';
import { heating } from '../../icons/heating';
import { history } from '../../icons/history';
import { home } from '../../icons/home';
import { humidity } from '../../icons/humidity';
import { import_ } from '../../icons/import';
import { information } from '../../icons/information';
import { irEmitter } from '../../icons/ir-emitter';
import { leftArrow } from '../../icons/left-arrow';
import { lightBulb } from '../../icons/light-bulb';
import { lightSwitch } from '../../icons/light-switch';
import { lipids } from '../../icons/lipids';
import { list } from '../../icons/list';
import { lock } from '../../icons/lock';
import { logout } from '../../icons/logout';
import { lunch } from '../../icons/lunch';
import { manage } from '../../icons/manage';
import { mapping } from '../../icons/mapping';
import { memory } from '../../icons/memory';
import { minus } from '../../icons/minus';
import { monitor } from '../../icons/monitor';
import { morning } from '../../icons/morning';
import { motion } from '../../icons/motion';
import { movie } from '../../icons/movie';
import { mute } from '../../icons/mute';
import { nas } from '../../icons/nas';
import { network } from '../../icons/network';
import { next } from '../../icons/next';
import { noon } from '../../icons/noon';
import { notFound } from '../../icons/not-found';
import { notes } from '../../icons/notes';
import { off } from '../../icons/off';
import { on } from '../../icons/on';
import { optimization } from '../../icons/optimization';
import { outdoor } from '../../icons/outdoor';
import { pause } from '../../icons/pause';
import { pin } from '../../icons/pin';
import { play } from '../../icons/play';
import { plug } from '../../icons/plug';
import { plus } from '../../icons/plus';
import { power } from '../../icons/power';
import { predictions } from '../../icons/predictions';
import { previous } from '../../icons/previous';
import { printer } from '../../icons/printer';
import { proteins } from '../../icons/proteins';
import { purifier } from '../../icons/purifier';
import { reload } from '../../icons/reload';
import { repeat } from '../../icons/repeat';
import { report } from '../../icons/report';
import { rightArrow } from '../../icons/right-arrow';
import { rooms } from '../../icons/rooms';
import { router } from '../../icons/router';
import { salt } from '../../icons/salt';
import { save } from '../../icons/save';
import { sd } from '../../icons/sd';
import { search } from '../../icons/search';
import { security } from '../../icons/security';
import { sequence } from '../../icons/sequence';
import { settings } from '../../icons/settings';
import { signalFull } from '../../icons/signal-full';
import { signalLow } from '../../icons/signal-low';
import { signalMedium } from '../../icons/signal-medium';
import { smartphone } from '../../icons/smartphone';
import { smokeDetector } from '../../icons/smoke-detector';
import { sources } from '../../icons/sources';
import { speaker } from '../../icons/speaker';
import { stop } from '../../icons/stop';
import { stopSign } from '../../icons/stop-sign';
import { streaming } from '../../icons/streaming';
import { sugar } from '../../icons/sugar';
import { synchronize } from '../../icons/synchronize';
import { table } from '../../icons/table';
import { target } from '../../icons/target';
import { themePicker } from '../../icons/theme-picker';
import { thermometer } from '../../icons/thermometer';
import { time } from '../../icons/time';
import { topArrow } from '../../icons/top-arrow';
import { transactions } from '../../icons/transactions';
import { trend } from '../../icons/trend';
import { tv } from '../../icons/tv';
import { unarchive } from '../../icons/unarchive';
import { unmute } from '../../icons/unmute';
import { up } from '../../icons/up';
import { upload } from '../../icons/upload';
import { user } from '../../icons/user';
import { users } from '../../icons/users';
import { vacuum } from '../../icons/vacuum';
import { verticalDots } from '../../icons/vertical-dots';
import { video } from '../../icons/video';
import { view } from '../../icons/view';
import { wait } from '../../icons/wait';
import { warning } from '../../icons/warning';
import { washingMachine } from '../../icons/washing-machine';
import { waterLeak } from '../../icons/water-leak';
import { websiteCrawl } from '../../icons/website-crawl';
import { workout } from '../../icons/workout';

import './Icon.scss';

const iconMap = {
    'battery-empty': batteryEmpty,
    'battery-full': batteryFull,
    'battery-half': batteryHalf,
    'birthday-cake': birthdayCake,
    'bottom-arow': bottomArrow,
    'deselect-all': deselectAll,
    'drying-machine': dryingMachine,
    'gas-detector': gasDetector,
    'ir-emitter': irEmitter,
    'left-arrow': leftArrow,
    'light-bulb': lightBulb,
    'light-switch': lightSwitch,
    'not-found': notFound,
    'right-arrow': rightArrow,
    'signal-full': signalFull,
    'signal-low': signalLow,
    'signal-medium': signalMedium,
    'smoke-detector': smokeDetector,
    'theme-picker': themePicker,
    'top-arrow': topArrow,
    'vertical-dots': verticalDots,
    'washing-machine': washingMachine,
    'water-leak': waterLeak,
    'website-crawl': websiteCrawl,
    access,
    alarm,
    analysis,
    anomaly,
    appliances,
    archive,
    attention,
    book,
    breakfast,
    button,
    calendar,
    calibrate,
    camera,
    carbs,
    categories,
    chart,
    checkmark,
    clear,
    clipboard,
    cloud,
    connected,
    context,
    cooling,
    correlation,
    dashboard,
    delete: delete_,
    detach,
    devices,
    dinner,
    dishwasher,
    doctor,
    document,
    documents,
    door,
    down,
    download,
    earth,
    edit,
    empty,
    evening,
    export: export_,
    favorite,
    fibers,
    file,
    food,
    fridge,
    gateway,
    grid,
    hd,
    hearth,
    heating,
    history,
    home,
    humidity,
    import: import_,
    information,
    lipids,
    list,
    lock,
    logout,
    lunch,
    manage,
    mapping,
    memory,
    minus,
    monitor,
    morning,
    motion,
    movie,
    mute,
    nas,
    network,
    next,
    noon,
    notes,
    off,
    on,
    optimization,
    outdoor,
    pause,
    pin,
    play,
    plug,
    plus,
    power,
    predictions,
    previous,
    printer,
    proteins,
    purifier,
    reload,
    repeat,
    report,
    rooms,
    router,
    salt,
    save,
    sd,
    search,
    security,
    sequence,
    settings,
    smartphone,
    sources,
    speaker,
    status,
    stop,
    stopSign,
    streaming,
    sugar,
    synchronize,
    table,
    target,
    thermometer,
    time,
    transactions,
    trend,
    tv,
    unarchive,
    unmute,
    up,
    upload,
    user,
    users,
    vacuum,
    video,
    view,
    wait,
    warning,
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
