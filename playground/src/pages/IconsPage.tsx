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

            return [
                {
                    id: `${normalizedPath}:${exportName}`,
                    filePath: normalizedPath,
                    keywords: [name, exportName, fileName, normalizedPath].join(' ').toLowerCase(),
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
    const filteredIcons = useMemo(
        () => iconEntries.filter(icon => !normalizedQuery || icon.keywords.includes(normalizedQuery)),
        [normalizedQuery]
    );

    return (
        <div className="icons-page">
            <header className="icons-page__header">
                <div>
                    <h1>Icons</h1>
                    <p>Browse every icon available under <code>src/icons</code>. New icon files appear here automatically.</p>
                </div>

                <div className="icons-page__search">
                    <Search value={query} onChange={setQuery} placeholder="Search icons by file name or export..." />
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
