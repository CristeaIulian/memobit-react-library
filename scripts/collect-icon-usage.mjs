// Collects the icon names this library's own components reference.
//
// Consumers trim `iconMap` down to the icons they use, and they cannot see what a
// component renders internally — so anything missing from this list is silently dropped
// from every app that trims. That is not a theoretical risk: the first version of this
// script only looked at `name=` on an <Icon> element and missed 26 icons, including the
// hamburger menu, because `MenuHamburger` declares its icon as a default parameter
// (`icon = 'menu-hamburger'`) rather than passing it inline.
//
// So the sweep is deliberately broad: every quoted string in component source that is a
// real icon name. Over-keeping a handful of icons costs a few KB; missing one leaves a
// blank space in a shipped app. The one exclusion is the EmojiPicker keyword tables,
// where ~190 emoji search terms ("avocado", "beer", "dinosaur") collide with icon names
// and would otherwise be kept for nothing.

import { readdirSync, readFileSync } from 'fs';
import { extname, join } from 'path';

const EXCLUDED_DIRS = new Set(['emojiKeywords']);
const QUOTED = /'([a-z][a-z0-9-]*)'|"([a-z][a-z0-9-]*)"/g;

const collectSourceFiles = (directory, found = []) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (!EXCLUDED_DIRS.has(entry.name)) {
                collectSourceFiles(join(directory, entry.name), found);
            }
        } else if (['.tsx', '.ts'].includes(extname(entry.name))) {
            found.push(join(directory, entry.name));
        }
    }

    return found;
};

export const collectIconUsage = (componentsDir, validNames) => {
    const names = new Set();

    for (const file of collectSourceFiles(componentsDir)) {
        const source = readFileSync(file, 'utf8');

        for (const match of source.matchAll(QUOTED)) {
            const candidate = match[1] ?? match[2];

            if (validNames.has(candidate)) {
                names.add(candidate);
            }
        }
    }

    return [...names].sort();
};
