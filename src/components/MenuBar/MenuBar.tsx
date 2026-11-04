import { useEffect, useRef, useState } from 'react';

import './MenuBar.scss';

export type MenuBarEntry = { label: string; shortcut?: string; onSelect: () => void; disabled?: boolean } | 'separator';

export interface MenuBarMenu {
    label: string;
    entries: MenuBarEntry[];
}

export interface MenuBarProps {
    menus: MenuBarMenu[];
    className?: string;
}

/**
 * A desktop menu bar: File, Edit, Image… A click opens a menu; while one is open, hovering another switches to it,
 * as in Windows. Esc or a click elsewhere closes it. Shortcuts are only shown: handling the keys is the app's job.
 */
export const MenuBar = ({ menus, className }: MenuBarProps) => {
    const [open, setOpen] = useState<number | null>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open === null) return;
        const close = (event: Event) => {
            if (event instanceof KeyboardEvent && event.key !== 'Escape') return;
            if (event instanceof MouseEvent && event.target instanceof Node && barRef.current?.contains(event.target)) return;
            setOpen(null);
        };
        window.addEventListener('mousedown', close);
        window.addEventListener('keydown', close);
        return () => {
            window.removeEventListener('mousedown', close);
            window.removeEventListener('keydown', close);
        };
    }, [open]);

    return (
        <div className={`menu-bar${className ? ` ${className}` : ''}`} ref={barRef}>
            {menus.map((menu, index) => (
                <div key={menu.label} className="menu-bar__menu">
                    <button
                        type="button"
                        className={`menu-bar__title${open === index ? ' menu-bar__title--open' : ''}`}
                        onClick={() => setOpen(open === index ? null : index)}
                        onMouseEnter={() => open !== null && setOpen(index)}
                    >
                        {menu.label}
                    </button>
                    {open === index && (
                        <div className="menu-bar__list">
                            {menu.entries.map((entry, entryIndex) =>
                                entry === 'separator' ? (
                                    <div key={`separator-${entryIndex}`} className="menu-bar__separator" />
                                ) : (
                                    <button
                                        key={entry.label}
                                        type="button"
                                        className="menu-bar__item"
                                        disabled={entry.disabled}
                                        onClick={() => {
                                            setOpen(null);
                                            entry.onSelect();
                                        }}
                                    >
                                        <span>{entry.label}</span>
                                        {entry.shortcut && <span className="menu-bar__shortcut">{entry.shortcut}</span>}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
