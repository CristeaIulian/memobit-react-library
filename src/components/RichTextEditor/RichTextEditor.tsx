import React, { FocusEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import './RichTextEditor.scss';

// ─── Types ───────────────────────────────────────────────────────────────────

type OutputFormat = 'html' | 'markdown';

interface RichTextEditorProps {
    advanced?: boolean;
    error?: string;
    format?: OutputFormat;
    id?: string;
    label?: string;
    onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    value?: string;
}

// ─── HTML → Markdown ─────────────────────────────────────────────────────────

const htmlToMarkdown = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;

    const processNode = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) return (node.textContent ?? '').replace(/\u00a0/g, ' ');

        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        const children = Array.from(el.childNodes).map(processNode).join('');

        switch (tag) {
            case 'b':
            case 'strong':
                return `**${children}**`;
            case 'i':
            case 'em':
                return `*${children}*`;
            case 'u':
                return `<u>${children}</u>`;
            case 'h1':
                return `# ${children}\n\n`;
            case 'h2':
                return `## ${children}\n\n`;
            case 'h3':
                return `### ${children}\n\n`;
            case 'h4':
                return `#### ${children}\n\n`;
            case 'h5':
                return `##### ${children}\n\n`;
            case 'h6':
                return `###### ${children}\n\n`;
            case 'p':
                return `${children}\n\n`;
            case 'br':
                return '\n';
            case 'a':
                return `[${children}](${el.getAttribute('href') ?? ''})`;
            case 'ul': {
                const items = Array.from(el.children).map(li => {
                    const checkbox = li.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        const checked = (checkbox as HTMLInputElement).checked;
                        const text = (li.textContent ?? '').trim();
                        return `- [${checked ? 'x' : ' '}] ${text}`;
                    }
                    return `- ${processNode(li)}`;
                });
                return items.join('\n') + '\n\n';
            }
            case 'ol': {
                const items = Array.from(el.children).map((li, i) => `${i + 1}. ${processNode(li)}`);
                return items.join('\n') + '\n\n';
            }
            case 'li':
                return children;
            case 'code':
                return `\`${children}\``;
            case 'pre':
                return `\`\`\`\n${el.textContent ?? ''}\n\`\`\`\n\n`;
            case 'table': {
                const rows = Array.from(el.querySelectorAll('tr'));
                if (!rows.length) return '';
                const header = Array.from(rows[0].querySelectorAll('th,td'))
                    .map(cell => cell.textContent ?? '')
                    .join(' | ');
                const divider = Array.from(rows[0].querySelectorAll('th,td'))
                    .map(() => '---')
                    .join(' | ');
                const body = rows.slice(1).map(row =>
                    Array.from(row.querySelectorAll('td'))
                        .map(cell => cell.textContent ?? '')
                        .join(' | ')
                );
                return [header, divider, ...body].join('\n') + '\n\n';
            }
            case 'div':
                return `${children}\n`;
            default:
                return children;
        }
    };

    return Array.from(div.childNodes).map(processNode).join('').trim();
};

// ─── Toolbar button definitions ───────────────────────────────────────────────

interface ToolbarButton {
    command: string;
    value?: string;
    label: string;
    title: string;
    isAdvanced?: boolean;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
    { command: 'bold', label: 'B', title: 'Bold (Ctrl+B)' },
    { command: 'italic', label: 'I', title: 'Italic (Ctrl+I)' },
    { command: 'underline', label: 'U', title: 'Underline (Ctrl+U)' },
    { command: 'insertUnorderedList', label: '• List', title: 'Unordered List' },
    { command: 'insertOrderedList', label: '1. List', title: 'Ordered List' },
];

const HISTORY_BUTTONS: ToolbarButton[] = [
    { command: 'undo', label: '↩ Undo', title: 'Undo (Ctrl+Z)' },
    { command: 'redo', label: '↪ Redo', title: 'Redo (Ctrl+Shift+Z)' },
];

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

const ADVANCED_BUTTONS: ToolbarButton[] = [{ command: 'formatBlock', value: 'pre', label: 'Code Block', title: 'Code Block', isAdvanced: true }];

// ─── Component ────────────────────────────────────────────────────────────────

export const RichTextEditor = ({
    advanced = false,
    error,
    format = 'html',
    id,
    label,
    onBlur,
    onChange,
    placeholder,
    required = false,
    value,
}: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());
    const [showLinkPrompt, setShowLinkPrompt] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const savedRangeRef = useRef<Range | null>(null);
    const editingAnchorRef = useRef<HTMLAnchorElement | null>(null);
    const isInternalUpdate = useRef(false);
    const [activeTable, setActiveTable] = useState<HTMLTableElement | null>(null);
    const [tableToolbarPos, setTableToolbarPos] = useState<{ top: number; left: number } | null>(null);
    const tableToolbarRef = useRef<HTMLDivElement>(null);

    // ── Sync external value → editor ────────────────────────────────────────
    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || isInternalUpdate.current) return;

        const incoming = value ?? '';

        // Avoid resetting caret when content hasn't changed
        if (editor.innerHTML === incoming) return;

        editor.innerHTML = incoming;
    }, [value]);

    // ── Emit changes ─────────────────────────────────────────────────────────
    const emitChange = useCallback(() => {
        const editor = editorRef.current;
        if (!editor || !onChange) return;

        isInternalUpdate.current = true;
        const html = editor.innerHTML.replace(/&nbsp;/g, ' ');
        onChange(format === 'markdown' ? htmlToMarkdown(html) : html);
        setTimeout(() => {
            isInternalUpdate.current = false;
        }, 0);
    }, [format, onChange]);

    // ── Custom undo/redo stack (covers direct DOM mutations) ─────────────────
    const undoStack = useRef<string[]>([]);
    const redoStack = useRef<string[]>([]);
    const MAX_HISTORY = 100;

    const snapshotForUndo = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        undoStack.current.push(editor.innerHTML);
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        redoStack.current = []; // new action clears redo
    }, []);

    const undo = useCallback(() => {
        const editor = editorRef.current;
        if (!editor || undoStack.current.length === 0) return;
        redoStack.current.push(editor.innerHTML);
        const prev = undoStack.current.pop()!;
        isInternalUpdate.current = true;
        editor.innerHTML = prev;
        setTimeout(() => {
            isInternalUpdate.current = false;
        }, 0);
        emitChange();
    }, [emitChange]);

    const redo = useCallback(() => {
        const editor = editorRef.current;
        if (!editor || redoStack.current.length === 0) return;
        undoStack.current.push(editor.innerHTML);
        const next = redoStack.current.pop()!;
        isInternalUpdate.current = true;
        editor.innerHTML = next;
        setTimeout(() => {
            isInternalUpdate.current = false;
        }, 0);
        emitChange();
    }, [emitChange]);

    // ── Active command state ──────────────────────────────────────────────────
    const updateActiveCommands = useCallback(() => {
        const commands = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'];
        const next = new Set<string>();
        commands.forEach(cmd => {
            try {
                if (document.queryCommandState(cmd)) next.add(cmd);
            } catch {
                /* noop */
            }
        });

        // Detect heading
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            let node: Node | null = selection.getRangeAt(0).commonAncestorContainer;
            while (node && node !== editorRef.current) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const tag = (node as HTMLElement).tagName.toLowerCase();
                    if (/^h[1-6]$/.test(tag)) {
                        next.add(tag);
                        break;
                    }
                    if (tag === 'pre') next.add('pre');
                }
                node = node.parentNode;
            }
        }

        setActiveCommands(next);
    }, []);

    // ── execCommand helper ────────────────────────────────────────────────────
    const exec = useCallback(
        (command: string, value?: string) => {
            editorRef.current?.focus();
            document.execCommand(command, false, value);
            updateActiveCommands();
            emitChange();
        },
        [emitChange, updateActiveCommands]
    );

    // ── Heading ───────────────────────────────────────────────────────────────
    const applyHeading = useCallback(
        (level: number) => {
            const tag = `h${level}`;
            const isActive = activeCommands.has(tag);
            exec('formatBlock', isActive ? 'p' : tag);
        },
        [activeCommands, exec]
    );

    // ── Task list ─────────────────────────────────────────────────────────────
    const insertTaskList = useCallback(() => {
        snapshotForUndo();
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);

        const li = document.createElement('li');
        li.setAttribute('data-task', 'true');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '6px';

        const span = document.createElement('span');
        span.textContent = '\u200B'; // zero-width space to allow cursor placement

        li.appendChild(checkbox);
        li.appendChild(span);

        const ul = document.createElement('ul');
        ul.className = 'rte-task-list';
        ul.appendChild(li);

        range.deleteContents();
        range.insertNode(ul);

        // Move cursor into span
        const newRange = document.createRange();
        newRange.setStart(span, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        emitChange();
    }, [emitChange]);

    // ── Link prompt ───────────────────────────────────────────────────────────
    const openLinkPrompt = useCallback((anchor?: HTMLAnchorElement) => {
        if (anchor) {
            // Edit mode: pre-populate from existing anchor
            editingAnchorRef.current = anchor;
            setLinkText(anchor.textContent ?? '');
            setLinkUrl(anchor.getAttribute('href') ?? '');
        } else {
            // Insert mode: capture current selection
            editingAnchorRef.current = null;
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                savedRangeRef.current = selection.getRangeAt(0).cloneRange();
                setLinkText(selection.toString());
            }
            setLinkUrl('');
        }
        setShowLinkPrompt(true);
    }, []);

    const confirmLink = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();

        if (editingAnchorRef.current) {
            // Edit mode: update the existing anchor in place
            const anchor = editingAnchorRef.current;
            if (linkUrl) {
                anchor.setAttribute('href', linkUrl);
                if (linkText) anchor.textContent = linkText;
            } else {
                // Empty URL → unwrap the link
                const parent = anchor.parentNode;
                while (anchor.firstChild) parent?.insertBefore(anchor.firstChild, anchor);
                parent?.removeChild(anchor);
            }
            editingAnchorRef.current = null;
        } else {
            // Insert mode: create a new link
            snapshotForUndo();
            const selection = window.getSelection();
            if (savedRangeRef.current) {
                selection?.removeAllRanges();
                selection?.addRange(savedRangeRef.current);
            }

            if (linkUrl) {
                if (linkText && selection?.toString() === '') {
                    document.execCommand('insertHTML', false, `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
                } else {
                    document.execCommand('createLink', false, linkUrl);
                    const anchor = selection?.anchorNode?.parentElement?.closest('a');
                    if (anchor) {
                        anchor.setAttribute('target', '_blank');
                        anchor.setAttribute('rel', 'noopener noreferrer');
                    }
                }
            }
            savedRangeRef.current = null;
        }

        setShowLinkPrompt(false);
        setLinkUrl('');
        setLinkText('');
        emitChange();
    }, [linkUrl, linkText, emitChange]);

    const cancelLink = useCallback(() => {
        setShowLinkPrompt(false);
        setLinkUrl('');
        setLinkText('');
        savedRangeRef.current = null;
        editingAnchorRef.current = null;
    }, []);

    // ── Table insertion ───────────────────────────────────────────────────────
    const insertTable = useCallback(() => {
        const tableHtml = `
            <table class="rte-table">
                <thead>
                    <tr><th contenteditable="true">Header 1</th><th contenteditable="true">Header 2</th><th contenteditable="true">Header 3</th></tr>
                </thead>
                <tbody>
                    <tr><td contenteditable="true">Cell</td><td contenteditable="true">Cell</td><td contenteditable="true">Cell</td></tr>
                    <tr><td contenteditable="true">Cell</td><td contenteditable="true">Cell</td><td contenteditable="true">Cell</td></tr>
                </tbody>
            </table><p><br></p>
        `;
        exec('insertHTML', tableHtml);
    }, [exec]);

    // ── Get cell at caret ────────────────────────────────────────────────────
    const getCaretCell = useCallback((): HTMLTableCellElement | null => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;
        let node: Node | null = selection.getRangeAt(0).commonAncestorContainer;
        while (node && node !== editorRef.current) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = (node as HTMLElement).tagName.toLowerCase();
                if (tag === 'td' || tag === 'th') return node as HTMLTableCellElement;
            }
            node = node.parentNode;
        }
        return null;
    }, []);

    // ── Table toolbar positioning ────────────────────────────────────────────
    const showTableToolbar = useCallback((table: HTMLTableElement) => {
        const editor = editorRef.current;
        if (!editor) return;
        const editorRect = editor.getBoundingClientRect();
        const tableRect = table.getBoundingClientRect();
        setActiveTable(table);
        setTableToolbarPos({
            top: tableRect.top - editorRect.top - 36,
            left: tableRect.left - editorRect.left,
        });
    }, []);

    const hideTableToolbar = useCallback(() => {
        setActiveTable(null);
        setTableToolbarPos(null);
    }, []);

    // ── Table mutation helpers ────────────────────────────────────────────────
    const makeRow = (colCount: number): HTMLTableRowElement => {
        const tr = document.createElement('tr');
        for (let i = 0; i < colCount; i++) {
            const td = document.createElement('td');
            td.setAttribute('contenteditable', 'true');
            td.textContent = 'Cell';
            tr.appendChild(td);
        }
        return tr;
    };

    const addRowBelow = useCallback(() => {
        if (!activeTable) return;
        snapshotForUndo();
        const caretCell = getCaretCell();
        const caretRow = caretCell?.closest('tr') ?? null;
        const tbody = activeTable.querySelector('tbody') ?? activeTable;
        const refRow = caretRow ?? tbody.querySelector('tr:last-child');
        if (!refRow) return;
        const colCount = refRow.querySelectorAll('td,th').length;
        tbody.insertBefore(makeRow(colCount), refRow.nextSibling);
        emitChange();
        showTableToolbar(activeTable);
    }, [activeTable, snapshotForUndo, getCaretCell, emitChange, showTableToolbar]);

    const addRowAbove = useCallback(() => {
        if (!activeTable) return;
        snapshotForUndo();
        const caretCell = getCaretCell();
        const caretRow = caretCell?.closest('tr') ?? null;
        const tbody = activeTable.querySelector('tbody') ?? activeTable;
        const refRow = caretRow ?? tbody.querySelector('tr:first-child');
        if (!refRow) return;
        const colCount = refRow.querySelectorAll('td,th').length;
        tbody.insertBefore(makeRow(colCount), refRow);
        emitChange();
        showTableToolbar(activeTable);
    }, [activeTable, snapshotForUndo, getCaretCell, emitChange, showTableToolbar]);

    const removeRow = useCallback(() => {
        if (!activeTable) return;
        const rows = Array.from(activeTable.querySelectorAll('tbody tr'));
        if (rows.length <= 1) return;
        snapshotForUndo();
        const caretCell = getCaretCell();
        const caretRow = caretCell?.closest('tr') as HTMLTableRowElement | null;
        const targetRow = caretRow ?? rows[rows.length - 1];
        targetRow.remove();
        emitChange();
        showTableToolbar(activeTable);
    }, [activeTable, snapshotForUndo, getCaretCell, emitChange, showTableToolbar]);

    const addColumnRight = useCallback(() => {
        if (!activeTable) return;
        snapshotForUndo();
        const caretCell = getCaretCell();
        const caretIndex = caretCell ? Array.from(caretCell.parentElement!.querySelectorAll('td,th')).indexOf(caretCell) : -1;
        activeTable.querySelectorAll('tr').forEach((row, rowIndex) => {
            const isHeader = rowIndex === 0 && row.closest('thead') !== null;
            const cell = document.createElement(isHeader ? 'th' : 'td');
            cell.setAttribute('contenteditable', 'true');
            cell.textContent = isHeader ? 'Header' : 'Cell';
            const cells = row.querySelectorAll('td,th');
            const refIdx = caretIndex >= 0 ? caretIndex : cells.length - 1;
            const after = cells[refIdx];
            row.insertBefore(cell, after ? after.nextSibling : null);
        });
        emitChange();
        showTableToolbar(activeTable);
    }, [activeTable, snapshotForUndo, getCaretCell, emitChange, showTableToolbar]);

    const addColumnLeft = useCallback(() => {
        if (!activeTable) return;
        snapshotForUndo();
        const caretCell = getCaretCell();
        const caretIndex = caretCell ? Array.from(caretCell.parentElement!.querySelectorAll('td,th')).indexOf(caretCell) : 0;
        activeTable.querySelectorAll('tr').forEach((row, rowIndex) => {
            const isHeader = rowIndex === 0 && row.closest('thead') !== null;
            const cell = document.createElement(isHeader ? 'th' : 'td');
            cell.setAttribute('contenteditable', 'true');
            cell.textContent = isHeader ? 'Header' : 'Cell';
            const cells = row.querySelectorAll('td,th');
            const before = cells[caretIndex] ?? row.firstChild;
            row.insertBefore(cell, before);
        });
        emitChange();
        showTableToolbar(activeTable);
    }, [activeTable, snapshotForUndo, getCaretCell, emitChange, showTableToolbar]);

    const removeColumn = useCallback(() => {
        if (!activeTable) return;
        const rows = Array.from(activeTable.querySelectorAll('tr'));
        const colCount = rows[0]?.querySelectorAll('td,th').length ?? 0;
        if (colCount <= 1) return;
        snapshotForUndo();
        const caretCell = getCaretCell();
        const caretIndex = caretCell ? Array.from(caretCell.parentElement!.querySelectorAll('td,th')).indexOf(caretCell) : -1;
        rows.forEach(row => {
            const cells = row.querySelectorAll('td,th');
            const target = caretIndex >= 0 ? cells[caretIndex] : cells[cells.length - 1];
            target?.remove();
        });
        emitChange();
        showTableToolbar(activeTable);
    }, [activeTable, snapshotForUndo, getCaretCell, emitChange, showTableToolbar]);

    const deleteTable = useCallback(() => {
        if (!activeTable) return;
        snapshotForUndo();
        activeTable.remove();
        hideTableToolbar();
        emitChange();
    }, [activeTable, snapshotForUndo, hideTableToolbar, emitChange]);

    // ── Editor click: detect link editing ───────────────────────────────────
    const handleEditorClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLElement;

            // Link editing
            const anchor = target.closest('a') as HTMLAnchorElement | null;
            if (anchor) {
                e.preventDefault();
                openLinkPrompt(anchor);
                updateActiveCommands();
                return;
            }

            // Table toolbar
            const table = target.closest('table') as HTMLTableElement | null;
            if (table) {
                showTableToolbar(table);
            } else {
                hideTableToolbar();
            }

            updateActiveCommands();
        },
        [openLinkPrompt, updateActiveCommands, showTableToolbar, hideTableToolbar]
    );

    // ── Keyboard shortcuts ────────────────────────────────────────────────────
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        // Undo / Redo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            if (e.shiftKey) redo();
            else undo();
            return;
        }

        // Snapshot typed content for undo (throttled to meaningful boundaries)
        const isPrintable = e.key.length === 1 && !e.ctrlKey && !e.metaKey;
        const isBoundary = ['Enter', 'Backspace', 'Delete', ' '].includes(e.key);
        if (isPrintable || isBoundary) snapshotForUndo();

        if (e.key === 'Enter' && !e.shiftKey) {
            // Inside task list: add new task item
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                let node: Node | null = selection.getRangeAt(0).commonAncestorContainer;
                while (node && node !== editorRef.current) {
                    if ((node as HTMLElement).classList?.contains('rte-task-list')) {
                        e.preventDefault();
                        const li = document.createElement('li');
                        li.setAttribute('data-task', 'true');
                        const cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.style.marginRight = '6px';
                        const span = document.createElement('span');
                        span.textContent = '\u200B';
                        li.appendChild(cb);
                        li.appendChild(span);
                        node.appendChild(li);
                        const range = document.createRange();
                        range.setStart(span, 1);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        return;
                    }
                    node = node.parentNode;
                }
            }
        }
    }, []);

    const isActive = (command: string) => activeCommands.has(command);

    return (
        <div className="rte-wrapper">
            {label && (
                <label htmlFor={id} className="rte-label">
                    {label}
                    {required && <span className="rte-required">*</span>}
                </label>
            )}

            <div className={`rte-container ${error ? 'rte-container--error' : ''}`} style={{ position: 'relative' }}>
                {/* ── Toolbar ── */}
                <div className="rte-toolbar" role="toolbar" aria-label="Text formatting">
                    {/* Undo / Redo */}
                    <div className="rte-toolbar-group">
                        {HISTORY_BUTTONS.map(btn => (
                            <button
                                key={btn.command}
                                type="button"
                                className="rte-toolbar-btn"
                                title={btn.title}
                                onMouseDown={e => {
                                    e.preventDefault();
                                    if (btn.command === 'undo') undo();
                                    else redo();
                                }}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    <div className="rte-toolbar-divider" />

                    {/* Basic formatting */}
                    <div className="rte-toolbar-group">
                        {TOOLBAR_BUTTONS.map(btn => (
                            <button
                                key={btn.command}
                                type="button"
                                className={`rte-toolbar-btn ${isActive(btn.command) ? 'rte-toolbar-btn--active' : ''}`}
                                title={btn.title}
                                onMouseDown={e => {
                                    e.preventDefault();
                                    exec(btn.command, btn.value);
                                }}
                            >
                                {btn.label}
                            </button>
                        ))}

                        {/* Task list */}
                        <button
                            type="button"
                            className="rte-toolbar-btn"
                            title="Task List"
                            onMouseDown={e => {
                                e.preventDefault();
                                insertTaskList();
                            }}
                        >
                            ☑ List
                        </button>
                    </div>

                    <div className="rte-toolbar-divider" />

                    {/* Headings */}
                    <div className="rte-toolbar-group">
                        {HEADING_LEVELS.map(level => (
                            <button
                                key={level}
                                type="button"
                                className={`rte-toolbar-btn rte-toolbar-btn--heading ${isActive(`h${level}`) ? 'rte-toolbar-btn--active' : ''}`}
                                title={`Heading ${level}`}
                                onMouseDown={e => {
                                    e.preventDefault();
                                    applyHeading(level);
                                }}
                            >
                                H{level}
                            </button>
                        ))}
                    </div>

                    <div className="rte-toolbar-divider" />

                    {/* Link */}
                    <div className="rte-toolbar-group">
                        <button
                            type="button"
                            className="rte-toolbar-btn"
                            title="Insert Link"
                            onMouseDown={e => {
                                e.preventDefault();
                                openLinkPrompt();
                            }}
                        >
                            🔗 Link
                        </button>
                    </div>

                    {/* Advanced */}
                    {advanced && (
                        <>
                            <div className="rte-toolbar-divider" />
                            <div className="rte-toolbar-group">
                                {ADVANCED_BUTTONS.map(btn => (
                                    <button
                                        key={btn.command + (btn.value ?? '')}
                                        type="button"
                                        className={`rte-toolbar-btn ${isActive(btn.value ?? btn.command) ? 'rte-toolbar-btn--active' : ''}`}
                                        title={btn.title}
                                        onMouseDown={e => {
                                            e.preventDefault();
                                            exec(btn.command, btn.value);
                                        }}
                                    >
                                        {btn.label}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className="rte-toolbar-btn"
                                    title="Insert Table"
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        insertTable();
                                    }}
                                >
                                    Table
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* ── Link prompt ── */}
                {showLinkPrompt && (
                    <div className="rte-link-prompt" role="dialog" aria-label={editingAnchorRef.current ? 'Edit link' : 'Insert link'}>
                        <input
                            className="rte-link-input"
                            type="text"
                            placeholder="Display text (optional)"
                            value={linkText}
                            onChange={e => setLinkText(e.target.value)}
                        />
                        <input
                            className="rte-link-input"
                            type="url"
                            placeholder="https://example.com"
                            value={linkUrl}
                            onChange={e => setLinkUrl(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') confirmLink();
                                if (e.key === 'Escape') cancelLink();
                            }}
                            autoFocus
                        />
                        <div className="rte-link-actions">
                            <button type="button" className="rte-link-btn rte-link-btn--confirm" onClick={confirmLink}>
                                {editingAnchorRef.current ? 'Update' : 'Insert'}
                            </button>
                            <button type="button" className="rte-link-btn rte-link-btn--cancel" onClick={cancelLink}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Table floating toolbar ── */}
                {activeTable && tableToolbarPos && (
                    <div
                        ref={tableToolbarRef}
                        className="rte-table-toolbar"
                        style={{ top: tableToolbarPos.top, left: tableToolbarPos.left }}
                        onMouseDown={e => e.preventDefault()}
                    >
                        <div className="rte-table-toolbar-group">
                            <button type="button" className="rte-table-toolbar-btn" title="Add row above" onClick={addRowAbove}>
                                ↑ Row
                            </button>
                            <button type="button" className="rte-table-toolbar-btn" title="Add row below" onClick={addRowBelow}>
                                ↓ Row
                            </button>
                            <button type="button" className="rte-table-toolbar-btn rte-table-toolbar-btn--danger" title="Remove last row" onClick={removeRow}>
                                − Row
                            </button>
                        </div>
                        <div className="rte-table-toolbar-divider" />
                        <div className="rte-table-toolbar-group">
                            <button type="button" className="rte-table-toolbar-btn" title="Add column left" onClick={addColumnLeft}>
                                ← Col
                            </button>
                            <button type="button" className="rte-table-toolbar-btn" title="Add column right" onClick={addColumnRight}>
                                → Col
                            </button>
                            <button
                                type="button"
                                className="rte-table-toolbar-btn rte-table-toolbar-btn--danger"
                                title="Remove last column"
                                onClick={removeColumn}
                            >
                                − Col
                            </button>
                        </div>
                        <div className="rte-table-toolbar-divider" />
                        <div className="rte-table-toolbar-group">
                            <button type="button" className="rte-table-toolbar-btn rte-table-toolbar-btn--danger" title="Delete table" onClick={deleteTable}>
                                ✕ Table
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Editable area ── */}
                <div
                    ref={editorRef}
                    id={id}
                    className="rte-editor"
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder={placeholder}
                    onInput={emitChange}
                    onKeyUp={updateActiveCommands}
                    onMouseUp={updateActiveCommands}
                    onClick={handleEditorClick}
                    onKeyDown={handleKeyDown}
                    onBlur={onBlur}
                    role="textbox"
                    aria-multiline
                    aria-required={required}
                    aria-label={label}
                    aria-invalid={!!error}
                />
            </div>

            {error && <span className="rte-error-message">{error}</span>}
        </div>
    );
};
