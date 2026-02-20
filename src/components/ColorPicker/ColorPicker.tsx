import React, { useEffect, useRef, useState } from 'react';

import { Button } from '../Button';
import { InputNumber } from '../InputNumber';
import { InputText } from '../InputText';

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

export const ColorPicker: React.FC<ColorPickerProps> = ({ value = '#4e79a7', onChange }) => {
    const [mode, setMode] = useState<'hex' | 'rgb' | 'hsl'>('hex');
    const [hsv, setHsv] = useState<HSV>(() => {
        const rgb = hexToRgb(value) || { r: 78, g: 121, b: 167 };
        return rgbToHsv(rgb);
    });

    const svRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const rgb = hexToRgb(value);
        if (rgb) {
            setHsv(rgbToHsv(rgb));
        }
    }, [value]);

    const updateFromHsv = (next: HSV) => {
        const normalized = {
            h: clamp(next.h, 0, 360),
            s: clamp(next.s, 0, 100),
            v: clamp(next.v, 0, 100),
        };
        setHsv(normalized);
        const hex = rgbToHex(hsvToRgb(normalized));
        onChange?.(hex);
    };

    const handleSvChange = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = svRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = clamp(event.clientX - rect.left, 0, rect.width);
        const y = clamp(event.clientY - rect.top, 0, rect.height);
        const s = Math.round((x / rect.width) * 100);
        const v = Math.round(100 - (y / rect.height) * 100);
        updateFromHsv({ ...hsv, s, v });
    };

    const handleSvMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        handleSvChange(event);
        const handleMouseMove = (moveEvent: MouseEvent) => handleSvChange(moveEvent as unknown as React.MouseEvent<HTMLDivElement>);
        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const rgb = hsvToRgb(hsv);
    const hex = rgbToHex(rgb);
    const hsl = rgbToHsl(rgb);

    return (
        <div className="color-picker">
            <div className="color-picker__preview" style={{ backgroundColor: hex }} />

            <div className="color-picker__controls">
                <div
                    className="color-picker__sv"
                    ref={svRef}
                    style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
                    onMouseDown={handleSvMouseDown}
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
                            const next = hexToRgb(value);
                            if (next) {
                                updateFromHsv(rgbToHsv(next));
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
