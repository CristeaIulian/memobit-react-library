/// <reference types="vite/client" />
import React, { createElement, isValidElement, useCallback, useMemo, useState } from 'react';

import { Search, Toast, type ToastDetails } from '../../../src';

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
    'arrow-down': ['down', 'arrow', 'direction', 'below', 'south'],
    'arrow-left': ['arrow', 'back', 'previous', 'west', 'direction'],
    'arrow-right': ['arrow', 'forward', 'next', 'east', 'direction'],
    'arrow-up': ['up', 'arrow', 'direction', 'above', 'north'],
    'battery-empty': ['power', 'low', 'dead', 'charge', 'energy'],
    'battery-full': ['power', 'charged', 'complete', 'energy', '100'],
    'battery-half': ['power', 'medium', 'charge', 'energy', '50'],
    'birthday-cake': ['celebration', 'party', 'cake', 'birthday', 'anniversary'],
    'button-device': ['iot', 'switch', 'remote', 'control', 'smart', 'wireless', 'push'],
    'caret-down': ['arrow', 'below', 'bottom', 'decrease'],
    'caret-up': ['arrow', 'above', 'top', 'increase'],
    'christmas-tree': ['holiday', 'xmas', 'winter', 'decoration'],
    'deselect-all': ['uncheck', 'clear', 'none', 'unselect'],
    'drying-machine': ['dryer', 'appliance', 'laundry', 'clothes'],
    'fishing-rod': ['hobby', 'sport', 'fish', 'leisure'],
    'gas-detector': ['sensor', 'safety', 'alarm', 'gas', 'leak'],
    'glycemic-index': ['gi', 'glucose', 'blood sugar', 'sugar spike', 'diabetes', 'insulin', 'blood glucose', 'carbohydrate'],
    'ir-emitter': ['infrared', 'remote', 'control', 'signal', 'wireless'],
    'light-bulb': ['lamp', 'light', 'idea', 'brightness', 'illumination'],
    'light-switch': ['switch', 'toggle', 'light', 'control', 'on-off'],
    'menu-hamburger': ['menu', 'navigation', 'nav', 'sidebar', 'drawer', 'burger', 'toggle', 'options', 'more', 'expand'],
    'musical-note': ['audio', 'melody', 'song', 'tune'],
    'not-found': ['404', 'missing', 'error', 'lost', 'empty'],
    'shopping-cart': ['cart', 'basket', 'shop', 'buy', 'purchase', 'checkout', 'ecommerce', 'store'],
    'signal-full': ['wifi', 'network', 'strength', 'connection', 'bars'],
    'signal-low': ['wifi', 'network', 'weak', 'connection', 'bars'],
    'signal-medium': ['wifi', 'network', 'strength', 'connection', 'bars'],
    'smoke-detector': ['sensor', 'safety', 'alarm', 'smoke', 'fire'],
    'stop-sign': ['halt', 'warning', 'caution', 'stop'],
    'theme-picker': ['colors', 'palette', 'appearance', 'style'],
    'transport-box': ['shipping', 'package', 'delivery', 'cargo'],
    'vertical-dots': ['menu', 'more', 'options', 'kebab'],
    'washing-machine': ['washer', 'appliance', 'laundry', 'clothes'],
    'water-leak': ['water', 'leak', 'sensor', 'safety', 'flood'],
    'website-crawl': ['spider', 'scrape', 'web', 'crawler', 'bot'],
    alarm: ['alert', 'bell', 'notification', 'reminder', 'clock', 'timer'],
    analysis: ['chart', 'graph', 'statistics', 'analytics', 'data', 'report'],
    announcement: ['megaphone', 'alert', 'news', 'broadcast'],
    anomaly: ['warning', 'error', 'exception', 'unusual', 'irregular'],
    ant: ['insect', 'bug', 'small', 'work'],
    appliances: ['devices', 'home', 'electronics', 'kitchen'],
    archive: ['storage', 'folder', 'box', 'save', 'backup'],
    badge: ['tag', 'label', 'sticker', 'id', 'credential', 'certificate', 'pass', 'card'],
    balloon: ['party', 'celebration', 'fun', 'air'],
    bat: ['animal', 'night', 'flying', 'halloween'],
    beans: ['food', 'legume', 'coffee', 'source'],
    bear: ['animal', 'nature', 'wild', 'teddy'],
    bed: ['sleep', 'rest', 'hotel', 'accommodation'],
    bee: ['insect', 'nature', 'honey', 'work'],
    bell: ['notification', 'alert', 'reminder', 'alarm', 'ring', 'chime', ' push-notification'],
    benefit: ['perk', 'reward', 'bonus', 'gift', 'advantage', 'value', 'included', 'offer'],
    bones: ['skeleton', 'orthopedic', 'bone', 'fracture', 'skeletal', 'osteo'],
    book: ['reading', 'library', 'education', 'documentation', 'manual', 'guide'],
    bow: ['ribbon', 'decoration', 'gift', 'weapon'],
    brain: ['neurology', 'mind', 'cerebral', 'cognition', 'head', 'thinking'],
    breakfast: ['meal', 'morning', 'food', 'eat'],
    briefcase: ['work', 'job', 'business', 'career', 'professional', 'office', 'bag', 'travel'],
    broom: ['clean', 'sweep', 'clear', 'remove'],
    bug: ['error', 'debug', 'issue', 'insect'],
    building: [
        'office',
        'company',
        'organization',
        'headquarters',
        'facility',
        'site',
        'location',
        'property',
        'realestate',
        'enterprise',
        'workplace',
        'commercial',
    ],
    bunny: ['rabbit', 'animal', 'easter', 'nature'],
    bus: ['transit', 'shuttle', 'transport', 'minibus', 'commute'],
    butterfly: ['insect', 'nature', 'beauty', 'transform'],
    cake: ['dessert', 'birthday', 'celebration', 'sweet'],
    calendar: ['date', 'schedule', 'time', 'day', 'month', 'year', 'event'],
    calibrate: ['adjust', 'settings', 'tune', 'configure', 'setup'],
    camera: ['photo', 'picture', 'image', 'snapshot', 'photography'],
    candy: ['sweet', 'sugar', 'treat', 'snack'],
    car: ['vehicle', 'automobile', 'drive', 'auto', 'sedan', 'transport', 'road', 'ride'],
    carbs: ['nutrition', 'food', 'carbohydrates', 'macros', 'diet'],
    carrot: ['vegetable', 'food', 'healthy', 'diet'],
    cat: ['animal', 'pet', 'feline'],
    categories: ['organize', 'groups', 'classification', 'tags', 'folder'],
    caterpillar: ['insect', 'larva', 'nature', 'growth'],
    certificate: ['award', 'diploma', 'credential', 'certification', 'degree', 'license', 'verified'],
    chart: ['graph', 'statistics', 'data', 'analytics', 'visualization'],
    checkmark: ['check', 'done', 'complete', 'success', 'yes', 'confirm', 'tick'],
    clear: ['cancel', 'close', 'remove', 'dismiss', 'exit'],
    clipboard: ['copy', 'paste', 'notes', 'document'],
    cloud: ['upload', 'storage', 'sync', 'backup', 'online'],
    comment: ['message', 'chat', 'talk', 'discuss', 'feedback', 'note', 'bubble', 'speech'],
    connected: ['linked', 'online', 'network', 'active', 'live'],
    context: ['menu', 'options', 'settings', 'more', 'dots'],
    cook: ['chef', 'cooking', 'kitchen', 'recipe', 'prepare', 'meal', 'food'],
    cooling: ['temperature', 'cold', 'ac', 'aircon', 'climate'],
    correlation: ['relationship', 'connection', 'link', 'association'],
    cow: ['animal', 'farm', 'milk', 'livestock'],
    cpu: ['processor', 'hardware', 'chip', 'system', 'compute'],
    dashboard: ['home', 'overview', 'summary', 'main', 'panel'],
    death: ['grave', 'end', 'final', 'rip'],
    defect: ['bug', 'fault', 'flaw', 'issue', 'damage', 'defective', 'broken', 'anomaly', 'incident', 'problem', 'crack', 'failure', 'snag'],
    delete: ['remove', 'trash', 'bin', 'erase', 'discard'],
    dental: ['tooth', 'teeth', 'dentist', 'oral', 'mouth', 'molar'],
    detach: ['disconnect', 'separate', 'unlink', 'remove'],
    devices: ['hardware', 'electronics', 'gadgets', 'equipment'],
    digestive: ['stomach', 'gastro', 'gut', 'intestine', 'gastrointestinal', 'belly'],
    dinner: ['meal', 'evening', 'food', 'eat', 'supper'],
    dinosaur: ['animal', 'extinct', 'ancient', 'old'],
    dishwasher: ['appliance', 'kitchen', 'clean', 'dishes'],
    doctor: ['medical', 'health', 'physician', 'medicine', 'hospital'],
    document: ['file', 'paper', 'text', 'page'],
    documents: ['files', 'papers', 'folder', 'archive'],
    dog: ['animal', 'pet', 'canine', 'friend'],
    door: ['entrance', 'exit', 'access', 'entry'],
    download: ['save', 'export', 'get', 'retrieve'],
    duplicates: ['copy', 'clone', 'double', 'repeat'],
    ears: ['hearing', 'audio', 'ent', 'auditory', 'otology', 'listen'],
    earth: ['globe', 'world', 'planet', 'global', 'international'],
    edit: ['modify', 'change', 'update', 'pencil', 'write'],
    empty: ['blank', 'null', 'void', 'nothing'],
    endocrine: ['thyroid', 'hormones', 'glands', 'metabolism', 'pituitary'],
    enlarge: ['expand', 'maximize', 'fullscreen', 'grow', 'increase', 'zoom in', 'scale up'],
    evening: ['night', 'time', 'dusk', 'pm'],
    export: ['download', 'save', 'send', 'output'],
    favorite: ['star', 'like', 'bookmark', 'love', 'heart'],
    fibers: ['nutrition', 'food', 'diet', 'macros', 'health'],
    file: ['document', 'paper', 'page', 'text'],
    filters: ['filter', 'sort', 'refine', 'criteria', 'narrow', 'funnel', 'query'],
    fire: ['hot', 'burn', 'danger', 'trending', 'flame'],
    firewall: ['security', 'protection', 'barrier', 'block'],
    fireworks: ['celebration', 'party', 'event', 'success'],
    folder: ['directory', 'files', 'storage', 'archive'],
    food: ['meal', 'eat', 'nutrition', 'diet'],
    fridge: ['refrigerator', 'appliance', 'kitchen', 'cold', 'storage'],
    fruits: ['apple', 'food', 'organic', 'groceries', 'citrus', 'berries', 'tropical'],
    gallery: ['photo', 'media', 'album', 'lightbox', 'grid', 'image', 'slideshow', 'collection', 'portfolio', 'thumbnails', 'snapshots', 'snapshots'],
    gateway: ['router', 'hub', 'bridge', 'network', 'connection'],
    giftBox: ['present', 'reward', 'surprise', 'bonus'],
    girl: ['female', 'user', 'person', 'woman'],
    github: ['git', 'code', 'repository', 'repo', 'octocat', 'version-control', 'source'],
    gloves: ['protection', 'winter', 'safety', 'hands'],
    goat: ['animal', 'farm', 'greatest', 'mountain'],
    graduation: ['education', 'degree', 'cap', 'university', 'college', 'school', 'diploma', 'academic'],
    grid: ['layout', 'tiles', 'view', 'display', 'matrix'],
    hammer: ['tool', 'build', 'fix', 'construction'],
    handshake: ['deal', 'partnership', 'agree', 'business'],
    hd: ['quality', 'video', 'resolution', 'high-definition'],
    headphones: ['audio', 'music', 'listen', 'sound'],
    heart: ['love', 'like', 'favorite', 'health', 'cardio'],
    heating: ['temperature', 'warm', 'hot', 'climate', 'thermostat'],
    help: ['support', 'faq', 'question', 'assistance', 'guide', 'tooltip', 'hints', 'info', 'about'],
    history: ['time', 'past', 'log', 'record', 'timeline'],
    home: ['house', 'main', 'dashboard', 'start'],
    humidity: ['moisture', 'water', 'damp', 'weather'],
    identity: ['fingerprint', 'biometric', 'authentication', 'verification', 'ID', 'persona', 'profile', 'recognize', 'unique', 'credentials', 'sign-in'],
    image: ['photo', 'picture', 'frame', 'gallery', 'visual', 'media', 'artwork', 'slideshow'],
    import: ['upload', 'load', 'add', 'input'],
    incognito: ['private', 'hidden', 'secret', 'stealth'],
    information: ['info', 'help', 'about', 'details', 'question'],
    ingredients: ['recipe', 'items', 'food', 'shopping', 'grocery', 'checklist', 'nutrition'],
    key: ['password', 'access', 'security', 'auth'],
    laboratory: ['lab', 'test', 'beaker', 'experiment', 'science', 'analysis'],
    language: ['speak', 'communication', 'translate', 'international', 'dialect', 'linguistic'],
    leaf: ['nature', 'green', 'environment', 'eco'],
    linkedin: ['social', 'professional', 'network', 'job', 'career', 'profile', 'connect'],
    lipids: ['fats', 'nutrition', 'food', 'diet', 'macros'],
    list: ['menu', 'items', 'lines', 'rows', 'view'],
    liver: ['organ', 'hepatic', 'health', 'medical', 'anatomy'],
    lock: ['secure', 'locked', 'private', 'security', 'protected'],
    logout: ['exit', 'signout', 'leave', 'disconnect'],
    lollipop: ['candy', 'sweet', 'treat', 'child'],
    lunch: ['meal', 'midday', 'food', 'eat'],
    lungs: ['respiratory', 'pulmonary', 'breathing', 'organ', 'chest', 'respiration'],
    mail: ['email', 'inbox', 'message', 'envelope', 'compose', 'send', 'correspondence', 'newsletter', 'contact', 'outbox', 'unread'],
    manage: ['settings', 'configure', 'admin', 'control', 'organize'],
    map: ['location', 'navigation', 'directions', 'geography', 'route', 'atlas', 'cartography', 'folded'],
    mapping: ['map', 'location', 'coordinates', 'navigation'],
    memory: ['storage', 'ram', 'cache', 'save'],
    mental: ['mind', 'psychology', 'mental health', 'brain', 'psychiatric', 'wellness'],
    microphone: ['audio', 'record', 'voice', 'mic', 'sound', 'speak', 'input'],
    minus: ['subtract', 'remove', 'less', 'decrease', 'negative'],
    monitor: ['screen', 'display', 'watch', 'view', 'track'],
    moon: ['night', 'weather', 'dark', 'sleep', 'lunar'],
    morning: ['am', 'dawn', 'time', 'early'],
    motion: ['movement', 'sensor', 'activity', 'detection'],
    mouse: ['animal', 'peripheral', 'computer', 'input'],
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
    pear: ['fruit', 'food', 'healthy'],
    penguin: ['animal', 'cold', 'bird', 'arctic', 'linux'],
    pharmacy: ['medicine', 'drugs', 'health', 'clinic'],
    phone: ['call', 'mobile', 'contact', 'communication'],
    pin: ['location', 'marker', 'flag', 'save', 'bookmark'],
    plane: ['flight', 'aircraft', 'airplane', 'travel', 'aviation', 'airline', 'fly', 'airport'],
    play: ['start', 'run', 'begin', 'video', 'media'],
    plug: ['power', 'socket', 'outlet', 'electricity', 'connect'],
    plus: ['add', 'new', 'create', 'increase', 'positive'],
    popcorn: ['movie', 'cinema', 'snack', 'entertainment'],
    portions: ['serving', 'servings', 'plate', 'meal', 'quantity', 'share', 'nutrition'],
    power: ['energy', 'electricity', 'on-off', 'battery'],
    predictions: ['forecast', 'future', 'estimate', 'trend'],
    prescription: ['medication', 'medical', 'drugs', 'rx', 'pharmacy', 'treatment'],
    previous: ['back', 'arrow', 'before', 'prior'],
    printer: ['print', 'paper', 'document', 'output'],
    proteins: ['nutrition', 'food', 'diet', 'macros', 'muscle'],
    pumpkin: ['halloween', 'autumn', 'vegetable', 'fall'],
    purifier: ['air', 'clean', 'filter', 'quality'],
    puzzle: ['game', 'logic', 'problem', 'piece'],
    rain: ['weather', 'wet', 'water', 'storm'],
    rainbow: ['weather', 'nature', 'colorful', 'pride', 'hope'],
    raspberry: ['pi', 'fruit', 'berry', 'iot', 'hardware'],
    reading: ['book', 'education', 'study', 'learn'],
    referral: ['reference', 'transfer', 'send', 'redirect', 'patient', 'doctor'],
    reload: ['refresh', 'update', 'sync', 'restart'],
    repeat: ['loop', 'cycle', 'again', 'replay'],
    report: ['document', 'analytics', 'summary', 'data'],
    reproductive: ['fertility', 'obstetric', 'gynecology', 'medical', 'pregnancy'],
    return: ['back', 'undo', 'arrow', 'revert'],
    robot: ['ai', 'bot', 'automation', 'tech'],
    rocket: ['launch', 'space', 'flight', 'project', 'start', 'mission', 'breakthrough'],
    rooms: ['locations', 'spaces', 'areas', 'places'],
    router: ['network', 'wifi', 'internet', 'gateway'],
    salt: ['sodium', 'nutrition', 'food', 'seasoning'],
    santa: ['christmas', 'holiday', 'winter', 'gift'],
    satellite: ['space', 'communication', 'orbit', 'signal'],
    saturn: ['planet', 'space', 'astronomy', 'universe'],
    save: ['floppy', 'disk', 'store', 'keep', 'preserve'],
    scissors: ['cut', 'tool', 'edit', 'trim'],
    score: ['points', 'game', 'result', 'rating', 'star'],
    sd: ['quality', 'video', 'resolution', 'standard-definition'],
    search: ['find', 'lookup', 'query', 'magnify', 'explore'],
    security: ['shield', 'protection', 'safe', 'lock', 'access', 'guard'],
    seeds: ['plant', 'garden', 'growth', 'start'],
    sequence: ['order', 'steps', 'flow', 'process'],
    settings: ['preferences', 'config', 'options', 'gear', 'configure'],
    shrink: ['collapse', 'minimize', 'compress', 'reduce', 'decrease', 'zoom out', 'scale down'],
    skin: ['dermatology', 'epidermis', 'dermal', 'health', 'medical', 'texture'],
    skull: ['danger', 'death', 'dead', 'poison', 'skeleton'],
    smartphone: ['phone', 'mobile', 'device', 'cell'],
    smb: ['server', 'shared', 'samba', 'nas', 'storage'],
    snow: ['weather', 'cold', 'winter', 'freeze'],
    snowman: ['winter', 'cold', 'holiday', 'snow'],
    sources: ['origin', 'input', 'references', 'links'],
    sparkle: ['shine', 'star', 'magical', 'twinkle', 'glitter', 'special', 'bright', 'highlight'],
    speaker: ['sound', 'audio', 'volume', 'music'],
    speedometer: ['mileage', 'odometer', 'distance', 'speed', 'km', 'miles', 'travel', 'vehicle', 'odometer'],
    ssl: ['certificate', 'secure', 'encrypted', 'https'],
    staple: ['office', 'attach', 'paper', 'fasten'],
    status: ['state', 'condition', 'info', 'indicator'],
    stop: ['halt', 'end', 'terminate', 'finish'],
    streaming: ['video', 'live', 'broadcast', 'media'],
    sugar: ['sweet', 'nutrition', 'food', 'carbs'],
    sun: ['weather', 'light', 'day', 'warmth', 'brightness'],
    surgery: ['medical', 'operation', 'hospital', 'scalpel'],
    synchronize: ['sync', 'update', 'refresh', 'reload'],
    table: ['grid', 'data', 'rows', 'columns', 'list'],
    target: ['goal', 'aim', 'focus', 'objective'],
    technical: [
        'engineering',
        'developer',
        'system',
        'gear',
        'mechanics',
        'maintenance',
        'ops',
        'setup',
        'preferences',
        'circuit',
        'specs',
        'hardware',
        'electronics',
        'diagnostics',
        'schematic',
        'service',
    ],
    teeth: ['dentist', 'medical', 'oral', 'health'],
    thermometer: ['temperature', 'heat', 'cold', 'weather'],
    time: ['clock', 'hour', 'minute', 'schedule'],
    toolbox: ['equipment', 'tools', 'kit', 'gear', 'hardware', 'instrument', 'apparatus', 'kit', 'supplies'],
    train: ['railway', 'subway', 'metro', 'rail', 'locomotive', 'tram', 'underground', 'transit', 'commute'],
    transactions: ['payments', 'money', 'finance', 'history'],
    tree: ['nature', 'forest', 'wood', 'outdoor'],
    'trend-down': ['chart', 'analytics', 'decrease', 'pattern'],
    'trend-up': ['chart', 'analytics', 'growth', 'pattern'],
    trip: ['journey', 'travel', 'suitcase', 'luggage', 'vacation', 'holiday', 'voyage', 'getaway'],
    tv: ['television', 'screen', 'video', 'display'],
    unarchive: ['restore', 'retrieve', 'unbox', 'extract'],
    unassociated: ['unlinked', 'disconnected', 'separate', 'orphan'],
    unmute: ['sound', 'volume', 'audio', 'on'],
    upload: ['import', 'add', 'send', 'transfer'],
    upnp: ['plug-and-play', 'streaming', 'discovery', 'device'],
    user: ['person', 'profile', 'account', 'avatar'],
    users: ['people', 'group', 'team', 'accounts'],
    vacuum: ['cleaner', 'appliance', 'cleaning'],
    vegetables: ['carrot', 'greens', 'plant', 'organic', 'groceries', 'salad', 'vegan', 'fresh'],
    video: ['camera', 'recording', 'film', 'media'],
    view: ['eye', 'see', 'show', 'display', 'preview', 'look'],
    wait: ['loading', 'pending', 'spinner', 'progress'],
    wan: ['network', 'wide-area', 'connectivity', 'external'],
    warning: ['alert', 'caution', 'danger', 'attention'],
    web: ['internet', 'browser', 'world', 'global', 'url'],
    wifi: ['wireless', 'signal', 'connection', 'hotspot'],
    wind: ['weather', 'air', 'breeze', 'storm'],
    workout: ['exercise', 'fitness', 'gym', 'training', 'sport', 'strength', 'power'],
    wrench: ['tool', 'fix', 'settings', 'repair', 'config'],
    yoga: ['health', 'zen', 'stretch', 'meditation', 'pose'],
    youtube: ['video', 'streaming', 'channel', 'play', 'social', 'media', 'creator', 'watch'],
    'caret-left': ['arrow', 'back', 'previous', 'collapse'],
    'caret-right': ['arrow', 'next', 'forward', 'expand'],
    'battery-charging': ['power', 'energy', 'plugin', 'voltage', 'status'],
    'credit-card': ['payment', 'shop', 'checkout', 'visa', 'mastercard', 'money'],
    bank: ['finance', 'institution', 'building', 'account', 'wire-transfer'],
    'folder-open': ['directory', 'files', 'storage', 'active', 'expanded'],
    'filetype-typescript': ['code', 'programming', 'js', 'script', 'type-safe', 'ts'],
    scss: ['styles', 'css', 'sass', 'design', 'frontend'],
    dns: ['server', 'domain', 'network', 'ip', 'lookup'],
    ajax: ['xml', 'http-request', 'ajax'],
    api: ['json', 'api', 'web-service'],
    'filetype-avi': ['filetype', 'avi'],
    'filetype-bat': ['filetype', 'bat'],
    'filetype-c': ['filetype', 'c'],
    'filetype-css': ['filetype', 'css'],
    'filetype-csv': ['filetype', 'csv'],
    'filetype-doc': ['filetype', 'doc'],
    'filetype-docx': ['filetype', 'docx'],
    'filetype-gif': ['filetype', 'gif'],
    'filetype-html': ['filetype', 'html'],
    'filetype-ico': ['filetype', 'ico'],
    'filetype-ini': ['filetype', 'ini'],
    'filetype-javascript': ['filetype', 'javascript'],
    'filetype-jpeg': ['filetype', 'jpeg'],
    'filetype-jpg': ['filetype', 'jpg'],
    'filetype-json': ['filetype', 'json'],
    'filetype-less': ['filetype', 'less'],
    'filetype-mp3': ['filetype', 'mp3'],
    'filetype-mp4': ['filetype', 'mp4'],
    'filetype-mpg': ['filetype', 'mpg'],
    'filetype-php': ['filetype', 'php'],
    'filetype-png': ['filetype', 'png'],
    'filetype-ppt': ['filetype', 'ppt'],
    'filetype-psd': ['filetype', 'psd'],
    'filetype-rar': ['filetype', 'rar'],
    'filetype-sass': ['filetype', 'sass'],
    'filetype-sql': ['filetype', 'sql'],
    'filetype-tiff': ['filetype', 'tiff'],
    'filetype-txt': ['filetype', 'txt'],
    'filetype-wav': ['filetype', 'wav'],
    'filetype-xls': ['filetype', 'xls'],
    'filetype-xlsx': ['filetype', 'xlsx'],
    'filetype-zip': ['filetype', 'zip'],
    avocado: ['fruit', 'healthy', 'fat', 'green', 'guacamole'],
    banana: ['fruit', 'yellow', 'potassium', 'snack'],
    bath: ['hygiene', 'bathroom', 'shower', 'relax', 'clean'],
    beer: ['alcohol', 'drink', 'bar', 'party', 'pub'],
    blood: ['medical', 'health', 'emergency', 'donor', 'red'],
    blueberries: ['fruit', 'berry', 'antioxidant', 'blue', 'healthy'],
    bread: ['bakery', 'food', 'wheat', 'carbs', 'toast'],
    'broken-heart': ['sad', 'love', 'divorce', 'end', 'feeling'],
    'cd-dvd': ['media', 'disc', 'storage', 'music', 'video', 'retro'],
    cheese: ['dairy', 'food', 'yellow', 'slice', 'pizza'],
    cherries: ['fruit', 'berry', 'red', 'sweet'],
    chicken: ['animal', 'meat', 'farm', 'food', 'poultry'],
    chocolate: ['sweet', 'dessert', 'sugar', 'treat', 'cocoa'],
    compass: ['navigation', 'direction', 'travel', 'map', 'north'],
    corn: ['vegetable', 'farm', 'yellow', 'maize', 'food'],
    'crystal-globe': ['magic', 'future', 'fortune', 'prediction', 'glass'],
    cucumber: ['vegetable', 'green', 'fresh', 'salad', 'healthy'],
    dolphin: ['animal', 'ocean', 'sea', 'swim', 'intelligent'],
    dragon: ['fantasy', 'myth', 'fire', 'monster', 'legend'],
    duck: ['animal', 'bird', 'pond', 'water', 'quack'],
    egg: ['breakfast', 'food', 'protein', 'chicken', 'oval'],
    eggplant: ['vegetable', 'purple', 'aubergine', 'food'],
    elephant: ['animal', 'big', 'nature', 'trunk', 'safari'],
    fish: ['animal', 'ocean', 'sea', 'food', 'swimming'],
    'french-fries': ['fast-food', 'potato', 'snack', 'salty', 'junk-food'],
    gun: ['weapon', 'danger', 'security', 'shooting', 'military'],
    hiking: ['sport', 'mountain', 'walking', 'nature', 'outdoor', 'trekking'],
    hospital: ['medical', 'health', 'doctor', 'emergency', 'clinic'],
    'ice-cream': ['dessert', 'cold', 'sweet', 'summer', 'gelato'],
    joystick: ['game', 'controller', 'play', 'console', 'gaming'],
    knife: ['tool', 'cut', 'kitchen', 'weapon', 'sharp'],
    lantern: ['light', 'dark', 'lamp', 'camping', 'outdoor'],
    lemon: ['fruit', 'sour', 'citrus', 'yellow', 'acid'],
    magnet: ['force', 'physics', 'attract', 'pull', 'metal'],
    meat: ['food', 'protein', 'beef', 'pork', 'steak', 'butcher'],
    melon: ['fruit', 'summer', 'sweet', 'watery', 'green'],
    microscope: ['science', 'lab', 'research', 'biology', 'zoom'],
    milk: ['dairy', 'drink', 'white', 'calcium', 'cow'],
    monkey: ['animal', 'primate', 'jungle', 'funny'],
    mushroom: ['nature', 'fungi', 'forest', 'food', 'poisonous'],
    pepper: ['vegetable', 'spicy', 'hot', 'chili', 'seasoning'],
    pig: ['animal', 'farm', 'pink', 'pork', 'bacon'],
    pill: ['medical', 'medicine', 'drug', 'pharmacy', 'health'],
    pizza: ['food', 'italian', 'slice', 'fast-food', 'cheese'],
    'police-man': ['security', 'officer', 'law', 'safety', 'authority'],
    police: ['security', 'emergency', 'law', 'emergency-services', 'siren'],
    potato: ['vegetable', 'root', 'food', 'carbs', 'earth'],
    radio: ['audio', 'music', 'broadcast', 'news', 'old-school'],
    rice: ['food', 'grain', 'asian', 'carbs', 'white'],
    running: ['sport', 'exercise', 'cardio', 'fitness', 'fast'],
    salad: ['food', 'healthy', 'vegetables', 'green', 'diet'],
    school: ['education', 'learn', 'building', 'class', 'students'],
    ship: ['transport', 'water', 'ocean', 'boat', 'vessel', 'travel'],
    snake: ['animal', 'reptile', 'danger', 'poison', 'slither'],
    strawberry: ['fruit', 'berry', 'red', 'sweet', 'summer'],
    taxi: ['transport', 'car', 'city', 'ride', 'yellow'],
    telescope: ['science', 'space', 'astronomy', 'stars', 'zoom'],
    turkey: ['animal', 'bird', 'thanksgiving', 'meat', 'farm'],
    turtle: ['animal', 'reptile', 'slow', 'shell', 'sea'],
    active: ['status', 'online', 'enabled', 'running', 'live', 'on'],
    group: ['combine', 'folder', 'collection', 'cluster', 'batch', 'organize'],
    inactive: ['status', 'offline', 'disabled', 'paused', 'off', 'idle'],
    threshold: ['limit', 'boundary', 'trigger', 'level', 'maximum', 'minimum', 'range'],
    ungroup: ['separate', 'split', 'detach', 'break-apart', 'release', 'expand'],
    pawn: ['chess', 'game', 'piece', 'strategy', 'player', 'token'],
    ball: ['sphere', 'sport', 'circle', 'round', 'play', 'game'],
    bullet: ['dot', 'list', 'marker', 'point', 'item', 'circle'],
    dot: ['point', 'list', 'circle', 'item', 'marker'],
    calendarDay: ['today', 'date', 'schedule', 'event', 'daily', '24h'],
    calendarWeek: ['weekly', 'planning', 'work-week', 'timeline', 'seven-days'],
    calendarMonth: ['monthly', 'grid', 'agenda', 'billing-cycle', 'view'],
    calendarYear: ['yearly', 'annual', 'long-term', 'roadmap', 'full-year'],
    scan: ['barcode', 'qr-code', 'optical', 'reader', 'identity', 'search', 'analyze', 'document'],
    coffee: ['drink', 'caffeine', 'mug', 'cup', 'break', 'cafe', 'morning', 'energy'],
    ruler: ['measure', 'measurement', 'size', 'length', 'dimensions', 'scale', 'tools', 'design', 'precision'],
    trophy: ['winner', 'achievement', 'award', 'prize', 'victory', 'success', 'competition', 'cup'],
    strength: ['power', 'muscle', 'fitness', 'strong', 'intensity', 'durability', 'security', 'force'],
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

const copyToClipboard = async (content: string) => {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!copied) {
        throw new Error('Clipboard copy failed');
    }
};

export const IconsPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [toast, setToast] = useState<ToastDetails | null>(null);

    const normalizedQuery = query.trim().toLowerCase();
    const filteredIcons = useMemo(() => iconEntries.filter(icon => !normalizedQuery || icon.keywords.includes(normalizedQuery)), [normalizedQuery]);
    const showCopyResult = useCallback(async (content: string, successMessage: string) => {
        try {
            await copyToClipboard(content);
            setToast({ message: successMessage, type: 'success' });
        } catch {
            setToast({ message: 'Could not copy to clipboard', type: 'danger' });
        }
    }, []);

    const handleTagCopy = useCallback(
        (icon: IconEntry) => {
            void showCopyResult(icon.filePath, `${icon.filePath} copied to clipboard`);
        },
        [showCopyResult]
    );

    return (
        <div className="icons-page">
            {toast && <Toast message={toast.message} type={toast.type} timeout={2000} onClose={() => setToast(null)} />}

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
                                <button
                                    type="button"
                                    className="icons-page__preview"
                                    onClick={() => handleTagCopy(icon)}
                                    aria-label={`Copy ${icon.name} icon SVG`}
                                    title="Copy icon SVG"
                                >
                                    {renderIcon(icon.value)}
                                </button>
                                <strong className="icons-page__name">{icon.name}</strong>
                                <button
                                    type="button"
                                    className="icons-page__path"
                                    onClick={() => handleTagCopy(icon)}
                                    aria-label={`Copy ${icon.filePath}`}
                                    title="Copy icon tag"
                                >
                                    {icon.filePath}
                                </button>
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
