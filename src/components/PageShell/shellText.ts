import { LibMessages } from '../../contexts/LanguageContext/libMessages';

import { BuiltInViewMode, PageShellProps, PageViewMode } from './PageShell.types';

/** The line under the title: the list's size from `counts` and `noun`, then the page's own `heading`. */
export const getHeadingText = ({ counts, noun, heading }: Pick<PageShellProps, 'counts' | 'noun' | 'heading'>, t: LibMessages): string =>
    [counts && noun ? t.pageItemCount(counts.shown, counts.total, noun.one, noun.other) : undefined, heading].filter(Boolean).join(' · ');

/** The text of the "Show N" buttons: the page's override, else built from `noun`, else "Show N results". */
export const getResultLabel = ({ noun, resultLabel }: Pick<PageShellProps, 'noun' | 'resultLabel'>, t: LibMessages): ((count: number) => string) =>
    resultLabel ?? (noun ? (count: number) => t.pageShowItems(count, noun.one, noun.other) : t.pageShowResults);

const builtInViewMode = (mode: BuiltInViewMode, t: LibMessages): PageViewMode => {
    switch (mode) {
        case 'cards':
            return { value: mode, label: t.viewGrid, icon: 'grid' };
        case 'table':
            return { value: mode, label: t.viewTable, icon: 'table' };
        case 'gallery':
            return { value: mode, label: t.viewGallery, icon: 'gallery' };
        case 'calendar':
            return { value: mode, label: t.pageViewCalendar, icon: 'calendar' };
        case 'map':
            return { value: mode, label: t.pageViewMap, icon: 'map' };
    }
};

/** View modes with built-in ones expanded to their translated label and icon. */
export const resolveViewModes = (modes: Array<BuiltInViewMode | PageViewMode>, t: LibMessages): PageViewMode[] =>
    modes.map(mode => (typeof mode === 'string' ? builtInViewMode(mode, t) : mode));
