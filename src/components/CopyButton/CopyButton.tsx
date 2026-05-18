import React, { useEffect, useRef, useState } from 'react';

import { Button, type ButtonVariant } from '../Button';

import './CopyButton.scss';

export type CopyButtonStatus = 'idle' | 'copied' | 'error';

export interface CopyButtonProps {
    children?: React.ReactNode;
    className?: string;
    copiedLabel?: string;
    disabled?: boolean;
    errorLabel?: string;
    iconOnly?: boolean;
    label?: string;
    onCopy?: (value: string) => void;
    onError?: (error: unknown) => void;
    resetDelay?: number;
    size?: 'small' | 'medium' | 'large';
    title?: string;
    value: string;
    variant?: ButtonVariant;
}

const copyToClipboard = async (value: string): Promise<void> => {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(value);
            return;
        } catch {
            // Fall through to the textarea fallback for browsers that expose
            // the Clipboard API but deny it in the current context.
        }
    }

    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, value.length);

    try {
        const copied = document.execCommand('copy');
        if (!copied) {
            throw new Error('Copy command failed.');
        }
    } finally {
        document.body.removeChild(textarea);
    }
};

export const CopyButton: React.FC<CopyButtonProps> = ({
    children,
    className = '',
    copiedLabel = 'Copied',
    disabled = false,
    errorLabel = 'Copy failed',
    iconOnly = false,
    label = 'Copy',
    onCopy,
    onError,
    resetDelay = 1800,
    size = 'medium',
    title,
    value,
    variant = 'ghost',
}: CopyButtonProps) => {
    const [status, setStatus] = useState<CopyButtonStatus>('idle');
    const resetTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (resetTimeoutRef.current) {
                window.clearTimeout(resetTimeoutRef.current);
            }
        };
    }, []);

    const resetStatusSoon = () => {
        if (resetTimeoutRef.current) {
            window.clearTimeout(resetTimeoutRef.current);
        }

        resetTimeoutRef.current = window.setTimeout(() => setStatus('idle'), resetDelay);
    };

    const handleCopy = async () => {
        try {
            await copyToClipboard(value);
            setStatus('copied');
            resetStatusSoon();
            onCopy?.(value);
        } catch (error) {
            setStatus('error');
            resetStatusSoon();
            onError?.(error);
        }
    };

    const statusLabel = status === 'copied' ? copiedLabel : status === 'error' ? errorLabel : label;
    const statusVariant = status === 'copied' && variant === 'ghost' ? 'success' : status === 'error' && variant === 'ghost' ? 'danger' : variant;

    return (
        <Button
            className={`copy-button copy-button--${status} ${iconOnly ? 'copy-button--icon-only' : ''} ${className}`}
            disabled={disabled}
            icon={status === 'copied' ? 'checkmark' : 'clipboard'}
            iconVariant={status === 'error' ? 'danger' : status === 'copied' ? 'success' : 'default'}
            onClick={handleCopy}
            size={size}
            title={title || statusLabel}
            type="button"
            variant={statusVariant}
        >
            {iconOnly ? undefined : children || statusLabel}
        </Button>
    );
};
