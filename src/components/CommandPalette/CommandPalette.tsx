import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '../Button';
import { InputText } from '../InputText';

import './CommandPalette.scss';

export interface CommandItem {
    id: string;
    label: string;
    keywords?: string[];
    icon?: React.ReactNode;
    shortcut?: string;
    group?: string;
    onSelect: () => void;
}

export interface CommandPaletteProps {
    items: CommandItem[];
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    placeholder?: string;
    enableHotkey?: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
    items,
    isOpen,
    onOpenChange,
    placeholder = 'Search commands',
    enableHotkey = true,
}) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const [query, setQuery] = useState('');

    const open = isOpen ?? internalOpen;

    useEffect(() => {
        if (!enableHotkey) return;
        const handleKeydown = (event: KeyboardEvent) => {
            const isHotkey = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
            if (isHotkey) {
                event.preventDefault();
                const next = !open;
                if (isOpen === undefined) {
                    setInternalOpen(next);
                }
                onOpenChange?.(next);
            }
            if (open && event.key === 'Escape') {
                if (isOpen === undefined) {
                    setInternalOpen(false);
                }
                onOpenChange?.(false);
            }
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [enableHotkey, isOpen, onOpenChange, open]);

    useEffect(() => {
        if (!open) {
            setQuery('');
        }
    }, [open]);

    const filteredItems = useMemo(() => {
        const lower = query.trim().toLowerCase();
        if (!lower) return items;
        return items.filter(item => {
            const haystack = [item.label, ...(item.keywords ?? [])].join(' ').toLowerCase();
            return haystack.includes(lower);
        });
    }, [items, query]);

    const grouped = useMemo(() => {
        return filteredItems.reduce<Record<string, CommandItem[]>>((acc, item) => {
            const key = item.group || 'General';
            acc[key] = acc[key] ? [...acc[key], item] : [item];
            return acc;
        }, {});
    }, [filteredItems]);

    const close = () => {
        if (isOpen === undefined) {
            setInternalOpen(false);
        }
        onOpenChange?.(false);
    };

    if (!open) return null;

    return (
        <div className="command-palette">
            <div className="command-palette__backdrop" onClick={close} />
            <div className="command-palette__panel" role="dialog" aria-modal="true">
                <div className="command-palette__input">
                    <InputText autoFocus placeholder={placeholder} value={query} onChange={setQuery} />
                </div>
                <div className="command-palette__list">
                    {Object.keys(grouped).map(group => (
                        <div key={group} className="command-palette__group">
                            <div className="command-palette__group-title">{group}</div>
                            {grouped[group].map(item => (
                                <Button
                                    key={item.id}
                                    variant="plain"
                                    className="command-palette__item"
                                    onClick={() => {
                                        item.onSelect();
                                        close();
                                    }}
                                >
                                    {item.icon && <span className="command-palette__icon">{item.icon}</span>}
                                    <span className="command-palette__label">{item.label}</span>
                                    {item.shortcut && <span className="command-palette__shortcut">{item.shortcut}</span>}
                                </Button>
                            ))}
                        </div>
                    ))}
                    {filteredItems.length === 0 && <div className="command-palette__empty">No matching commands</div>}
                </div>
                <div className="command-palette__footer">Press Ctrl+K to toggle</div>
            </div>
        </div>
    );
};
