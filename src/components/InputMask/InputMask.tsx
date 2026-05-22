import React, { useState, useRef, useCallback, useId, forwardRef, useImperativeHandle } from 'react';
import './InputMask.scss';

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Mask format characters:
 *   9  →  digit (0-9)
 *   a  →  letter (a-z, A-Z)
 *   *  →  alphanumeric
 *   \  →  escape next character (treat literally)
 * Everything else is a literal separator (auto-inserted).
 */
export type InputMaskFormat = string;

export type InputMaskSize = 'sm' | 'md' | 'lg';
export type InputMaskVariant = 'default' | 'success' | 'danger';

export interface InputMaskProps {
    /** Mask pattern, e.g. "9999 9999 9999 9999" for credit cards */
    mask: InputMaskFormat;
    value?: string;
    onChange?: (raw: string, masked: string) => void;
    onComplete?: (raw: string, masked: string) => void;
    placeholder?: string;
    label?: string;
    hint?: string;
    error?: string;
    highlighted?: boolean;
    size?: InputMaskSize;
    variant?: InputMaskVariant;
    disabled?: boolean;
    readOnly?: boolean;
    /** Character shown for unfilled positions in the input */
    maskChar?: string;
    /** Show a monospaced font for structured formats */
    mono?: boolean;
    /** Icon rendered on the left */
    icon?: React.ReactNode;
    /** Icon rendered on the right (e.g. copy button) */
    suffix?: React.ReactNode;
    className?: string;
    id?: string;
    name?: string;
    autoComplete?: string;
}

export interface InputMaskHandle {
    focus(): void;
    clear(): void;
    getRawValue(): string;
}

// ── Mask engine ───────────────────────────────────────────────────────────────

const MASK_TOKENS: Record<string, RegExp> = {
    '9': /\d/,
    a: /[a-zA-Z]/,
    '*': /[a-zA-Z0-9]/,
};

function isMaskToken(ch: string): boolean {
    return ch in MASK_TOKENS;
}

/** Parse the mask string, respecting backslash escapes. */
function parseMask(mask: string): Array<{ type: 'token'; key: string } | { type: 'literal'; char: string }> {
    const result: Array<{ type: 'token'; key: string } | { type: 'literal'; char: string }> = [];
    let i = 0;
    while (i < mask.length) {
        if (mask[i] === '\\' && i + 1 < mask.length) {
            result.push({ type: 'literal', char: mask[i + 1] });
            i += 2;
        } else if (isMaskToken(mask[i])) {
            result.push({ type: 'token', key: mask[i] });
            i++;
        } else {
            result.push({ type: 'literal', char: mask[i] });
            i++;
        }
    }
    return result;
}

/**
 * Given raw user input (digits/letters only), produce the masked display string
 * and the list of raw characters that were accepted.
 */
function applyMask(raw: string, parsed: ReturnType<typeof parseMask>, maskChar: string): { masked: string; rawAccepted: string } {
    let rawIdx = 0;
    let masked = '';
    let rawAccepted = '';

    for (const slot of parsed) {
        if (slot.type === 'literal') {
            masked += slot.char;
        } else {
            if (rawIdx < raw.length) {
                const ch = raw[rawIdx];
                masked += ch;
                rawAccepted += ch;
                rawIdx++;
            } else {
                masked += maskChar;
            }
        }
    }

    return { masked, rawAccepted };
}

/** Count total token slots in mask. */
function totalSlots(parsed: ReturnType<typeof parseMask>): number {
    return parsed.filter(s => s.type === 'token').length;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const InputMask = forwardRef<InputMaskHandle, InputMaskProps>(
    (
        {
            mask,
            value,
            onChange,
            onComplete,
            placeholder,
            label,
            hint,
            error,
            highlighted,
            size = 'md',
            variant = 'default',
            disabled = false,
            readOnly = false,
            maskChar = '_',
            mono = true,
            icon,
            suffix,
            className = '',
            id,
            name,
            autoComplete,
        },
        ref
    ) => {
        const parsed = React.useMemo(() => parseMask(mask), [mask]);
        const slots = React.useMemo(() => totalSlots(parsed), [parsed]);
        const autoId = useId();
        const inputId = id ?? autoId;

        // Internal display value (masked string with maskChar placeholders)
        const [internalRaw, setInternalRaw] = useState<string>(() => {
            if (value !== undefined) return value;
            return '';
        });

        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => ({
            focus: () => inputRef.current?.focus(),
            clear: () => {
                setInternalRaw('');
                onChange?.('', '');
            },
            getRawValue: () => internalRaw,
        }));

        // Compute masked display from raw
        const { masked } = applyMask(internalRaw, parsed, maskChar);
        const displayValue = masked.includes(maskChar) ? masked.replace(new RegExp(maskChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), maskChar) : masked;

        const resolvedVariant: InputMaskVariant = error ? 'danger' : variant;

        const wrapClass = [
            'input-mask',
            `input-mask--${size}`,
            `input-mask--${resolvedVariant}`,
            highlighted ? 'input-mask--highlighted' : '',
            disabled ? 'input-mask--disabled' : '',
            readOnly ? 'input-mask--readonly' : '',
            mono ? 'input-mask--mono' : '',
            icon ? 'input-mask--has-icon' : '',
            suffix ? 'input-mask--has-suffix' : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        // All input is handled here — onChange is suppressed so the controlled
        // value is never overwritten by the browser between keystrokes.
        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (disabled || readOnly) return;

                if (e.key === 'Backspace') {
                    e.preventDefault();
                    const newRaw = internalRaw.slice(0, -1);
                    const { masked: newMasked } = applyMask(newRaw, parsed, maskChar);
                    setInternalRaw(newRaw);
                    onChange?.(newRaw, newMasked);
                    return;
                }

                // Ignore modifier-only keys, Tab, Enter, arrows, etc.
                if (e.key.length !== 1 || e.ctrlKey || e.metaKey) return;

                e.preventDefault();

                // Don't accept input beyond mask capacity
                if (internalRaw.length >= slots) return;

                const char = e.key;
                // Find the next token slot to validate against
                let tokenIndex = 0;
                for (const slot of parsed) {
                    if (slot.type === 'token') {
                        if (tokenIndex === internalRaw.length) {
                            if (!MASK_TOKENS[slot.key].test(char)) return; // invalid char for this slot
                            break;
                        }
                        tokenIndex++;
                    }
                }

                const newRaw = internalRaw + char;
                const { masked: newMasked, rawAccepted } = applyMask(newRaw, parsed, maskChar);
                setInternalRaw(rawAccepted);
                onChange?.(rawAccepted, newMasked);

                if (rawAccepted.length === slots) {
                    onComplete?.(rawAccepted, newMasked);
                }
            },
            [disabled, readOnly, internalRaw, parsed, maskChar, slots, onChange, onComplete]
        );

        // Build a placeholder from the mask pattern using maskChar
        const computedPlaceholder = placeholder ?? parsed.map(s => (s.type === 'literal' ? s.char : maskChar)).join('');

        const isFilled = internalRaw.length === slots;

        return (
            <div className={wrapClass}>
                {label && (
                    <label className="input-mask__label" htmlFor={inputId}>
                        {label}
                    </label>
                )}

                <div className="input-mask__field">
                    {icon && (
                        <span className="input-mask__icon">
                            {icon}
                        </span>
                    )}

                    <input
                        ref={inputRef}
                        id={inputId}
                        name={name}
                        type="text"
                        inputMode="text"
                        autoComplete={autoComplete}
                        className={['input-mask__input', isFilled ? 'input-mask__input--filled' : ''].filter(Boolean).join(' ')}
                        value={displayValue}
                        placeholder={computedPlaceholder}
                        disabled={disabled}
                        readOnly={readOnly}
                        maxLength={mask.length}
                        onChange={() => {
                            /* controlled via onKeyDown */
                        }}
                        onKeyDown={handleKeyDown}
                    />

                    {/* Progress indicator: filled slots / total */}
                    <span className="input-mask__counter">
                        {internalRaw.length}/{slots}
                    </span>

                    {suffix && <span className="input-mask__suffix">{suffix}</span>}
                </div>

                {(hint || error) && (
                    <p
                        className={error ? 'input-mask__error' : 'input-mask__hint'}
                    >
                        {error ?? hint}
                    </p>
                )}
            </div>
        );
    }
);

InputMask.displayName = 'InputMask';

// ── Preset masks ──────────────────────────────────────────────────────────────

export const InputMaskPresets = {
    creditCard: '9999 9999 9999 9999',
    iban: 'aa99 9999 9999 9999 9999 99',
    cvv: '999',
    expiry: '99/99',
    phone: '+99 (999) 999-9999',
    ssn: '999-99-9999',
    ipv4: '999.999.999.999',
    serialNumber: '***-***-***-***',
    date: '99/99/9999',
    time: '99:99',
    uuid: '********-****-****-****-************',
} as const;
