import { useEffect, useState } from 'react';

import { applyAuthoredEngine, clearAuthoredEngine } from '@memobit/themes';

export type ThemeEngine = 'classic' | 'authored';

const loadEngine = (storageKey: string): ThemeEngine => {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null');

        return typeof parsed === 'object' && parsed !== null && 'engine' in parsed && parsed.engine === 'authored' ? 'authored' : 'classic';
    } catch {
        return 'classic';
    }
};

const saveEngine = (storageKey: string, engine: ThemeEngine): void => {
    try {
        localStorage.setItem(storageKey, JSON.stringify({ engine }));
    } catch {
        // Storage can be unavailable (private window, blocked site data); the lab still works for the session.
    }
};

const isTypingTarget = (target: EventTarget | null): boolean =>
    target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);

export const useThemeLab = (storageKey: string) => {
    const [engine, setEngine] = useState(() => loadEngine(storageKey));

    useEffect(() => {
        if (engine === 'authored') {
            applyAuthoredEngine();
        } else {
            clearAuthoredEngine();
        }

        saveEngine(storageKey, engine);
    }, [engine, storageKey]);

    // Backslash flips between the classic theme and its authored version, for quick A/B looks.
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key !== '\\' || event.ctrlKey || event.metaKey || event.altKey || isTypingTarget(event.target)) {
                return;
            }

            event.preventDefault();
            setEngine(prev => (prev === 'authored' ? 'classic' : 'authored'));
        };

        window.addEventListener('keydown', handler);

        return () => window.removeEventListener('keydown', handler);
    }, []);

    return { engine, setEngine };
};
