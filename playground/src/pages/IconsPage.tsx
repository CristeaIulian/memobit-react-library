/// <reference types="vite/client" />
import React, { createElement, isValidElement, useCallback, useMemo, useState } from 'react';

import { InputSearch, Toast, type ToastDetails } from '../../../src';

import { iconAliases } from './iconsAliases';
import { OTHER_CATEGORY_ID, iconCategoryByPath, iconCategoryDefinitions, otherCategory, type IconCategory } from './iconsCategories';

import './IconsPage.scss';

type IconModule = Record<string, unknown>;

interface IconEntry {
    id: string;
    filePath: string;
    keywords: string;
    name: string;
    value: unknown;
    categoryId: string;
}

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

            const categoryId = iconCategoryByPath.get(normalizedPath) ?? OTHER_CATEGORY_ID;

            return [
                {
                    id: `${normalizedPath}:${exportName}`,
                    filePath: normalizedPath,
                    keywords: allKeywords.join(' ').toLowerCase(),
                    name,
                    value,
                    categoryId,
                },
            ];
        });
    })
    .sort((left, right) => left.name.localeCompare(right.name));

const iconCountsByCategory = iconEntries.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.categoryId] = (counts[entry.categoryId] ?? 0) + 1;
    return counts;
}, {});

const visibleCategories: IconCategory[] = [
    ...iconCategoryDefinitions.filter(category => (iconCountsByCategory[category.id] ?? 0) > 0),
    ...((iconCountsByCategory[OTHER_CATEGORY_ID] ?? 0) > 0 ? [otherCategory] : []),
];

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
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
    const [toast, setToast] = useState<ToastDetails | null>(null);

    const normalizedQuery = query.trim().toLowerCase();
    const filteredIcons = useMemo(
        () =>
            iconEntries.filter(icon => {
                const matchesQuery = !normalizedQuery || icon.keywords.includes(normalizedQuery);
                const matchesCategory = selectedCategoryId === 'all' || icon.categoryId === selectedCategoryId;
                return matchesQuery && matchesCategory;
            }),
        [normalizedQuery, selectedCategoryId]
    );

    const groupedIcons = useMemo(() => {
        if (selectedCategoryId !== 'all' || normalizedQuery) {
            return null;
        }

        const groups = new Map<string, IconEntry[]>();
        filteredIcons.forEach(icon => {
            const bucket = groups.get(icon.categoryId);
            if (bucket) {
                bucket.push(icon);
            } else {
                groups.set(icon.categoryId, [icon]);
            }
        });

        return visibleCategories.map(category => ({ category, icons: groups.get(category.id) ?? [] })).filter(group => group.icons.length > 0);
    }, [filteredIcons, normalizedQuery, selectedCategoryId]);
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
                    <InputSearch value={query} onChange={setQuery} placeholder="Search icons by name, keyword, or alias..." />
                </div>
            </header>

            <section className="page-section">
                <div className="icons-page__toolbar">
                    <h2>Available Icons</h2>
                    <span className="icons-page__count">
                        {filteredIcons.length} of {iconEntries.length}
                    </span>
                </div>

                <div className="icons-page__categories">
                    <button
                        type="button"
                        className={`icons-page__category${selectedCategoryId === 'all' ? ' icons-page__category--active' : ''}`}
                        onClick={() => setSelectedCategoryId('all')}
                    >
                        All <span className="icons-page__category-count">{iconEntries.length}</span>
                    </button>
                    {visibleCategories.map(category => {
                        const isActive = selectedCategoryId === category.id;
                        return (
                            <button
                                key={category.id}
                                type="button"
                                className={`icons-page__category${isActive ? ' icons-page__category--active' : ''}`}
                                onClick={() => setSelectedCategoryId(category.id)}
                            >
                                {category.label} <span className="icons-page__category-count">{iconCountsByCategory[category.id] ?? 0}</span>
                            </button>
                        );
                    })}
                </div>

                {filteredIcons.length === 0 && (
                    <div className="icons-page__empty">
                        <h3>No icons found</h3>
                        <p>Try a different search term or category.</p>
                    </div>
                )}

                {filteredIcons.length > 0 && groupedIcons && (
                    <div className="icons-page__groups">
                        {groupedIcons.map(group => (
                            <div key={group.category.id} className="icons-page__group">
                                <div className="icons-page__group-header">
                                    <h3>{group.category.label}</h3>
                                    <span className="icons-page__count">{group.icons.length}</span>
                                </div>
                                <div className="icons-page__grid">
                                    {group.icons.map(icon => (
                                        <article key={icon.id} className="icons-page__tile">
                                            <button
                                                type="button"
                                                className="icons-page__preview"
                                                onClick={() => handleTagCopy(icon)}
                                                title="Copy icon SVG"
                                            >
                                                {renderIcon(icon.value)}
                                            </button>
                                            <strong className="icons-page__name">{icon.name}</strong>
                                            <button
                                                type="button"
                                                className="icons-page__path"
                                                onClick={() => handleTagCopy(icon)}
                                                title="Copy icon tag"
                                            >
                                                {icon.filePath}
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredIcons.length > 0 && !groupedIcons && (
                    <div className="icons-page__grid">
                        {filteredIcons.map(icon => (
                            <article key={icon.id} className="icons-page__tile">
                                <button
                                    type="button"
                                    className="icons-page__preview"
                                    onClick={() => handleTagCopy(icon)}
                                    title="Copy icon SVG"
                                >
                                    {renderIcon(icon.value)}
                                </button>
                                <strong className="icons-page__name">{icon.name}</strong>
                                <button
                                    type="button"
                                    className="icons-page__path"
                                    onClick={() => handleTagCopy(icon)}
                                    title="Copy icon tag"
                                >
                                    {icon.filePath}
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
