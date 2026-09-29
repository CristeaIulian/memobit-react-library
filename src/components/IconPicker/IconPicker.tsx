import { CSSProperties, FC, useMemo, useState } from 'react';

import { Icon, IconName } from '../Icon';
import { iconCategoryByPath, iconCategoryDefinitions, OTHER_CATEGORY_ID } from '../Icon/iconCategories';
import { iconMap } from '../Icon/iconMap';
import { InputSearch } from '../InputSearch';

import './IconPicker.scss';

/** Derived from the map rather than a second list, so a new icon appears here by existing. */
const ALL_ICONS = Object.keys(iconMap) as IconName[];

interface PickerGroup {
    id: string;
    label: string;
    icons: IconName[];
}

/**
 * Buckets the available icons by the library's own categories, keeping each category's
 * curated order. Anything uncategorised lands in a trailing group rather than vanishing —
 * a missing category entry should be visible, not silently hide the icon.
 */
const groupIcons = (available: IconName[]): PickerGroup[] => {
    const remaining = new Set(available);
    const groups: PickerGroup[] = [];

    iconCategoryDefinitions.forEach(category => {
        const icons = category.icons.filter((name): name is IconName => remaining.has(name as IconName));

        if (icons.length > 0) {
            icons.forEach(name => remaining.delete(name));
            groups.push({ id: category.id, label: category.label, icons });
        }
    });

    if (remaining.size > 0) {
        groups.push({ id: OTHER_CATEGORY_ID, label: 'Other', icons: available.filter(name => remaining.has(name)) });
    }

    return groups;
};

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
    /**
     * Set false for one flat list. Grouping is on by default because 480 icons is more than
     * anyone scrolls through blind, and a category is the fastest way in when you cannot
     * name the thing you are looking for.
     */
    grouped?: boolean;
}

/**
 * Search and pick one of the library's icons.
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
    grouped = true,
    icons,
    onChange,
    placeholder = 'Search icons...',
    value,
}: IconPickerProps) => {
    const [search, setSearch] = useState('');

    const available = useMemo(() => icons ?? ALL_ICONS, [icons]);
    const groups = useMemo(() => (grouped ? groupIcons(available) : []), [available, grouped]);

    // Opens on whichever category holds the current value, so reopening the picker shows
    // the neighbourhood of what is already chosen rather than the top of the list.
    const [activeCategory, setActiveCategory] = useState<string>(
        () => (value && iconCategoryByPath.get(value)) || groupIcons(icons ?? ALL_ICONS)[0]?.id || OTHER_CATEGORY_ID
    );

    const searchResults = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return null;
        }

        // Names are kebab-case, so a search for "credit card" should still find
        // "credit-card" — match against the separators flattened out too.
        const flattened = term.replace(/[\s-]+/g, '');

        return available.filter(name => name.includes(term) || name.replace(/-/g, '').includes(flattened));
    }, [available, search]);

    const activeGroup = groups.find(group => group.id === activeCategory) ?? groups[0];
    const shown = searchResults ?? (grouped ? (activeGroup?.icons ?? []) : available);

    return (
        <div className="icon-picker">
            <div className="icon-picker__search">
                <InputSearch autoFocus onChange={setSearch} placeholder={placeholder} value={search} />
            </div>

            {grouped && !searchResults && groups.length > 1 && (
                <div className="icon-picker__categories">
                    {groups.map(group => (
                        <button
                            className={`icon-picker__cat-btn${activeGroup?.id === group.id ? ' is-active' : ''}`}
                            key={group.id}
                            onClick={() => setActiveCategory(group.id)}
                            type="button"
                        >
                            {group.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="icon-picker__grid">
                {shown.length === 0 ? (
                    <p className="icon-picker__empty">{emptyLabel}</p>
                ) : (
                    shown.map(name => (
                        <button
                            className={`icon-picker__icon${value === name ? ' is-selected' : ''}`}
                            key={name}
                            onClick={() => onChange?.(name)}
                            style={color ? ({ color } as CSSProperties) : undefined}
                            title={name}
                            type="button"
                        >
                            <Icon name={name} />
                        </button>
                    ))
                )}
            </div>

            <p className="icon-picker__count">
                {searchResults ? `${searchResults.length} of ${available.length}` : `${shown.length} in ${activeGroup?.label ?? 'all'}`}
            </p>
        </div>
    );
};
