import { MutableRefObject, useCallback, useState } from 'react';

import { makeTableRow } from '../helpers';

interface UseTableOpsArgs {
    editorRef: MutableRefObject<HTMLDivElement | null>;
    snapshotForUndo: () => void;
    emitChange: () => void;
}

export interface TableToolbarPos {
    top: number;
    left: number;
}

export const useTableOps = ({ editorRef, snapshotForUndo, emitChange }: UseTableOpsArgs) => {
    const [activeTable, setActiveTable] = useState<HTMLTableElement | null>(null);
    const [tableToolbarPos, setTableToolbarPos] = useState<TableToolbarPos | null>(null);

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
    }, [editorRef]);

    const showTableToolbar = useCallback(
        (table: HTMLTableElement) => {
            const editor = editorRef.current;
            if (!editor) return;
            const editorRect = editor.getBoundingClientRect();
            const tableRect = table.getBoundingClientRect();
            setActiveTable(table);
            setTableToolbarPos({
                top: tableRect.top - editorRect.top - 36,
                left: tableRect.left - editorRect.left,
            });
        },
        [editorRef]
    );

    const hideTableToolbar = useCallback(() => {
        setActiveTable(null);
        setTableToolbarPos(null);
    }, []);

    const addRowBelow = useCallback(() => {
        if (!activeTable) return;
        snapshotForUndo();
        const caretCell = getCaretCell();
        const caretRow = caretCell?.closest('tr') ?? null;
        const tbody = activeTable.querySelector('tbody') ?? activeTable;
        const refRow = caretRow ?? tbody.querySelector('tr:last-child');
        if (!refRow) return;
        const colCount = refRow.querySelectorAll('td,th').length;
        tbody.insertBefore(makeTableRow(colCount), refRow.nextSibling);
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
        tbody.insertBefore(makeTableRow(colCount), refRow);
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

    return {
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
    };
};
