import { FC, ReactNode, useEffect, useState } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { formatDate } from '../../helpers/Datetime';
import { useMessages } from '../../hooks/useLanguage';
import { Chip } from '../Chip';
import { DatePicker } from '../DatePicker';
import { Icon } from '../Icon';
import { InputNumber } from '../InputNumber';
import { InputSearch } from '../InputSearch';
import { RangeSlider, RangeSliderValue } from '../RangeSlider';
import { Rating } from '../Rating';
import { ToggleSwitch } from '../ToggleSwitch';
import { Tooltip } from '../Tooltip';

import { CHECKLIST_PREVIEW, getTextModes, pickControl, RATING_SEGMENTED_MAX, toDateRange, toList, toNumber, toRange, toScalar, toText } from './filterRules';
import {
    DateFilterSpec,
    DateRangeFilterSpec,
    FilterContext,
    FilterOption,
    FilterSpec,
    FilterValue,
    MultiFilterSpec,
    RangeFilterSpec,
    RatingFilterSpec,
    SingleFilterSpec,
    TextFilterSpec,
} from './PageShell.types';

import './FilterField.scss';

export interface FilterFieldProps {
    spec: FilterSpec;
    value: FilterValue | undefined;
    context: FilterContext;
    onChange: (value: FilterValue) => void;
}

type OptionValue = string | number;

export interface SegmentedItem {
    value: OptionValue | null;
    label: ReactNode;
}

export const Segmented: FC<{ items: SegmentedItem[]; value: OptionValue | null; onSelect: (value: OptionValue | null) => void }> = ({
    items,
    value,
    onSelect,
}) => (
    <div className="filter-field__segmented">
        {items.map(item => (
            <button
                key={String(item.value)}
                type="button"
                className={['filter-field__segment', item.value === value ? 'filter-field__segment--selected' : ''].filter(Boolean).join(' ')}
                onClick={() => onSelect(item.value)}
            >
                {item.label}
            </button>
        ))}
    </div>
);

interface OptionRowProps {
    label: string;
    mark: 'radio' | 'check';
    selected: boolean;
    count?: number | string;
    icon?: FilterOption['icon'];
    imageUrl?: string;
    hint?: string;
    onClick: () => void;
}

const OptionImage: FC<{ src: string }> = ({ src }) => <img className="filter-field__avatar" src={src} alt="" loading="lazy" />;

// A hint shows on hover; without one the option renders as is.
const WithHint: FC<{ hint?: string; children: ReactNode }> = ({ hint, children }) => (hint ? <Tooltip title={hint}>{children}</Tooltip> : <>{children}</>);

export const OptionRow: FC<OptionRowProps> = ({ label, mark, selected, count, icon, imageUrl, hint, onClick }) => (
    <WithHint hint={hint}>
        <button
            type="button"
            className={['filter-field__row', selected ? 'filter-field__row--selected' : '', count === 0 && !selected ? 'filter-field__row--empty' : '']
                .filter(Boolean)
                .join(' ')}
            onClick={onClick}
        >
            <span className={`filter-field__mark filter-field__mark--${mark}`}>{mark === 'check' && selected && <Icon name="checkmark" size="sm" />}</span>
            {imageUrl ? <OptionImage src={imageUrl} /> : icon && <Icon name={icon} size="sm" />}
            <span className="filter-field__row-label">{label}</span>
            {count !== undefined && <span className="filter-field__count">{count}</span>}
        </button>
    </WithHint>
);

const toggleIn = (list: OptionValue[], item: OptionValue): OptionValue[] => (list.includes(item) ? list.filter(other => other !== item) : [...list, item]);

const OptionList: FC<{
    spec: SingleFilterSpec | MultiFilterSpec;
    value: FilterValue | undefined;
    context: FilterContext;
    onChange: (value: FilterValue) => void;
}> = ({ spec, value, context, onChange }) => {
    const t = useMessages(libMessages);
    const [query, setQuery] = useState('');
    const [showAll, setShowAll] = useState(false);
    const control = pickControl(spec, context);
    const single = spec.kind === 'single';
    const selected = single ? [toScalar(value)].filter((item): item is OptionValue => item !== null) : toList(value);
    const isSelected = (option: FilterOption) => selected.includes(option.value);
    // A single choice taps off again everywhere except the radio list, which has its own "Any" row.
    const select = (option: FilterOption) => {
        if (!single) {
            onChange(toggleIn(selected, option.value));
            return;
        }
        onChange(isSelected(option) && control !== 'radio' ? null : option.value);
    };

    if (control === 'segmented') {
        const items: SegmentedItem[] = [{ value: null, label: t.pageAny }, ...spec.options.map(option => ({ value: option.value, label: option.label }))];
        return <Segmented items={items} value={selected[0] ?? null} onSelect={next => onChange(next)} />;
    }

    if (control === 'chips') {
        return (
            <div className="filter-field__chips">
                {spec.options.map(option => (
                    <WithHint key={option.value} hint={option.hint}>
                        <Chip
                            className={option.count === 0 && !isSelected(option) ? 'filter-field__chip--empty' : undefined}
                            color={option.color}
                            count={option.count}
                            icon={option.imageUrl ? undefined : option.icon}
                            selected={isSelected(option)}
                            size={context === 'sheet' ? 'medium' : 'small'}
                            onClick={() => select(option)}
                        >
                            {option.imageUrl ? (
                                <span className="filter-field__chip-label">
                                    <OptionImage src={option.imageUrl} />
                                    {option.label}
                                </span>
                            ) : (
                                option.label
                            )}
                        </Chip>
                    </WithHint>
                ))}
            </div>
        );
    }

    const mark = single ? 'radio' : 'check';
    const row = (option: FilterOption) => (
        <OptionRow
            key={option.value}
            label={option.label}
            mark={mark}
            selected={isSelected(option)}
            count={option.count}
            icon={option.icon}
            imageUrl={option.imageUrl}
            hint={option.hint}
            onClick={() => select(option)}
        />
    );

    if (control === 'search-list') {
        const needle = query.trim().toLowerCase();
        const picked = spec.options.filter(isSelected);
        const rest = spec.options.filter(option => !isSelected(option) && (!needle || option.label.toLowerCase().includes(needle)));
        return (
            <div className="filter-field__stack">
                <InputSearch value={query} placeholder={t.pageSearchOptions(spec.label)} onChange={setQuery} />
                <div className="filter-field__options">
                    {picked.map(row)}
                    {picked.length > 0 && rest.length > 0 && <div className="filter-field__divider" />}
                    {rest.map(row)}
                    {picked.length === 0 && rest.length === 0 && <span className="filter-field__empty">{t.pageNoMatches}</span>}
                </div>
            </div>
        );
    }

    if (control === 'radio') {
        return (
            <div className="filter-field__rows">
                <OptionRow label={t.pageAny} mark="radio" selected={selected.length === 0} onClick={() => onChange(null)} />
                {spec.options.map(row)}
            </div>
        );
    }

    // Checklist: past the preview size it shows the first options (plus any selected further down) and a "Show all" link.
    const isLong = spec.options.length > CHECKLIST_PREVIEW + 1;
    const shown = isLong && !showAll ? spec.options.filter((option, index) => index < CHECKLIST_PREVIEW || isSelected(option)) : spec.options;
    return (
        <div className="filter-field__stack">
            <div className="filter-field__rows">{shown.map(row)}</div>
            {isLong && (
                <button type="button" className="filter-field__link" onClick={() => setShowAll(!showAll)}>
                    {showAll ? t.pageShowFewer : t.pageShowAll(spec.options.length)}
                </button>
            )}
        </div>
    );
};

const RangeField: FC<{ spec: RangeFilterSpec; value: FilterValue | undefined; onChange: (value: FilterValue) => void }> = ({ spec, value, onChange }) => {
    const [lo, hi] = toRange(value, spec.min, spec.max);
    const [draft, setDraft] = useState<RangeSliderValue>([lo, hi]);

    // The slider moves the draft; the filter changes once the thumb is released.
    useEffect(() => setDraft([lo, hi]), [lo, hi]);

    const commit = ([nextLo, nextHi]: RangeSliderValue) => onChange(nextLo <= spec.min && nextHi >= spec.max ? null : [nextLo, nextHi]);

    // A typed end is kept inside the scale and never past the other end.
    const typeEnd = (end: 0 | 1, typed: number | undefined) => {
        const fallback = end === 0 ? spec.min : spec.max;
        const clamped = Math.min(Math.max(typed ?? fallback, spec.min), spec.max);
        const next: RangeSliderValue = end === 0 ? [Math.min(clamped, draft[1]), draft[1]] : [draft[0], Math.max(clamped, draft[0])];
        setDraft(next);
        commit(next);
    };

    const slider = (
        <RangeSlider
            min={spec.min}
            max={spec.max}
            step={spec.step}
            value={draft}
            showValues={!spec.inputs}
            formatValue={next => (spec.unit ? `${next} ${spec.unit}` : String(next))}
            onChange={setDraft}
            onChangeEnd={commit}
        />
    );

    if (!spec.inputs) return slider;

    return (
        <div className="filter-field__stack">
            {slider}
            <div className="filter-field__range-inputs">
                <InputNumber value={draft[0]} min={spec.min} max={draft[1]} step={spec.step} onChange={typed => typeEnd(0, typed)} />
                <span className="filter-field__range-dash">–</span>
                <InputNumber value={draft[1]} min={draft[0]} max={spec.max} step={spec.step} onChange={typed => typeEnd(1, typed)} />
                {spec.unit && <span className="filter-field__count">{spec.unit}</span>}
            </div>
        </div>
    );
};

const RatingField: FC<{ spec: RatingFilterSpec; value: FilterValue | undefined; onChange: (value: FilterValue) => void }> = ({ spec, value, onChange }) => {
    const t = useMessages(libMessages);
    const current = toNumber(value);

    if (spec.max <= RATING_SEGMENTED_MAX) {
        const steps = Array.from({ length: spec.max - 1 }, (_, index) => index + 2);
        const items: SegmentedItem[] = [
            { value: 0, label: t.pageAny },
            ...steps.map(step => ({ value: step, label: step === spec.max ? `${step}★` : `${step}★+` })),
        ];
        return <Segmented items={items} value={current} onSelect={next => onChange(typeof next === 'number' ? next : 0)} />;
    }

    return (
        <div className="filter-field__rating">
            <Rating rating={current} maxRate={spec.max} selectable onSelect={next => onChange(next === current ? 0 : next)} />
            {current > 0 && (
                <button type="button" className="filter-field__link" onClick={() => onChange(0)}>
                    {t.pageAny}
                </button>
            )}
        </div>
    );
};

const TextField: FC<{ spec: TextFilterSpec; value: FilterValue | undefined; onChange: (value: FilterValue) => void }> = ({ spec, value, onChange }) => {
    const t = useMessages(libMessages);
    const { text, mode } = toText(value);
    const modes = getTextModes(spec, { anyWord: t.pageAnyWord, allWords: t.pageAllWords });
    const currentMode = mode ?? modes?.[0]?.value;

    return (
        <div className="filter-field__stack">
            <InputSearch value={text} placeholder={spec.placeholder} onChange={next => onChange({ text: next, mode: currentMode })} />
            {modes && (
                <Segmented
                    items={modes.map(option => ({ value: option.value, label: option.label }))}
                    value={currentMode ?? null}
                    onSelect={next => onChange({ text, mode: next === null ? undefined : String(next) })}
                />
            )}
        </div>
    );
};

const parseDate = (value: string | number | null): Date | undefined => {
    if (value === null) return undefined;
    const [year, month, day] = String(value).split('-').map(Number);
    return year && month && day ? new Date(year, month - 1, day) : undefined;
};

const DateField: FC<{ spec: DateFilterSpec; value: FilterValue | undefined; onChange: (value: FilterValue) => void }> = ({ spec, value, onChange }) => {
    const t = useMessages(libMessages);
    return (
        <DatePicker
            value={parseDate(toScalar(value))}
            minDate={parseDate(spec.min ?? null)}
            maxDate={parseDate(spec.max ?? null)}
            placeholder={t.selectDate}
            clearable
            onChange={next => onChange(next instanceof Date ? formatDate(next, 'YYYY-MM-DD') : null)}
        />
    );
};

const DateRangeField: FC<{ spec: DateRangeFilterSpec; value: FilterValue | undefined; onChange: (value: FilterValue) => void }> = ({
    spec,
    value,
    onChange,
}) => {
    const t = useMessages(libMessages);
    const [from, to] = toDateRange(value);
    const start = parseDate(from || null);
    const end = parseDate(to || null);

    return (
        <DatePicker
            mode="range"
            value={start && end ? { start, end } : undefined}
            minDate={parseDate(spec.min ?? null)}
            maxDate={parseDate(spec.max ?? null)}
            placeholder={t.selectDate}
            clearable
            onChange={next =>
                onChange(
                    next && !(next instanceof Date) && !Array.isArray(next) ? [formatDate(next.start, 'YYYY-MM-DD'), formatDate(next.end, 'YYYY-MM-DD')] : null
                )
            }
        />
    );
};

/** One filter, drawn with the widget that suits its kind, option count and context. */
export const FilterField: FC<FilterFieldProps> = ({ spec, value, context, onChange }) => {
    const className = `filter-field filter-field--${context}`;

    switch (spec.kind) {
        case 'single':
        case 'multi':
            return (
                <div className={className}>
                    <OptionList spec={spec} value={value} context={context} onChange={onChange} />
                </div>
            );
        case 'range':
            return (
                <div className={className}>
                    <RangeField spec={spec} value={value} onChange={onChange} />
                </div>
            );
        case 'rating':
            return (
                <div className={className}>
                    <RatingField spec={spec} value={value} onChange={onChange} />
                </div>
            );
        case 'toggle': {
            const checked = value === true;
            return (
                <div className={`${className} filter-field__switch-row`}>
                    <button type="button" className="filter-field__switch-label" onClick={() => onChange(!checked)}>
                        {spec.label}
                    </button>
                    {spec.count !== undefined && <span className="filter-field__count">{spec.count}</span>}
                    <ToggleSwitch checked={checked} size="small" showLabels={false} onChange={onChange} />
                </div>
            );
        }
        case 'text':
            return (
                <div className={className}>
                    <TextField spec={spec} value={value} onChange={onChange} />
                </div>
            );
        case 'date':
            return (
                <div className={className}>
                    <DateField spec={spec} value={value} onChange={onChange} />
                </div>
            );
        case 'date-range':
            return (
                <div className={className}>
                    <DateRangeField spec={spec} value={value} onChange={onChange} />
                </div>
            );
    }
};
