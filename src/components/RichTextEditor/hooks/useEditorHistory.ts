import { MutableRefObject, useCallback, useRef } from 'react';

const MAX_HISTORY = 100;

export const useEditorHistory = (editorRef: MutableRefObject<HTMLDivElement | null>, isInternalUpdate: MutableRefObject<boolean>, emitChange: () => void) => {
    const undoStack = useRef<string[]>([]);
    const redoStack = useRef<string[]>([]);

    const snapshotForUndo = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        undoStack.current.push(editor.innerHTML);
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        redoStack.current = [];
    }, [editorRef]);

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
    }, [editorRef, isInternalUpdate, emitChange]);

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
    }, [editorRef, isInternalUpdate, emitChange]);

    return { snapshotForUndo, undo, redo };
};
