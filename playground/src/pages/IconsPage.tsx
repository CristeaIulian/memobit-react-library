/// <reference types="vite/client" />
import React, { createElement, isValidElement, useMemo, useState } from 'react';

import { Search } from '../../../src';

import './IconsPage.scss';

type IconModule = Record<string, unknown>;

interface IconEntry {
    id: string;
    filePath: string;
    keywords: string;
    name: string;
    value: unknown;
}

const iconAliases: Record<string, string[]> = {
    'battery-empty': ['power', 'low', 'dead', 'charge', 'energy'],
    'battery-full': ['power', 'charged', 'complete', 'energy', '100'],
    'battery-half': ['power', 'medium', 'charge', 'energy', '50'],
    'birthday-cake': ['celebration', 'party', 'cake', 'birthday', 'anniversary'],
    'bottom-arrow': ['down', 'arrow', 'direction', 'below', 'south'],
    'button-device': ['iot', 'switch', 'remote', 'control', 'smart', 'wireless', 'push'],
    'deselect-all': ['uncheck', 'clear', 'none', 'unselect'],
    'drying-machine': ['dryer', 'appliance', 'laundry', 'clothes'],
    'gas-detector': ['sensor', 'safety', 'alarm', 'gas', 'leak'],
    'glycemic-index': ['gi', 'glucose', 'blood sugar', 'sugar spike', 'diabetes', 'insulin', 'blood glucose', 'carbohydrate'],
    'ir-emitter': ['infrared', 'remote', 'control', 'signal', 'wireless'],
    'left-arrow': ['arrow', 'back', 'previous', 'west', 'direction'],
    'light-bulb': ['lamp', 'light', 'idea', 'brightness', 'illumination'],
    'light-switch': ['switch', 'toggle', 'light', 'control', 'on-off'],
    'not-found': ['404', 'missing', 'error', 'lost', 'empty'],
    'right-arrow': ['arrow', 'forward', 'next', 'east', 'direction'],
    'signal-full': ['wifi', 'network', 'strength', 'connection', 'bars'],
    'signal-low': ['wifi', 'network', 'weak', 'connection', 'bars'],
    'signal-medium': ['wifi', 'network', 'strength', 'connection', 'bars'],
    'smoke-detector': ['sensor', 'safety', 'alarm', 'smoke', 'fire'],
    'stop-sign': ['halt', 'warning', 'caution', 'stop'],
    'theme-picker': ['colors', 'palette', 'appearance', 'style'],
    'top-arrow': ['up', 'arrow', 'direction', 'above', 'north'],
    'vertical-dots': ['menu', 'more', 'options', 'kebab'],
    'washing-machine': ['washer', 'appliance', 'laundry', 'clothes'],
    'water-leak': ['water', 'leak', 'sensor', 'safety', 'flood'],
    'website-crawl': ['spider', 'scrape', 'web', 'crawler', 'bot'],
    alarm: ['alert', 'bell', 'notification', 'reminder', 'clock', 'timer'],
    analysis: ['chart', 'graph', 'statistics', 'analytics', 'data', 'report'],
    anomaly: ['warning', 'error', 'exception', 'unusual', 'irregular'],
    appliances: ['devices', 'home', 'electronics', 'kitchen'],
    archive: ['storage', 'folder', 'box', 'save', 'backup'],
    bell: ['notification', 'alert', 'reminder', 'alarm', 'ring', 'chime', ' push-notification'],
    bones: ['skeleton', 'orthopedic', 'bone', 'fracture', 'skeletal', 'osteo'],
    book: ['reading', 'library', 'education', 'documentation', 'manual', 'guide'],
    brain: ['neurology', 'mind', 'cerebral', 'cognition', 'head', 'thinking'],
    breakfast: ['meal', 'morning', 'food', 'eat'],
    bus: ['transit', 'shuttle', 'transport', 'minibus', 'commute'],
    calendar: ['date', 'schedule', 'time', 'day', 'month', 'year', 'event'],
    calibrate: ['adjust', 'settings', 'tune', 'configure', 'setup'],
    camera: ['photo', 'picture', 'image', 'snapshot', 'photography'],
    car: ['vehicle', 'automobile', 'drive', 'auto', 'sedan', 'transport', 'road', 'ride'],
    carbs: ['nutrition', 'food', 'carbohydrates', 'macros', 'diet'],
    categories: ['organize', 'groups', 'classification', 'tags', 'folder'],
    chart: ['graph', 'statistics', 'data', 'analytics', 'visualization'],
    checkmark: ['check', 'done', 'complete', 'success', 'yes', 'confirm', 'tick'],
    clear: ['cancel', 'close', 'remove', 'dismiss', 'exit'],
    clipboard: ['copy', 'paste', 'notes', 'document'],
    cloud: ['upload', 'storage', 'sync', 'backup', 'online'],
    connected: ['linked', 'online', 'network', 'active', 'live'],
    context: ['menu', 'options', 'settings', 'more', 'dots'],
    cooling: ['temperature', 'cold', 'ac', 'aircon', 'climate'],
    correlation: ['relationship', 'connection', 'link', 'association'],
    dashboard: ['home', 'overview', 'summary', 'main', 'panel'],
    delete: ['remove', 'trash', 'bin', 'erase', 'discard'],
    dental: ['tooth', 'teeth', 'dentist', 'oral', 'mouth', 'molar'],
    detach: ['disconnect', 'separate', 'unlink', 'remove'],
    devices: ['hardware', 'electronics', 'gadgets', 'equipment'],
    digestive: ['stomach', 'gastro', 'gut', 'intestine', 'gastrointestinal', 'belly'],
    dinner: ['meal', 'evening', 'food', 'eat', 'supper'],
    dishwasher: ['appliance', 'kitchen', 'clean', 'dishes'],
    doctor: ['medical', 'health', 'physician', 'medicine', 'hospital'],
    document: ['file', 'paper', 'text', 'page'],
    documents: ['files', 'papers', 'folder', 'archive'],
    door: ['entrance', 'exit', 'access', 'entry'],
    down: ['arrow', 'below', 'bottom', 'decrease'],
    download: ['save', 'export', 'get', 'retrieve'],
    ears: ['hearing', 'audio', 'ent', 'auditory', 'otology', 'listen'],
    earth: ['globe', 'world', 'planet', 'global', 'international'],
    edit: ['modify', 'change', 'update', 'pencil', 'write'],
    empty: ['blank', 'null', 'void', 'nothing'],
    endocrine: ['thyroid', 'hormones', 'glands', 'metabolism', 'pituitary'],
    evening: ['night', 'time', 'dusk', 'pm'],
    export: ['download', 'save', 'send', 'output'],
    favorite: ['star', 'like', 'bookmark', 'love', 'heart'],
    fibers: ['nutrition', 'food', 'diet', 'macros', 'health'],
    file: ['document', 'paper', 'page', 'text'],
    food: ['meal', 'eat', 'nutrition', 'diet'],
    fridge: ['refrigerator', 'appliance', 'kitchen', 'cold', 'storage'],
    gallery: ['photo', 'media', 'album', 'lightbox', 'grid', 'image', 'slideshow', 'collection', 'portfolio', 'thumbnails', 'snapshots', 'snapshots'],
    gateway: ['router', 'hub', 'bridge', 'network', 'connection'],
    grid: ['layout', 'tiles', 'view', 'display', 'matrix'],
    hd: ['quality', 'video', 'resolution', 'high-definition'],
    heart: ['love', 'like', 'favorite', 'health', 'cardio'],
    heating: ['temperature', 'warm', 'hot', 'climate', 'thermostat'],
    history: ['time', 'past', 'log', 'record', 'timeline'],
    home: ['house', 'main', 'dashboard', 'start'],
    humidity: ['moisture', 'water', 'damp', 'weather'],
    identity: ['fingerprint', 'biometric', 'authentication', 'verification', 'ID', 'persona', 'profile', 'recognize', 'unique', 'credentials', 'sign-in'],
    import: ['upload', 'load', 'add', 'input'],
    information: ['info', 'help', 'about', 'details', 'question'],
    laboratory: ['lab', 'test', 'beaker', 'experiment', 'science', 'analysis'],
    lipids: ['fats', 'nutrition', 'food', 'diet', 'macros'],
    list: ['menu', 'items', 'lines', 'rows', 'view'],
    liver: ['organ', 'hepatic', 'health', 'medical', 'anatomy'],
    lock: ['secure', 'locked', 'private', 'security', 'protected'],
    logout: ['exit', 'signout', 'leave', 'disconnect'],
    lunch: ['meal', 'midday', 'food', 'eat'],
    lungs: ['respiratory', 'pulmonary', 'breathing', 'organ', 'chest', 'respiration'],
    manage: ['settings', 'configure', 'admin', 'control', 'organize'],
    mapping: ['map', 'location', 'coordinates', 'navigation'],
    memory: ['storage', 'ram', 'cache', 'save'],
    mental: ['mind', 'psychology', 'mental health', 'brain', 'psychiatric', 'wellness'],
    minus: ['subtract', 'remove', 'less', 'decrease', 'negative'],
    monitor: ['screen', 'display', 'watch', 'view', 'track'],
    morning: ['am', 'dawn', 'time', 'early'],
    motion: ['movement', 'sensor', 'activity', 'detection'],
    movie: ['film', 'video', 'cinema', 'play', 'watch'],
    mute: ['silent', 'quiet', 'sound-off', 'volume'],
    nas: ['storage', 'network', 'server', 'drive', 'backup'],
    nervous: ['neurology', 'nervous system', 'neural', 'nerves', 'neuro', 'brain'],
    network: ['connection', 'internet', 'wifi', 'lan', 'online'],
    next: ['forward', 'arrow', 'continue', 'advance'],
    noon: ['midday', 'time', '12pm', 'afternoon'],
    nose: ['ent', 'nasal', 'olfactory', 'smell', 'respiration', 'sinus'],
    notes: ['text', 'memo', 'write', 'document'],
    notice: ['alert', 'attention', 'important', 'announcement', 'info'],
    off: ['power', 'disable', 'stop', 'inactive'],
    offline: ['disconnected', 'no-connection', 'unavailable'],
    on: ['power', 'enable', 'start', 'active'],
    online: ['connected', 'active', 'live', 'available'],
    optimization: ['improve', 'enhance', 'performance', 'speed'],
    other: ['miscellaneous', 'more', 'additional', 'different', 'options'],
    outdoor: ['outside', 'external', 'weather', 'garden'],
    ownership: ['owner', 'assigned', 'belongs', 'admin', 'administrator', 'responsible', 'author', 'creator', 'accountability', 'managed', 'assignee'],
    pause: ['stop', 'hold', 'wait', 'suspend'],
    pdf: ['document', 'file', 'portable', 'export', 'report', 'download'],
    pin: ['location', 'marker', 'flag', 'save', 'bookmark'],
    plane: ['flight', 'aircraft', 'airplane', 'travel', 'aviation', 'airline', 'fly', 'airport'],
    play: ['start', 'run', 'begin', 'video', 'media'],
    plug: ['power', 'socket', 'outlet', 'electricity', 'connect'],
    plus: ['add', 'new', 'create', 'increase', 'positive'],
    power: ['energy', 'electricity', 'on-off', 'battery'],
    predictions: ['forecast', 'future', 'estimate', 'trend'],
    prescription: ['medication', 'medical', 'drugs', 'rx', 'pharmacy', 'treatment'],
    previous: ['back', 'arrow', 'before', 'prior'],
    printer: ['print', 'paper', 'document', 'output'],
    proteins: ['nutrition', 'food', 'diet', 'macros', 'muscle'],
    purifier: ['air', 'clean', 'filter', 'quality'],
    referral: ['reference', 'transfer', 'send', 'redirect', 'patient', 'doctor'],
    reload: ['refresh', 'update', 'sync', 'restart'],
    repeat: ['loop', 'cycle', 'again', 'replay'],
    report: ['document', 'analytics', 'summary', 'data'],
    reproductive: ['fertility', 'obstetric', 'gynecology', 'medical', 'pregnancy'],
    rooms: ['locations', 'spaces', 'areas', 'places'],
    router: ['network', 'wifi', 'internet', 'gateway'],
    salt: ['sodium', 'nutrition', 'food', 'seasoning'],
    save: ['floppy', 'disk', 'store', 'keep', 'preserve'],
    sd: ['quality', 'video', 'resolution', 'standard-definition'],
    search: ['find', 'lookup', 'query', 'magnify', 'explore'],
    security: ['shield', 'protection', 'safe', 'lock', 'access', 'guard'],
    sequence: ['order', 'steps', 'flow', 'process'],
    settings: ['preferences', 'config', 'options', 'gear', 'configure'],
    skin: ['dermatology', 'epidermis', 'dermal', 'health', 'medical', 'texture'],
    smartphone: ['phone', 'mobile', 'device', 'cell'],
    sources: ['origin', 'input', 'references', 'links'],
    speaker: ['sound', 'audio', 'volume', 'music'],
    status: ['state', 'condition', 'info', 'indicator'],
    stop: ['halt', 'end', 'terminate', 'finish'],
    streaming: ['video', 'live', 'broadcast', 'media'],
    sugar: ['sweet', 'nutrition', 'food', 'carbs'],
    synchronize: ['sync', 'update', 'refresh', 'reload'],
    table: ['grid', 'data', 'rows', 'columns', 'list'],
    target: ['goal', 'aim', 'focus', 'objective'],
    technical: ['engineering', 'developer', 'system', 'gear', 'mechanics', 'maintenance', 'ops', 'setup', 'preferences'],
    thermometer: ['temperature', 'heat', 'cold', 'weather'],
    time: ['clock', 'hour', 'minute', 'schedule'],
    train: ['railway', 'subway', 'metro', 'rail', 'locomotive', 'tram', 'underground', 'transit', 'commute'],
    transactions: ['payments', 'money', 'finance', 'history'],
    trend: ['chart', 'analytics', 'growth', 'pattern'],
    tv: ['television', 'screen', 'video', 'display'],
    unarchive: ['restore', 'retrieve', 'unbox', 'extract'],
    unassociated: ['unlinked', 'disconnected', 'separate', 'orphan'],
    unmute: ['sound', 'volume', 'audio', 'on'],
    up: ['arrow', 'above', 'top', 'increase'],
    upload: ['import', 'add', 'send', 'transfer'],
    user: ['person', 'profile', 'account', 'avatar'],
    users: ['people', 'group', 'team', 'accounts'],
    vacuum: ['cleaner', 'appliance', 'cleaning'],
    video: ['camera', 'recording', 'film', 'media'],
    view: ['eye', 'see', 'show', 'display', 'preview', 'look'],
    wait: ['loading', 'pending', 'spinner', 'progress'],
    warning: ['alert', 'caution', 'danger', 'attention'],
    workout: ['exercise', 'fitness', 'gym', 'training', 'sport'],
};

const iconModules = import.meta.glob('../../../src/icons/**/*.tsx', { eager: true }) as Record<string, IconModule>;

const formatIconName = (value: string) =>
    value
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, letter => letter.toUpperCase());

const stripIconBasePath = (filePath: string) => filePath.replace('../../../src/icons/', '').replace(/\.[^.]+$/, '');

const iconEntries: IconEntry[] = Object.entries(iconModules)
    .flatMap(([filePath, iconModule]) => {
        const normalizedPath = stripIconBasePath(filePath);
        const fileName = normalizedPath.split('/').pop() ?? normalizedPath;

        return Object.entries(iconModule).flatMap(([exportName, value]) => {
            if (!isValidElement(value) && typeof value !== 'function') {
                return [];
            }

            const baseName = exportName === 'default' ? fileName : exportName;
            const name = formatIconName(baseName);
            const aliases = iconAliases[normalizedPath] || [];
            const allKeywords = [name, exportName, fileName, normalizedPath, ...aliases];

            return [
                {
                    id: `${normalizedPath}:${exportName}`,
                    filePath: normalizedPath,
                    keywords: allKeywords.join(' ').toLowerCase(),
                    name,
                    value,
                },
            ];
        });
    })
    .sort((left, right) => left.name.localeCompare(right.name));

const renderIcon = (value: unknown) => {
    if (isValidElement(value)) {
        return value;
    }

    if (typeof value === 'function') {
        return createElement(value as React.ComponentType);
    }

    return null;
};

export const IconsPage: React.FC = () => {
    const [query, setQuery] = useState('');

    const normalizedQuery = query.trim().toLowerCase();
    const filteredIcons = useMemo(() => iconEntries.filter(icon => !normalizedQuery || icon.keywords.includes(normalizedQuery)), [normalizedQuery]);

    return (
        <div className="icons-page">
            <header className="icons-page__header">
                <div>
                    <h1>Icons</h1>
                    <p>
                        Browse every icon available under <code>src/icons</code>. New icon files appear here automatically.
                    </p>
                </div>

                <div className="icons-page__search">
                    <Search value={query} onChange={setQuery} placeholder="Search icons by name, keyword, or alias..." />
                </div>
            </header>

            <section className="page-section">
                <div className="icons-page__toolbar">
                    <h2>Available Icons</h2>
                    <span className="icons-page__count">
                        {filteredIcons.length} of {iconEntries.length}
                    </span>
                </div>

                {filteredIcons.length > 0 ? (
                    <div className="icons-page__grid">
                        {filteredIcons.map(icon => (
                            <article key={icon.id} className="icons-page__tile">
                                <div className="icons-page__preview">{renderIcon(icon.value)}</div>
                                <strong className="icons-page__name">{icon.name}</strong>
                                <span className="icons-page__path">{icon.filePath}</span>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="icons-page__empty">
                        <h3>No icons found</h3>
                        <p>Try a different search term.</p>
                    </div>
                )}
            </section>
        </div>
    );
};
