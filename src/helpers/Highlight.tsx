import { ReactNode } from 'react';

export function highlightText(text: string, searchTerm: string): ReactNode {
    if (!searchTerm || !text) {
        return text;
    }

    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    const parts = text.split(regex);

    if (parts.length === 1) {
        return text;
    }

    return parts.map((part, index) =>
        regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
}
