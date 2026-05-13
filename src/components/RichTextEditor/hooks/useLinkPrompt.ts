import { MutableRefObject, useCallback, useRef, useState } from 'react';

interface UseLinkPromptArgs {
    editorRef: MutableRefObject<HTMLDivElement | null>;
    snapshotForUndo: () => void;
    emitChange: () => void;
}

export const useLinkPrompt = ({ editorRef, snapshotForUndo, emitChange }: UseLinkPromptArgs) => {
    const [showLinkPrompt, setShowLinkPrompt] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const savedRangeRef = useRef<Range | null>(null);
    const editingAnchorRef = useRef<HTMLAnchorElement | null>(null);

    const openLinkPrompt = useCallback((anchor?: HTMLAnchorElement) => {
        if (anchor) {
            editingAnchorRef.current = anchor;
            setLinkText(anchor.textContent ?? '');
            setLinkUrl(anchor.getAttribute('href') ?? '');
        } else {
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
            const anchor = editingAnchorRef.current;
            if (linkUrl) {
                anchor.setAttribute('href', linkUrl);
                if (linkText) anchor.textContent = linkText;
            } else {
                const parent = anchor.parentNode;
                while (anchor.firstChild) parent?.insertBefore(anchor.firstChild, anchor);
                parent?.removeChild(anchor);
            }
            editingAnchorRef.current = null;
        } else {
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
    }, [editorRef, linkUrl, linkText, snapshotForUndo, emitChange]);

    const cancelLink = useCallback(() => {
        setShowLinkPrompt(false);
        setLinkUrl('');
        setLinkText('');
        savedRangeRef.current = null;
        editingAnchorRef.current = null;
    }, []);

    return {
        showLinkPrompt,
        linkUrl,
        setLinkUrl,
        linkText,
        setLinkText,
        editingAnchorRef,
        openLinkPrompt,
        confirmLink,
        cancelLink,
    };
};
