export interface ToolbarButton {
    command: string;
    value?: string;
    label: string;
    title: string;
    isAdvanced?: boolean;
}

export const TOOLBAR_BUTTONS: ToolbarButton[] = [
    { command: 'bold', label: 'B', title: 'Bold (Ctrl+B)' },
    { command: 'italic', label: 'I', title: 'Italic (Ctrl+I)' },
    { command: 'underline', label: 'U', title: 'Underline (Ctrl+U)' },
    { command: 'insertUnorderedList', label: '• List', title: 'Unordered List' },
    { command: 'insertOrderedList', label: '1. List', title: 'Ordered List' },
];

export const HISTORY_BUTTONS: ToolbarButton[] = [
    { command: 'undo', label: '↩ Undo', title: 'Undo (Ctrl+Z)' },
    { command: 'redo', label: '↪ Redo', title: 'Redo (Ctrl+Shift+Z)' },
];

export const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

export const ADVANCED_BUTTONS: ToolbarButton[] = [{ command: 'formatBlock', value: 'pre', label: 'Code Block', title: 'Code Block', isAdvanced: true }];

/**
 * Builds a new `<tr>` with `colCount` editable cells. Used when inserting
 * rows into an existing `<table>` element from the RichTextEditor.
 */
export const makeTableRow = (colCount: number): HTMLTableRowElement => {
    const tr = document.createElement('tr');
    for (let i = 0; i < colCount; i++) {
        const td = document.createElement('td');
        td.setAttribute('contenteditable', 'true');
        td.textContent = 'Cell';
        tr.appendChild(td);
    }
    return tr;
};

export const DEFAULT_TABLE_HTML = `
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
