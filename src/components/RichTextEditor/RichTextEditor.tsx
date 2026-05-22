import React, { FocusEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import { htmlToMarkdown } from '../../helpers/HtmlContent';

import { DEFAULT_TABLE_HTML } from './helpers';
import { useEditorHistory } from './hooks/useEditorHistory';
import { useLinkPrompt } from './hooks/useLinkPrompt';
import { useTableOps } from './hooks/useTableOps';
import { RteLinkPrompt } from './RteLinkPrompt';
import { RteTableToolbar } from './RteTableToolbar';
import { RteToolbar } from './RteToolbar';

import './RichTextEditor.scss';

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
    const isInternalUpdate = useRef(false);
    const tableToolbarRef = useRef<HTMLDivElement>(null);
    const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || isInternalUpdate.current) return;

        const incoming = value ?? '';
        if (editor.innerHTML === incoming) return;

        editor.innerHTML = incoming;
    }, [value]);

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

    const { snapshotForUndo, undo, redo } = useEditorHistory(editorRef, isInternalUpdate, emitChange);

    const {
        showLinkPrompt,
        linkUrl,
        setLinkUrl,
        linkText,
        setLinkText,
        editingAnchorRef,
        openLinkPrompt,
        confirmLink,
        cancelLink,
    } = useLinkPrompt({ editorRef, snapshotForUndo, emitChange });

    const {
        activeTable,
        tableToolbarPos,
        showTableToolbar,
        hideTableToolbar,
        addRowAbove,
        addRowBelow,
        removeRow,
        addColumnLeft,
        addColumnRight,
        removeColumn,
        deleteTable,
    } = useTableOps({ editorRef, snapshotForUndo, emitChange });

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

    const exec = useCallback(
        (command: string, value?: string) => {
            editorRef.current?.focus();
            document.execCommand(command, false, value);
            updateActiveCommands();
            emitChange();
        },
        [emitChange, updateActiveCommands]
    );

    const applyHeading = useCallback(
        (level: number) => {
            const tag = `h${level}`;
            const isActive = activeCommands.has(tag);
            exec('formatBlock', isActive ? 'p' : tag);
        },
        [activeCommands, exec]
    );

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
        span.textContent = '\u200B';

        li.appendChild(checkbox);
        li.appendChild(span);

        const ul = document.createElement('ul');
        ul.className = 'rte-task-list';
        ul.appendChild(li);

        range.deleteContents();
        range.insertNode(ul);

        const newRange = document.createRange();
        newRange.setStart(span, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        emitChange();
    }, [snapshotForUndo, emitChange]);

    const insertTable = useCallback(() => {
        exec('insertHTML', DEFAULT_TABLE_HTML);
    }, [exec]);

    const handleEditorClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLElement;

            const anchor = target.closest('a') as HTMLAnchorElement | null;
            if (anchor) {
                e.preventDefault();
                openLinkPrompt(anchor);
                updateActiveCommands();
                return;
            }

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

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
                return;
            }

            const isPrintable = e.key.length === 1 && !e.ctrlKey && !e.metaKey;
            const isBoundary = ['Enter', 'Backspace', 'Delete', ' '].includes(e.key);
            if (isPrintable || isBoundary) snapshotForUndo();

            if (e.key === 'Enter' && !e.shiftKey) {
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
        },
        [snapshotForUndo, undo, redo]
    );

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
                <RteToolbar
                    advanced={advanced}
                    isActive={isActive}
                    exec={exec}
                    applyHeading={applyHeading}
                    insertTaskList={insertTaskList}
                    openLinkPrompt={() => openLinkPrompt()}
                    insertTable={insertTable}
                    undo={undo}
                    redo={redo}
                />

                {showLinkPrompt && (
                    <RteLinkPrompt
                        isEditing={!!editingAnchorRef.current}
                        linkText={linkText}
                        linkUrl={linkUrl}
                        setLinkText={setLinkText}
                        setLinkUrl={setLinkUrl}
                        confirmLink={confirmLink}
                        cancelLink={cancelLink}
                    />
                )}

                {activeTable && tableToolbarPos && (
                    <RteTableToolbar
                        pos={tableToolbarPos}
                        toolbarRef={tableToolbarRef}
                        addRowAbove={addRowAbove}
                        addRowBelow={addRowBelow}
                        removeRow={removeRow}
                        addColumnLeft={addColumnLeft}
                        addColumnRight={addColumnRight}
                        removeColumn={removeColumn}
                        deleteTable={deleteTable}
                    />
                )}

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
                />
            </div>

            {error && <span className="rte-error-message">{error}</span>}
        </div>
    );
};
