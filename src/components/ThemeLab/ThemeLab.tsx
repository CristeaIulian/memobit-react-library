import { FC, useState } from 'react';

import { AUTHORED_THEMES } from '@memobit/themes';

import { Button } from '../Button';
import { Chip } from '../Chip';
import { Icon } from '../Icon';
import { getThemeConfig } from '../ThemeSettings/themeConfig';
import { type Theme } from '../ThemeSettings/ThemeContextValue';
import { useTheme } from '../ThemeSettings/useTheme';
import { ToggleButtons } from '../ToggleButtons';
import { Tooltip } from '../Tooltip';

import { type ThemeEngine, useThemeLab } from './useThemeLab';

import './ThemeLab.scss';

export interface ThemeLabProps {
    /** Where the chosen engine is remembered. Defaults to one key shared by every app on the origin. */
    storageKey?: string;
}

const ENGINE_STATES = [
    { key: 'classic', label: 'v1 Classic' },
    { key: 'authored', label: 'v2 Authored' },
];

const AUTHORED_IDS = new Set<string>(AUTHORED_THEMES.map(theme => theme.id));

const isClassicTheme = (value: string): value is Theme => getThemeConfig(value) !== undefined;

/**
 * Dev tool: switches the app between a classic theme (v1) and its hand-made authored version
 * (v2) from @memobit/themes 2.0, so the two can be compared on real pages. Render it inside
 * ThemeProvider, import `@memobit/themes/authored.css` in the app, and load it lazily behind
 * `import.meta.env.DEV` so production builds leave it out.
 */
export const ThemeLab: FC<ThemeLabProps> = ({ storageKey = 'memobit:theme-lab' }) => {
    const { theme: classicTheme, setPreviewTheme } = useTheme();
    const { engine, setEngine } = useThemeLab(storageKey);
    const [open, setOpen] = useState(false);

    const summaries: Record<ThemeEngine, string> = {
        classic: `v1 · ${classicTheme}`,
        authored: `v2 authored · ${classicTheme}`,
    };

    if (!open) {
        return (
            <button type="button" className="theme-lab__pill" onClick={() => setOpen(true)}>
                <Icon name="theme-picker" />
                {summaries[engine]}
            </button>
        );
    }

    return (
        <div className="theme-lab">
            <div className="theme-lab__header">
                <span className="theme-lab__title">Theme lab</span>
                <span className="theme-lab__hint">Press \ to flip v1 / v2</span>
                <Tooltip title="Collapse">
                    <Button variant="ghost" size="small" icon="minus" onClick={() => setOpen(false)} />
                </Tooltip>
            </div>

            <ToggleButtons
                states={ENGINE_STATES}
                state={engine}
                size="small"
                onToggleChange={value => setEngine(value === 'authored' ? 'authored' : 'classic')}
            />

            <span className="theme-lab__note">
                {engine === 'classic'
                    ? `v1 shows the classic theme "${classicTheme}".`
                    : AUTHORED_IDS.has(classicTheme)
                      ? `v2 is "${classicTheme}" written as its design choices, with every component value derived from them.`
                      : `"${classicTheme}" has no authored version yet, so v1 shows through. Pick one below.`}
            </span>

            <div className="theme-lab__axis">
                <span className="theme-lab__axis-label">Authored themes</span>
                <div className="theme-lab__chips">
                    {AUTHORED_THEMES.map(theme => (
                        <Chip
                            key={theme.id}
                            size="small"
                            selected={theme.id === classicTheme}
                            onClick={() => isClassicTheme(theme.id) && setPreviewTheme(theme.id)}
                        >
                            {theme.label}
                        </Chip>
                    ))}
                </div>
            </div>
        </div>
    );
};
