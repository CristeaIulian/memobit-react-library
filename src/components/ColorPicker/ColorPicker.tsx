import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '../Button';
import { InputNumber } from '../InputNumber';
import { InputText } from '../InputText';
import { Tooltip } from '../Tooltip';

import './ColorPicker.scss';

interface RGB {
    r: number;
    g: number;
    b: number;
}

interface HSV {
    h: number;
    s: number;
    v: number;
}

interface HSL {
    h: number;
    s: number;
    l: number;
}

export interface ColorPickerProps {
    value?: string;
    onChange?: (hex: string) => void;
    /**
     * Colours to offer for reuse, above the gradient. Pass the ones already in play —
     * the palette a record set is actually using — so picking the same shade again is one
     * click rather than a fresh trip through the gradient. Without it every visit to the
     * picker mints a new near-miss: nine greys that differ by a digit, each its own entry
     * in anything that later groups or filters by colour. Duplicates and anything that
     * isn't a hex are dropped, and the list renders only when something survives.
     */
    swatches?: string[];
    swatchesLabel?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string): RGB | null => {
    const normalized = hex.replace('#', '').trim();
    if (![3, 6].includes(normalized.length)) return null;
    const full = normalized.length === 3 ? normalized.split('').map(c => c + c).join('') : normalized;
    const num = parseInt(full, 16);
    if (Number.isNaN(num)) return null;
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
};

/** Lower-cased and `#`-prefixed, so the same colour written three ways is one string. */
const normalizeHex = (hex: string): string => {
    const trimmed = hex.trim().replace('#', '').toLowerCase();
    const full = trimmed.length === 3 ? trimmed.split('').map(c => c + c).join('') : trimmed;
    return `#${full}`;
};

const rgbToHex = ({ r, g, b }: RGB): string =>
    `#${[r, g, b]
        .map(value => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0'))
        .join('')}`;

const rgbToHsv = ({ r, g, b }: RGB): HSV => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === rNorm) h = ((gNorm - bNorm) / delta) % 6;
        else if (max === gNorm) h = (bNorm - rNorm) / delta + 2;
        else h = (rNorm - gNorm) / delta + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return { h, s: Math.round(s * 100), v: Math.round(v * 100) };
};

const hsvToRgb = ({ h, s, v }: HSV): RGB => {
    const sat = s / 100;
    const val = v / 100;
    const c = val * sat;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = val - c;
    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
};

const rgbToHsl = ({ r, g, b }: RGB): HSL => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === rNorm) h = ((gNorm - bNorm) / delta) % 6;
        else if (max === gNorm) h = (bNorm - rNorm) / delta + 2;
        else h = (rNorm - gNorm) / delta + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToRgb = ({ h, s, l }: HSL): RGB => {
    const sat = s / 100;
    const light = l / 100;
    const c = (1 - Math.abs(2 * light - 1)) * sat;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = light - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
};

export const ColorPicker: React.FC<ColorPickerProps> = ({ value = '#4e79a7', onChange, swatches, swatchesLabel = 'Already in use' }) => {
    const [mode, setMode] = useState<'hex' | 'rgb' | 'hsl'>('hex');
    // Normalised and de-duplicated here rather than at every call site: a caller handing
    // over "the colours in use" should not also have to know that #ABC, #aabbcc and
    // #AABBCC are the same swatch.
    const reusable = useMemo(() => {
        const seen = new Set<string>();

        (swatches ?? []).forEach(entry => {
            const rgb = hexToRgb(entry);
            if (rgb) {
                seen.add(rgbToHex(rgb));
            }
        });

        return [...seen];
    }, [swatches]);
    const [hsv, setHsv] = useState<HSV>(() => {
        const rgb = hexToRgb(value) || { r: 78, g: 121, b: 167 };
        return rgbToHsv(rgb);
    });
    // The colour as it was actually given, held beside the gradient's own HSV because that
    // conversion is lossy: without it the field reported #f04343 for a stored #ef4444, so
    // the picker disagreed with the record it was editing. Dragging the gradient clears it
    // — at that point the handles *are* the source of truth.
    const [exactHex, setExactHex] = useState<string | null>(() => (hexToRgb(value) ? normalizeHex(value) : null));

    const svRef = useRef<HTMLDivElement | null>(null);
    const hsvRef = useRef<HSV>(hsv);
    hsvRef.current = hsv;

    useEffect(() => {
        const rgb = hexToRgb(value);
        if (rgb) {
            setHsv(rgbToHsv(rgb));
            setExactHex(normalizeHex(value));
        }
    }, [value]);

    const updateFromHsv = (next: HSV) => {
        const normalized = {
            h: clamp(next.h, 0, 360),
            s: clamp(next.s, 0, 100),
            v: clamp(next.v, 0, 100),
        };
        setHsv(normalized);
        setExactHex(null);
        const hex = rgbToHex(hsvToRgb(normalized));
        onChange?.(hex);
    };

    /**
     * Applies an exact colour: the gradient's handles move to it, but what goes out is the
     * hex that came in, not one re-derived from them.
     *
     * The gradient stores whole-degree hue and integer S/V, so hex -> HSV -> hex is lossy
     * for about 88% of colours — #ef4444 comes back as #f04343, and every one of a typical
     * eight-colour palette shifts by a digit. Greys are the accidental exception, since
     * saturation is 0. Routing a known colour through that is how a picker quietly mints a
     * near-miss of a colour that already exists, which is the whole thing a reuse swatch —
     * or a typed-in hex — exists to prevent.
     */
    const applyExactHex = (next: string) => {
        const rgb = hexToRgb(next);

        if (!rgb) {
            return;
        }

        setHsv(rgbToHsv(rgb));
        setExactHex(normalizeHex(next));
        onChange?.(next);
    };

    const applySv = (clientX: number, clientY: number) => {
        const rect = svRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = clamp(clientX - rect.left, 0, rect.width);
        const y = clamp(clientY - rect.top, 0, rect.height);
        const s = Math.round((x / rect.width) * 100);
        const v = Math.round(100 - (y / rect.height) * 100);
        // The hue comes from the ref, not the closure: a drag's handlers are created once
        // at pointerdown, so a captured `hsv` would pin the hue to whatever it was then
        // and every move would write it back, undoing any hue change mid-drag.
        updateFromHsv({ h: hsvRef.current.h, s, v });
    };

    /**
     * The old version bound mousemove on mousedown but never suppressed the browser's own
     * drag, so pressing on the gradient started a native image drag and swallowed every
     * move — the area only ever answered discrete clicks. preventDefault is what fixes
     * that; the listeners live on the window so the drag survives leaving the square, and
     * pointer events cover touch and pen for free.
     *
     * Deliberately not gated on hasPointerCapture: capture is requested as a nicety, but
     * where it is refused the drag must still work rather than silently going dead again.
     */
    const handleSvPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault();

        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            // Not available here; the window listeners below carry the drag regardless.
        }

        applySv(event.clientX, event.clientY);

        const handleMove = (moveEvent: PointerEvent) => applySv(moveEvent.clientX, moveEvent.clientY);
        const handleUp = () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
            window.removeEventListener('pointercancel', handleUp);
        };

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);
        window.addEventListener('pointercancel', handleUp);
    };

    // The exact colour wins while it still stands; once the gradient has been dragged it is
    // null and the handles decide.
    const rgb = exactHex ? (hexToRgb(exactHex) ?? hsvToRgb(hsv)) : hsvToRgb(hsv);
    const hex = exactHex ?? rgbToHex(rgb);
    const hsl = rgbToHsl(rgb);

    return (
        <div className="color-picker">
            {reusable.length > 0 && (
                <div className="color-picker__swatches">
                    <span className="color-picker__swatches-label">{swatchesLabel}</span>
                    <div className="color-picker__swatches-row">
                        {reusable.map(swatch => (
                            <Tooltip key={swatch} title={swatch}>
                                <button
                                    className={`color-picker__swatch${swatch === hex.toLowerCase() ? ' is-selected' : ''}`}
                                    onClick={() => applyExactHex(swatch)}
                                    style={{ backgroundColor: swatch }}
                                    type="button"
                                />
                            </Tooltip>
                        ))}
                    </div>
                </div>
            )}

            <div className="color-picker__preview" style={{ backgroundColor: hex }} />

            <div className="color-picker__controls">
                <div
                    className="color-picker__sv"
                    ref={svRef}
                    style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
                    onPointerDown={handleSvPointerDown}
                >
                    <div className="color-picker__sv-white" />
                    <div className="color-picker__sv-black" />
                    <div
                        className="color-picker__sv-handle"
                        style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
                    />
                </div>

                <div className="color-picker__slider">
                    <input
                        type="range"
                        min={0}
                        max={360}
                        value={hsv.h}
                        onChange={event => updateFromHsv({ ...hsv, h: Number(event.target.value) })}
                    />
                </div>
            </div>

            <div className="color-picker__mode-toggle">
                <Button variant="plain" className={mode === 'hex' ? 'is-active' : ''} onClick={() => setMode('hex')}>
                    Hex
                </Button>
                <Button variant="plain" className={mode === 'rgb' ? 'is-active' : ''} onClick={() => setMode('rgb')}>
                    RGB
                </Button>
                <Button variant="plain" className={mode === 'hsl' ? 'is-active' : ''} onClick={() => setMode('hsl')}>
                    HSL
                </Button>
            </div>

            {mode === 'hex' && (
                <div className="color-picker__fields color-picker__fields--hex">
                    <InputText
                        label="Hex"
                        value={hex}
                        onChange={value => {
                            // Through applyExactHex, not the gradient: a hex typed in full
                            // is already the answer, and re-deriving it shifted it by a digit.
                            if (hexToRgb(value)) {
                                applyExactHex(value.startsWith('#') ? value : `#${value}`);
                            }
                        }}
                    />
                </div>
            )}

            {mode === 'rgb' && (
                <div className="color-picker__fields color-picker__fields--rgb">
                    <InputNumber
                        label="R"
                        min={0}
                        max={255}
                        value={rgb.r}
                        onChange={value => updateFromHsv(rgbToHsv({ ...rgb, r: value ?? 0 }))}
                    />
                    <InputNumber
                        label="G"
                        min={0}
                        max={255}
                        value={rgb.g}
                        onChange={value => updateFromHsv(rgbToHsv({ ...rgb, g: value ?? 0 }))}
                    />
                    <InputNumber
                        label="B"
                        min={0}
                        max={255}
                        value={rgb.b}
                        onChange={value => updateFromHsv(rgbToHsv({ ...rgb, b: value ?? 0 }))}
                    />
                </div>
            )}

            {mode === 'hsl' && (
                <div className="color-picker__fields color-picker__fields--hsl">
                    <InputNumber
                        label="H"
                        min={0}
                        max={360}
                        value={hsl.h}
                        onChange={value => {
                            const next = hslToRgb({ ...hsl, h: value ?? 0 });
                            updateFromHsv(rgbToHsv(next));
                        }}
                    />
                    <InputNumber
                        label="S"
                        min={0}
                        max={100}
                        value={hsl.s}
                        onChange={value => {
                            const next = hslToRgb({ ...hsl, s: value ?? 0 });
                            updateFromHsv(rgbToHsv(next));
                        }}
                    />
                    <InputNumber
                        label="L"
                        min={0}
                        max={100}
                        value={hsl.l}
                        onChange={value => {
                            const next = hslToRgb({ ...hsl, l: value ?? 0 });
                            updateFromHsv(rgbToHsv(next));
                        }}
                    />
                </div>
            )}
        </div>
    );
};
