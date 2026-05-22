import { ReactNode } from 'react';

const COMBINING_MARKS = /[̀-ͯ]/g;

const fold = (input: string): string => input.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase();

interface FoldMap {
    folded: string;
    mapping: number[];
}

const buildFoldMap = (text: string): FoldMap => {
    let folded = '';
    const mapping: number[] = [];
    for (let i = 0; i < text.length; i++) {
        const piece = fold(text[i]);
        for (let j = 0; j < piece.length; j++) {
            mapping.push(i);
        }
        folded += piece;
    }
    return { folded, mapping };
};

export function highlightText(text: string, searchTerm: string): ReactNode {
    if (!searchTerm || !text) {
        return text;
    }

    const needle = fold(searchTerm);
    if (!needle) {
        return text;
    }

    const { folded, mapping } = buildFoldMap(text);
    const ranges: Array<[number, number]> = [];
    let cursor = 0;
    while (cursor <= folded.length - needle.length) {
        const idx = folded.indexOf(needle, cursor);
        if (idx === -1) break;
        const origStart = mapping[idx];
        const origEnd = idx + needle.length < mapping.length ? mapping[idx + needle.length] : text.length;
        ranges.push([origStart, origEnd]);
        cursor = idx + needle.length;
    }

    if (ranges.length === 0) {
        return text;
    }

    const parts: ReactNode[] = [];
    let pos = 0;
    ranges.forEach(([start, end], i) => {
        if (start > pos) parts.push(text.slice(pos, start));
        parts.push(<mark key={i}>{text.slice(start, end)}</mark>);
        pos = end;
    });
    if (pos < text.length) parts.push(text.slice(pos));

    return parts;
}
