import { type CSSProperties, type MouseEvent, type ReactElement, type ReactNode, useState } from 'react';

import type { IconName } from '@memobit/icons';

import { Button } from '../Button';
import { ContextMenu } from '../ContextMenu';
import { ToolButton } from '../ToolButton';

import './ToolPalette.scss';

export interface ToolPaletteItem {
    id: string;
    label: string;
    icon: IconName | ReactElement;
    /** Shown in the hint and the group menu, e.g. "M". */
    shortcut?: string;
    /** Items with the same group share one slot, as Photoshop's marquees do. Defaults to the item's own id. */
    group?: string;
}

export interface ToolPaletteProps {
    items: ToolPaletteItem[];
    activeId: string;
    onSelect: (id: string) => void;
    /** Slots per row. Defaults to 2, which keeps a long set of tools on screen in a small window. */
    columns?: number;
    /** Shown under the tools, e.g. the foreground and background colours. */
    children?: ReactNode;
    className?: string;
}

interface PaletteStyle extends CSSProperties {
    '--tool-palette-columns': number;
}

/**
 * A tool column, as in an image editor. Items that share a group share a slot showing the one last used: clicking the
 * slot again moves to the next item of the group, right-clicking lists them all. A corner mark shows which slots hold more.
 */
export const ToolPalette = ({ items, activeId, onSelect, columns = 2, children, className }: ToolPaletteProps) => {
    const groups = new Map<string, ToolPaletteItem[]>();
    for (const item of items) {
        const key = item.group ?? item.id;
        groups.set(key, [...(groups.get(key) ?? []), item]);
    }
    const [shown, setShown] = useState<Record<string, string>>({});
    const [menu, setMenu] = useState<{ group: ToolPaletteItem[]; x: number; y: number } | null>(null);

    const groupKey = (item: ToolPaletteItem) => item.group ?? item.id;
    const shownItem = (group: ToolPaletteItem[]): ToolPaletteItem =>
        group.find(item => item.id === activeId) ?? group.find(item => item.id === shown[groupKey(group[0])]) ?? group[0];

    const pick = (item: ToolPaletteItem) => {
        setShown(current => ({ ...current, [groupKey(item)]: item.id }));
        onSelect(item.id);
    };

    const clickSlot = (group: ToolPaletteItem[]) => {
        const current = shownItem(group);
        if (current.id !== activeId || group.length === 1) pick(current);
        else pick(group[(group.indexOf(current) + 1) % group.length]);
    };

    const openMenu = (event: MouseEvent, group: ToolPaletteItem[]) => {
        event.preventDefault();
        if (group.length > 1) setMenu({ group, x: event.clientX, y: event.clientY });
    };

    const describe = (item: ToolPaletteItem) => (item.shortcut ? `${item.label} (${item.shortcut})` : item.label);
    const style: PaletteStyle = { '--tool-palette-columns': columns };

    return (
        <nav className={`tool-palette${className ? ` ${className}` : ''}`} style={style}>
            <div className="tool-palette__tools">
                {[...groups.values()].map(group => {
                    const item = shownItem(group);
                    const others = group.filter(other => other !== item).map(other => other.label);
                    return (
                        <span
                            key={groupKey(item)}
                            className={`tool-palette__slot${group.length > 1 ? ' tool-palette__slot--grouped' : ''}`}
                            onContextMenu={event => openMenu(event, group)}
                        >
                            <ToolButton
                                icon={item.icon}
                                hint={others.length > 0 ? `${describe(item)} · also ${others.join(', ')}` : describe(item)}
                                hintPosition="right"
                                onClick={() => clickSlot(group)}
                                active={item.id === activeId}
                            />
                        </span>
                    );
                })}
            </div>
            {children}
            {menu && (
                <ContextMenu position={{ x: menu.x, y: menu.y }} onClose={() => setMenu(null)} autoClose>
                    <div className="tool-palette__menu">
                        {menu.group.map(item => (
                            <Button
                                key={item.id}
                                variant="plain"
                                size="small"
                                icon={item.icon}
                                className={`tool-palette__menu-item${item.id === activeId ? ' tool-palette__menu-item--active' : ''}`}
                                onClick={() => {
                                    setMenu(null);
                                    pick(item);
                                }}
                            >
                                <span className="tool-palette__menu-label">{item.label}</span>
                                {item.shortcut && <span className="tool-palette__menu-shortcut">{item.shortcut}</span>}
                            </Button>
                        ))}
                    </div>
                </ContextMenu>
            )}
        </nav>
    );
};
