import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Calendar, type CalendarDateRange } from '../Calendar';
import { Button } from '../Button';
import { InputText } from '../InputText';
import { addMonths } from '../../helpers/Datetime';

import './DateRangePicker.scss';

interface DateRange {
    start?: string;
    end?: string;
}

export interface DateRangePreset {
    label: string;
    days: number;
}

export interface DateRangePickerProps {
    label?: string;
    value?: DateRange;
    onChange?: (range: DateRange) => void;
    min?: string;
    max?: string;
    alwaysOpen?: boolean;
    autoClose?: boolean;
    presets?: DateRangePreset[];
}

const toDate = (value?: string) => {
    if (!value) return undefined;
    const [year, month, day] = value.split('-').map(part => Number(part));
    if (!year || !month || !day) return undefined;
    return new Date(year, month - 1, day);
};

const toKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    label,
    value,
    onChange,
    min,
    max,
    alwaysOpen = false,
    autoClose = true,
    presets,
}) => {
    const [internalRange, setInternalRange] = useState<DateRange>({});
    const [baseMonth, setBaseMonth] = useState(() => new Date());
    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(alwaysOpen);
    const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({ position: 'fixed', visibility: 'hidden' });
    const [startInput, setStartInput] = useState(value?.start ?? '');
    const [endInput, setEndInput] = useState(value?.end ?? '');
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const range = value ?? internalRange;
    const startDate = toDate(range.start);
    const endDate = toDate(range.end);
    const calendarValue: CalendarDateRange | undefined =
        startDate && endDate ? { start: startDate, end: endDate } : undefined;

    const updateRange = (next: DateRange) => {
        if (!value) {
            setInternalRange(next);
        }
        onChange?.(next);
    };

    const handleRangeChange = (next: Date | CalendarDateRange | Date[] | undefined) => {
        if (next && typeof next === 'object' && 'start' in next) {
            updateRange({ start: toKey(next.start), end: toKey(next.end) });
            setRangeStart(null);
            if (!alwaysOpen && autoClose) {
                setIsCalendarOpen(false);
            }
        }
    };

    const handleRangeStartChange = (date: Date | null) => {
        setRangeStart(date);
    };

    const isValidDate = (val: string) => /^\d{4}-\d{2}-\d{2}$/.test(val) && toDate(val) !== undefined;

    const handleStartBlur = () => {
        if (isValidDate(startInput)) {
            updateRange({ ...range, start: startInput });
        } else {
            setStartInput(range.start ?? '');
        }
    };

    const handleEndBlur = () => {
        if (isValidDate(endInput)) {
            updateRange({ ...range, end: endInput });
        } else {
            setEndInput(range.end ?? '');
        }
    };

    const handlePreset = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        updateRange({ start: toKey(start), end: toKey(end) });
    };

    useEffect(() => {
        setStartInput(range.start ?? '');
    }, [range.start]);

    useEffect(() => {
        setEndInput(range.end ?? '');
    }, [range.end]);

    const secondMonth = useMemo(() => addMonths(baseMonth, 1), [baseMonth]);
    const isCalendarVisible = alwaysOpen || isCalendarOpen;
    const isOverlayMode = !alwaysOpen && isCalendarOpen;

    const updateOverlayPosition = useCallback(() => {
        if (!isOverlayMode || !containerRef.current || !overlayRef.current) {
            return;
        }

        const anchorRect = containerRef.current.getBoundingClientRect();
        const panelRect = overlayRef.current.getBoundingClientRect();
        const viewportMargin = 16;
        const offset = 8;
        const availableBelow = window.innerHeight - anchorRect.bottom - viewportMargin;
        const availableAbove = anchorRect.top - viewportMargin;
        const shouldOpenAbove = availableBelow < panelRect.height && availableAbove > panelRect.height;

        const top = shouldOpenAbove
            ? anchorRect.top - panelRect.height - offset
            : anchorRect.bottom + offset;
        const constrainedTop = Math.max(viewportMargin, Math.min(top, window.innerHeight - panelRect.height - viewportMargin));
        const unconstrainedLeft = anchorRect.left;
        const constrainedLeft = Math.max(
            viewportMargin,
            Math.min(unconstrainedLeft, window.innerWidth - panelRect.width - viewportMargin)
        );

        setOverlayStyle({
            position: 'fixed',
            top: `${constrainedTop}px`,
            left: `${constrainedLeft}px`,
            zIndex: 1000,
        });
    }, [isOverlayMode]);

    useEffect(() => {
        if (alwaysOpen) {
            setIsCalendarOpen(true);
        }
    }, [alwaysOpen]);

    useEffect(() => {
        if (!isOverlayMode) {
            setOverlayStyle({ position: 'fixed', visibility: 'hidden' });
            return;
        }

        const animationFrame = requestAnimationFrame(() => requestAnimationFrame(updateOverlayPosition));
        window.addEventListener('resize', updateOverlayPosition);
        window.addEventListener('scroll', updateOverlayPosition, true);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', updateOverlayPosition);
            window.removeEventListener('scroll', updateOverlayPosition, true);
        };
    }, [isOverlayMode, updateOverlayPosition]);

    useEffect(() => {
        if (!isOverlayMode) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (containerRef.current?.contains(target) || overlayRef.current?.contains(target)) {
                return;
            }

            setIsCalendarOpen(false);
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOverlayMode]);

    const calendarContent = (
        <div className="date-range-picker__calendar">
            <div className="date-range-picker__nav">
                <Button variant="default" icon="caret-left" onClick={() => setBaseMonth(addMonths(baseMonth, -1))} title="Previous month" />
                <span>
                    {baseMonth.toLocaleString('default', { month: 'long' })} {baseMonth.getFullYear()} -
                    {secondMonth.toLocaleString('default', { month: 'long' })} {secondMonth.getFullYear()}
                </span>
                <Button variant="default" icon="caret-right" onClick={() => setBaseMonth(addMonths(baseMonth, 1))} title="Next month" />
            </div>

            <div className="date-range-picker__months">
                <Calendar
                    mode="range"
                    value={calendarValue}
                    onChange={handleRangeChange}
                    rangeStart={rangeStart}
                    onRangeStartChange={handleRangeStartChange}
                    currentMonth={baseMonth}
                    onMonthChange={setBaseMonth}
                    showHeader={false}
                    showToday={false}
                    minDate={min ? toDate(min) : undefined}
                    maxDate={max ? toDate(max) : undefined}
                />
                <Calendar
                    mode="range"
                    value={calendarValue}
                    onChange={handleRangeChange}
                    rangeStart={rangeStart}
                    onRangeStartChange={handleRangeStartChange}
                    currentMonth={secondMonth}
                    onMonthChange={setBaseMonth}
                    showHeader={false}
                    showToday={false}
                    minDate={min ? toDate(min) : undefined}
                    maxDate={max ? toDate(max) : undefined}
                />
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="date-range-picker">
            {label && presets && presets.length > 0 ? (
                <div className="date-range-picker__label-row">
                    <label className="date-range-picker__label">{label}</label>
                    <div className="date-range-picker__presets">
                        {presets.map(preset => (
                            <Button
                                key={preset.days}
                                size="small"
                                variant="default"
                                onClick={() => handlePreset(preset.days)}
                            >
                                {preset.label}
                            </Button>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {label && <label className="date-range-picker__label">{label}</label>}
                    {presets && presets.length > 0 && (
                        <div className="date-range-picker__presets">
                            {presets.map(preset => (
                                <Button
                                    key={preset.days}
                                    size="small"
                                    variant="default"
                                    onClick={() => handlePreset(preset.days)}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </>
            )}
            <div className="date-range-picker__inputs">
                <InputText
                    value={startInput}
                    placeholder="YYYY-MM-DD"
                    maxLength={10}
                    onChange={setStartInput}
                    onBlur={handleStartBlur}
                />
                <span className="date-range-picker__separator">to</span>
                <InputText
                    value={endInput}
                    placeholder="YYYY-MM-DD"
                    maxLength={10}
                    onChange={setEndInput}
                    onBlur={handleEndBlur}
                />
                {!alwaysOpen && (
                    <Button
                        className="date-range-picker__toggle"
                        variant="default"
                        onClick={() => setIsCalendarOpen(previous => !previous)}
                    >
                        {isCalendarVisible ? 'Hide calendar' : 'Choose dates'}
                    </Button>
                )}
            </div>

            {alwaysOpen && isCalendarVisible && calendarContent}
            {isOverlayMode &&
                createPortal(
                    <div ref={overlayRef} className="date-range-picker__overlay" style={overlayStyle}>
                        {calendarContent}
                    </div>,
                    document.body
                )}
        </div>
    );
};
