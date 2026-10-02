import { CSSProperties, FC, useMemo, useState } from 'react';

import { iconAliases } from '@memobit/icons';
import { iconMap } from '@memobit/icons/map';

import { Icon, IconName } from '../Icon';
import { InputSearch } from '../InputSearch';
import { Tooltip } from '../Tooltip';

import './IconPicker.scss';

/** Derived from the map rather than a second list, so a new icon appears here by existing. */
const ALL_ICONS = Object.keys(iconMap) as IconName[];

export interface IconPickerProps {
    value?: IconName;
    onChange?: (icon: IconName) => void;
    /**
     * Tints the swatches, so a picker attached to a colour choice previews the icon as it
     * will actually appear. Icons draw in `currentColor`; omit for the inherited colour.
     */
    color?: string;
    /** Restricts the choice. Useful where only a themed subset makes sense. */
    icons?: IconName[];
    placeholder?: string;
    emptyLabel?: string;
}

/**
 * Search and pick one of the library's icons.
 *
 * One flat grid behind a search box. Categories were tried and removed: 25 of them in a
 * horizontal scroller cost two rows of the panel and still did not answer "which bucket
 * did they file a knife under" — you cannot browse your way to one icon out of 478, so
 * the honest affordance is typing. The grid stays scrollable for the times you genuinely
 * want to look around.
 *
 * The counterpart to `EmojiPicker`, and usually the better of the two for labelling a
 * user's own records: an icon inherits `currentColor`, so it can carry the colour the
 * record already has, and it is drawn at the same weight as the rest of the interface
 * instead of arriving as a platform-coloured bitmap that renders differently on every
 * device. Emoji still win on sheer vocabulary, so offering both is reasonable.
 */
export const IconPicker: FC<IconPickerProps> = ({
    color,
    emptyLabel = 'No icons match',
    icons,
    onChange,
    placeholder = 'Search icons...',
    value,
}: IconPickerProps) => {
    const [search, setSearch] = useState('');

    const available = useMemo(() => icons ?? ALL_ICONS, [icons]);

    const shown = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return available;
        }

        // Names are kebab-case, so a search for "credit card" should still find
        // "credit-card" — match against the separators flattened out too.
        const flattened = term.replace(/[\s-]+/g, '');
        const matchesText = (text: string): boolean => text.includes(term) || text.replace(/-/g, '').includes(flattened);

        // Aliases as well as names, otherwise the only way in is guessing what the icon
        // was filed as: "eye" never reaches `view`, "photo" never reaches `gallery`.
        return available.filter(name => matchesText(name) || (iconAliases[name] ?? []).some(matchesText));
    }, [available, search]);

    return (
        <div className="icon-picker">
            <div className="icon-picker__search">
                <InputSearch autoFocus onChange={setSearch} placeholder={placeholder} value={search} />
            </div>

            <div className="icon-picker__grid">
                {shown.length === 0 ? (
                    <p className="icon-picker__empty">{emptyLabel}</p>
                ) : (
                    shown.map(name => (
                        // The name is the only thing identifying a glyph here, so it is worth a
                        // real tooltip: a native `title` waits a second, renders in the OS style
                        // and reads as a stray grey box in the middle of a themed panel.
                        <Tooltip key={name} title={name}>
                            <button
                                className={`icon-picker__icon${value === name ? ' is-selected' : ''}`}
                                onClick={() => onChange?.(name)}
                                style={color ? ({ color } as CSSProperties) : undefined}
                                type="button"
                            >
                                <Icon name={name} />
                            </button>
                        </Tooltip>
                    ))
                )}
            </div>

            <p className="icon-picker__count">{shown.length === available.length ? `${available.length} icons` : `${shown.length} of ${available.length}`}</p>
        </div>
    );
};
