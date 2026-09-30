// Collects the icon names this library's own components hardcode.
//
// Consumers trim `iconMap` down to the icons they use, and a component rendering
// <Icon name="caret-down" /> internally is invisible to a scan of the app's source — so
// without this list a trimmed build would drop the caret and break Dropdown at runtime.
//
// Extraction is deliberately narrow: only `name=` on an <Icon> element. A broad sweep for
// quoted strings would also match the EmojiPicker's keyword tables in
// src/components/EmojiPicker/emojiKeywords/, where ~190 entries ("avocado", "beer",
// "dinosaur") happen to be icon names too, and every one of those would be kept for nothing.

import { readdirSync, readFileSync } from 'fs';
import { extname, join } from 'path';

const ICON_ELEMENT = /<Icon\b[^>]*?\/?>/gs;
const NAME_ATTRIBUTE = /\bname=(?:"([a-z][a-z0-9-]*)"|\{([^}]*)\})/g;
const QUOTED = /'([a-z][a-z0-9-]*)'|"([a-z][a-z0-9-]*)"/g;

const collectTsxFiles = (directory, found = []) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            collectTsxFiles(join(directory, entry.name), found);
        } else if (extname(entry.name) === '.tsx') {
            found.push(join(directory, entry.name));
        }
    }

    return found;
};

export const collectIconUsage = componentsDir => {
    const names = new Set();

    for (const file of collectTsxFiles(componentsDir)) {
        const source = readFileSync(file, 'utf8');

        for (const element of source.match(ICON_ELEMENT) ?? []) {
            for (const attribute of element.matchAll(NAME_ATTRIBUTE)) {
                const [, literal, expression] = attribute;

                if (literal) {
                    names.add(literal);
                    continue;
                }

                // A ternary over literals, e.g. name={isOpen ? 'caret-up' : 'caret-down'}.
                // Anything else in here is a prop the consuming app passes, and the app's
                // own source carries that literal.
                for (const quoted of (expression ?? '').matchAll(QUOTED)) {
                    names.add(quoted[1] ?? quoted[2]);
                }
            }
        }
    }

    return [...names].sort();
};
