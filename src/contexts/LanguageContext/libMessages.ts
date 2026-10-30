import { roCount, roNumberBeforeNoun } from '../../helpers/Language';

import type { Localized } from './LanguageContext.context';

// The library's own UI text. Internal: apps keep their text in their own messages files.
const en = {
    // Shared
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    confirm: 'Confirm',
    filters: 'Filters',

    // Drawer
    back: 'Back',
    closeDrawer: 'Close drawer',

    // Modal
    closeModal: 'Close modal',

    // DataView
    noData: 'No data available',
    pinned: 'Pinned',
    groupPartCount: (shown: number, total: number) => `${shown} of ${total}`,
    columns: 'Columns',
    actions: 'Actions',
    clearSelection: 'Clear selection',
    selectThese: (count: number) => `Select these ${count}`,
    noColumnsTitle: 'No columns selected',
    noColumnsHint: 'Use the Columns button above to pick which columns to display.',
    sortBy: 'Sort by',
    sortByPlaceholder: 'Sort by...',
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    resultsCount: (start: number, end: number, total: number, suffix: string) => `Showing ${start}-${end} of ${total}${suffix}`,
    resultsCountFiltered: (start: number, end: number, filtered: number, total: number, suffix: string) =>
        `Showing ${start}-${end} of ${filtered} filtered${suffix} (${total} total)`,

    // Pagination
    rows: 'Rows',
    previous: 'Previous',
    next: 'Next',
    pageOf: (page: number, total: number) => `Page ${page} of ${total}`,

    // ControlPanel
    panelKeepOpen: 'Keep the panel open beside the page',
    panelHide: 'Hide the panel, and open it from the toolbar when needed',
    clearFilters: 'Clear filters',
    filterOn: 'On',
    filterUntil: (date: string) => `until ${date}`,
    filterFrom: (date: string) => `from ${date}`,
    filterStaleHint: 'No longer available. Click to remove.',
    filterStaleDetails: 'No longer available',
    rangeMin: 'Min',
    rangeMax: 'Max',
    rangeMinExceedsMax: 'Min exceeds max',
    rangeMaxBelowMin: 'Max is below min',
    selectRange: 'Select range',
    datePresetDays: (days: number) => `${days}d`,
    filterPlaceholder: 'Filter...',
    viewGrid: 'Grid',
    viewTable: 'Table',
    viewGallery: 'Gallery',
    options: 'Options',
    groupBy: 'Group by',
    visibleColumns: 'Visible columns',

    // Toolbar
    search: 'Search',
    showToolbar: 'Show the toolbar',
    hideToolbar: 'Hide the toolbar',

    // DatePicker
    selectDate: 'Select date...',

    // Calendar
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    // Sunday first, as Date.getDay() counts.
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    previousYears: 'Previous years',
    nextYears: 'Next years',
    previousYear: 'Previous year',
    nextYear: 'Next year',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    today: 'Today',

    // Dropdown
    selectOption: 'Select an option',
    selectedCount: (count: number) => `${count} selected`,
    selectedWithOthers: (labels: string, others: number) => `${labels} (+${others} ${others === 1 ? 'other' : 'others'})`,
    createOption: (value: string) => `Create “${value}”`,
    noOptions: 'No options found',
    remove: 'Remove',

    // InputSearch
    searchPlaceholder: 'Search...',
    clearSearch: 'Clear search',

    // InputDate
    clearDate: 'Clear date',
    openCalendar: 'Open calendar',

    // ThemeSettings
    themeSettings: 'Theme Settings',
    selectTheme: 'Select Theme',
    searchThemes: 'Search themes...',
    themesForApp: (app: string) => `For ${app}`,
    favorites: 'Favorites',
    appearanceAll: 'All',
    appearanceLight: 'Light',
    appearanceDark: 'Dark',
    noThemes: 'No themes found',
    componentEffect: 'Component Effect',
    chooseEffect: 'Choose an effect',
    applyEffectTo: 'Apply Effect To:',
    effectNone: 'None',
    effectNoteContainer: 'Note Container',
    effectInfuse: 'Infuse',
    effectUpLift: 'Up Lift',
    effectGlow: 'Glow',
    effectComponentCard: 'Card',
    effectComponentModal: 'Modal',
    saveChanges: 'Save changes',

    // ScrollToTop
    scrollToTop: 'Scroll to top',

    // TipsOfTheDay
    tipOfTheDay: 'Tip Of The Day',

    // Banner
    dismiss: 'Dismiss',
};

const ro: typeof en = {
    // Shared
    cancel: 'Anulează',
    clear: 'Șterge',
    close: 'Închide',
    confirm: 'Confirmă',
    filters: 'Filtre',

    // Drawer
    back: 'Înapoi',
    closeDrawer: 'Închide panoul',

    // Modal
    closeModal: 'Închide fereastra',

    // DataView
    noData: 'Nu există date',
    pinned: 'Fixat',
    groupPartCount: (shown, total) => `${shown} din ${total}`,
    columns: 'Coloane',
    actions: 'Acțiuni',
    clearSelection: 'Șterge selecția',
    selectThese: count => (count === 1 ? 'Selectează-l pe acesta' : `Selectează aceste ${count}`),
    noColumnsTitle: 'Nicio coloană selectată',
    noColumnsHint: 'Folosește butonul Coloane de mai sus ca să alegi ce coloane se afișează.',
    sortBy: 'Sortează după',
    sortByPlaceholder: 'Sortează după...',
    sortAscending: 'Sortează crescător',
    sortDescending: 'Sortează descrescător',
    resultsCount: (start, end, total, suffix) => `Se afișează ${start}-${end} din ${suffix ? roNumberBeforeNoun(total) : total}${suffix}`,
    resultsCountFiltered: (start, end, filtered, total, suffix) =>
        `Se afișează ${start}-${end} din ${suffix ? roNumberBeforeNoun(filtered) : filtered}${suffix} filtrate (${total} în total)`,

    // Pagination
    rows: 'Rânduri',
    previous: 'Anterioara',
    next: 'Următoarea',
    pageOf: (page, total) => `Pagina ${page} din ${total}`,

    // ControlPanel
    panelKeepOpen: 'Ține panoul deschis lângă pagină',
    panelHide: 'Ascunde panoul și deschide-l din bara de instrumente când ai nevoie',
    clearFilters: 'Șterge filtrele',
    filterOn: 'Activ',
    filterUntil: date => `până la ${date}`,
    filterFrom: date => `de la ${date}`,
    filterStaleHint: 'Nu mai este disponibil. Apasă ca să elimini.',
    filterStaleDetails: 'Nu mai este disponibil',
    rangeMin: 'Min',
    rangeMax: 'Max',
    rangeMinExceedsMax: 'Min depășește max',
    rangeMaxBelowMin: 'Max este sub min',
    selectRange: 'Alege intervalul',
    datePresetDays: days => `${days}z`,
    filterPlaceholder: 'Filtrează...',
    viewGrid: 'Grilă',
    viewTable: 'Tabel',
    viewGallery: 'Galerie',
    options: 'Opțiuni',
    groupBy: 'Grupează după',
    visibleColumns: 'Coloane vizibile',

    // Toolbar
    search: 'Caută',
    showToolbar: 'Arată bara de instrumente',
    hideToolbar: 'Ascunde bara de instrumente',

    // DatePicker
    selectDate: 'Alege data...',

    // Calendar
    monthNames: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
    dayNamesShort: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],
    previousYears: 'Anii anteriori',
    nextYears: 'Anii următori',
    previousYear: 'Anul anterior',
    nextYear: 'Anul următor',
    previousMonth: 'Luna anterioară',
    nextMonth: 'Luna următoare',
    today: 'Azi',

    // Dropdown
    selectOption: 'Alege o opțiune',
    selectedCount: count => roCount(count, 'selectată', 'selectate'),
    selectedWithOthers: (labels, others) => `${labels} (+${roCount(others, 'alta', 'altele')})`,
    createOption: value => `Creează „${value}”`,
    noOptions: 'Nu s-au găsit opțiuni',
    remove: 'Elimină',

    // InputSearch
    searchPlaceholder: 'Caută...',
    clearSearch: 'Șterge căutarea',

    // InputDate
    clearDate: 'Șterge data',
    openCalendar: 'Deschide calendarul',

    // ThemeSettings
    themeSettings: 'Setări temă',
    selectTheme: 'Alege tema',
    searchThemes: 'Caută teme...',
    themesForApp: app => `Pentru ${app}`,
    favorites: 'Favorite',
    appearanceAll: 'Toate',
    appearanceLight: 'Deschise',
    appearanceDark: 'Închise',
    noThemes: 'Nu s-au găsit teme',
    componentEffect: 'Efect pentru componente',
    chooseEffect: 'Alege un efect',
    applyEffectTo: 'Aplică efectul la:',
    effectNone: 'Niciunul',
    effectNoteContainer: 'Container de notă',
    effectInfuse: 'Infuzie',
    effectUpLift: 'Ridicare',
    effectGlow: 'Strălucire',
    effectComponentCard: 'Card',
    effectComponentModal: 'Fereastră modală',
    saveChanges: 'Salvează modificările',

    // ScrollToTop
    scrollToTop: 'Mergi sus',

    // TipsOfTheDay
    tipOfTheDay: 'Sfatul zilei',

    // Banner
    dismiss: 'Închide',
};

export type LibMessages = typeof en;

export const libMessages: Localized<LibMessages> = { en, ro };
