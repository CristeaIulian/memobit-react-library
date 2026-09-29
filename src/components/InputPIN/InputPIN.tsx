import { ClipboardEvent, FC, KeyboardEvent, ReactElement, useCallback, useEffect, useRef } from 'react';

import './InputPIN.scss';

export type InputPINType = 'numeric' | 'alphanumeric';

export interface InputPINProps {
    autoFocus?: boolean;
    disabled?: boolean;
    error?: string;
    id?: string;
    label?: string;
    /** Number of cells. */
    length?: number;
    /** Renders a gap after this many cells, the way grouped codes are printed. */
    groupSize?: number;
    /** Fired on every edit with the code so far, shorter than `length` while incomplete. */
    onChange: (value: string) => void;
    /** Fired once the last cell is filled, with the finished code. */
    onComplete?: (value: string) => void;
    /** Masks the characters, for a PIN rather than a one-time code. */
    secret?: boolean;
    success?: string;
    /** `numeric` accepts digits only and asks phones for the number pad. */
    type?: InputPINType;
    value: string;
}

const NUMERIC_PATTERN = /[^0-9]/g;
const ALPHANUMERIC_PATTERN = /[^0-9a-zA-Z]/g;

export const InputPIN: FC<InputPINProps> = ({
    autoFocus = false,
    disabled = false,
    error,
    id,
    label,
    length = 6,
    groupSize,
    onChange,
    onComplete,
    secret = false,
    success,
    type = 'numeric',
    value,
}: InputPINProps): ReactElement => {
    const cellsRef = useRef<Array<HTMLInputElement | null>>([]);
    // `onComplete` must fire once per completed code, not on every re-render that happens
    // to hold a full value.
    const hasReportedComplete = useRef(false);

    const sanitize = useCallback(
        (raw: string): string => raw.replace(type === 'numeric' ? NUMERIC_PATTERN : ALPHANUMERIC_PATTERN, '').slice(0, length),
        [length, type]
    );

    const code = sanitize(value);
    const characters = code.split('');

    useEffect(() => {
        if (code.length === length && !hasReportedComplete.current) {
            hasReportedComplete.current = true;
            onComplete?.(code);
        }

        if (code.length < length) {
            hasReportedComplete.current = false;
        }
    }, [code, length, onComplete]);

    useEffect(() => {
        if (autoFocus) cellsRef.current[0]?.focus();
    }, [autoFocus]);

    const focusCell = useCallback(
        (index: number) => {
            const target = cellsRef.current[Math.min(Math.max(index, 0), length - 1)];
            target?.focus();
            target?.select();
        },
        [length]
    );

    const commit = useCallback(
        (next: string[]) => {
            // Trailing holes would make the string shorter than the cells the user filled,
            // so the value is trimmed at the first gap and stays a plain contiguous code.
            const joined = next.join('').replace(/\s/g, '');
            onChange(sanitize(joined));
        },
        [onChange, sanitize]
    );

    const handleCellChange = useCallback(
        (index: number, raw: string) => {
            // A cell that already holds a character reports "old + new" when the caret sits
            // after it rather than over it, so the previous value is stripped before use.
            const previous = characters[index] ?? '';
            const incoming = previous && raw.startsWith(previous) ? raw.slice(previous.length) : raw;
            const typed = sanitize(incoming);
            if (!typed) return;

            const next = [...characters];

            // Typing over a cell inserts just that character; a paste-like multi-character
            // value spills into the cells that follow.
            typed.split('').forEach((character, offset) => {
                if (index + offset < length) next[index + offset] = character;
            });

            commit(next);
            focusCell(index + typed.length);
        },
        [characters, commit, focusCell, length, sanitize]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>, index: number) => {
            if (event.key === 'Backspace') {
                event.preventDefault();

                const next = [...characters];

                if (next[index]) {
                    // Clearing a filled cell leaves the caret where it is, so the user can
                    // retype in place.
                    next.splice(index, 1);
                    commit(next);
                    return;
                }

                if (index > 0) {
                    next.splice(index - 1, 1);
                    commit(next);
                    focusCell(index - 1);
                }

                return;
            }

            if (event.key === 'Delete') {
                event.preventDefault();
                const next = [...characters];
                next.splice(index, 1);
                commit(next);
                return;
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                focusCell(index - 1);
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                focusCell(index + 1);
            }
        },
        [characters, commit, focusCell]
    );

    const handlePaste = useCallback(
        (event: ClipboardEvent<HTMLInputElement>, index: number) => {
            event.preventDefault();

            const pasted = sanitize(event.clipboardData.getData('text'));
            if (!pasted) return;

            const next = [...characters];
            pasted.split('').forEach((character, offset) => {
                if (index + offset < length) next[index + offset] = character;
            });

            commit(next);
            focusCell(index + pasted.length);
        },
        [characters, commit, focusCell, length, sanitize]
    );

    const wrapperClasses = ['input-pin-wrapper', error ? 'input-pin-wrapper--error' : '', success ? 'input-pin-wrapper--success' : '']
        .filter(Boolean)
        .join(' ');

    return (
        <div className={wrapperClasses}>
            {label && (
                <label className="input-pin-label" htmlFor={id ? `${id}-0` : undefined}>
                    {label}
                </label>
            )}

            <div className="input-pin-cells">
                {Array.from({ length }, (_, index) => (
                    <input
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        className={`input-pin-cell${characters[index] ? ' input-pin-cell--filled' : ''}${
                            groupSize && index > 0 && index % groupSize === 0 ? ' input-pin-cell--group-start' : ''
                        }`}
                        disabled={disabled}
                        id={id ? `${id}-${index}` : undefined}
                        inputMode={type === 'numeric' ? 'numeric' : 'text'}
                        key={index}
                        maxLength={length}
                        onChange={event => handleCellChange(index, event.target.value)}
                        onFocus={event => event.target.select()}
                        onKeyDown={event => handleKeyDown(event, index)}
                        onPaste={event => handlePaste(event, index)}
                        type={secret ? 'password' : 'text'}
                        ref={element => {
                            cellsRef.current[index] = element;
                        }}
                        value={characters[index] ?? ''}
                    />
                ))}
            </div>

            {error && <span className="input-pin-error-message">{error}</span>}
            {success && <span className="input-pin-success-message">{success}</span>}
        </div>
    );
};
