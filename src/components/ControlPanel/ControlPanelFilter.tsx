import React, { useState } from 'react';

import { Button } from '../Button';
import { Chip } from '../Chip';
import { DatePicker } from '../DatePicker';
import { Dropdown } from '../Dropdown';
import { Icon } from '../Icon';
import { InputDate } from '../InputDate';
import { InputNumber } from '../InputNumber';
import { InputSearch } from '../InputSearch';
import { InputText } from '../InputText';
import { Rating } from '../Rating';

import {
    ControlPanelFilter,
    ControlPanelFilterChangeEvent,
    ControlPanelFilterOption,
    ControlPanelFilterValue,
    DEFAULT_DATE_RANGE_PRESETS,
} from './ControlPanel.types';

const DROPDOWN_RADIO_FILTER_LIMIT = 3;

const getArrayValue = (value?: ControlPanelFilterValue): Array<string | number> => {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined || typeof value === 'boolean') return [];
    return [value];
};

const getFilterArrayValue = (value: Array<string | number>): string[] | number[] => {
    if (value.every(item => typeof item === 'number')) return value as number[];
    return value.map(String);
};

interface ControlPanelFilterItemProps {
    filter: ControlPanelFilter;
    onChange: (event: ControlPanelFilterChangeEvent) => void;
}

export const ControlPanelFilterItem: React.FC<ControlPanelFilterItemProps> = ({ filter, onChange }) => (
    <div className={`control-panel__filter${filter.type === 'checkbox' ? ' control-panel__filter--checkbox' : ''}`}>
        {filter.type !== 'checkbox' && (
            <span className={`control-panel__filter-title${filter.isActive ? ' control-panel__filter-title--active' : ''}`}>
                {filter.isActive && <span className="control-panel__filter-active-dot" />}
                {filter.icon && <Icon name={filter.icon} />}
                {filter.label}
            </span>
        )}
        <ControlPanelFilterControl filter={filter} onChange={onChange} />
    </div>
);

interface ControlPanelFilterControlProps {
    filter: ControlPanelFilter;
    onChange: (event: ControlPanelFilterChangeEvent) => void;
}

const ControlPanelFilterControl: React.FC<ControlPanelFilterControlProps> = ({ filter, onChange: emitFilterChange }) => {
    const selectedValues = getArrayValue(filter.value);
    const filterOptions = filter.options ?? [];
    // Local search state for `searchable` chips filters — lets the user type
    // to narrow a long option list (e.g. people picker) without the consumer
    // having to wire its own InputSearch.
    const [chipSearch, setChipSearch] = useState('');

    if (filter.type === 'checkbox') {
        return (
            <Chip
                count={filter.count}
                selected={filter.value === true}
                onClick={() => emitFilterChange({ filterId: filter.id, type: filter.type, value: filter.value !== true })}
            >
                {filter.label}
            </Chip>
        );
    }

    if (filter.type === 'date') {
        return (
            <InputDate
                min={filter.minDate}
                max={filter.maxDate}
                value={typeof filter.value === 'string' ? filter.value : ''}
                onChange={value => emitFilterChange({ filterId: filter.id, type: filter.type, value: value ?? null })}
            />
        );
    }

    if (filter.type === 'text') {
        return (
            <div className="control-panel__filter-text">
                <InputText
                    onChange={value => emitFilterChange({ filterId: filter.id, type: filter.type, value })}
                    placeholder={filter.placeholder}
                    value={typeof filter.value === 'string' ? filter.value : ''}
                />
            </div>
        );
    }

    if (filter.type === 'search') {
        return (
            <InputSearch
                className="control-panel__filter-search"
                onChange={value => emitFilterChange({ filterId: filter.id, type: filter.type, value })}
                placeholder={filter.placeholder}
                value={typeof filter.value === 'string' ? filter.value : ''}
            />
        );
    }

    if (filter.type === 'number') {
        return (
            <div className="control-panel__filter-number">
                <InputNumber
                    min={filter.min}
                    max={filter.max}
                    step={filter.step}
                    placeholder={filter.placeholder}
                    value={typeof filter.value === 'number' ? filter.value : undefined}
                    onChange={value => emitFilterChange({ filterId: filter.id, type: filter.type, value: value ?? null })}
                />
            </div>
        );
    }

    if (filter.type === 'rating') {
        return (
            <Rating
                selectable
                icon={filter.ratingIcon ?? 'star'}
                maxRate={filter.maxRate ?? 10}
                rating={typeof filter.value === 'number' ? filter.value : 0}
                variant={filter.ratingVariant ?? 'warning'}
                onSelect={value => emitFilterChange({ filterId: filter.id, type: filter.type, value })}
            />
        );
    }

    if (filter.type === 'range') {
        const rangeArr = Array.isArray(filter.value) ? (filter.value as number[]) : [];
        const minVal: number | undefined = rangeArr[0];
        const maxVal: number | undefined = rangeArr[1];
        const isInvalid = minVal !== undefined && maxVal !== undefined && minVal > maxVal;
        const emitRange = (newMin: number | undefined, newMax: number | undefined) =>
            emitFilterChange({ filterId: filter.id, type: filter.type, value: [newMin, newMax] as number[] });
        return (
            <div className="control-panel__filter-range">
                <InputNumber
                    min={filter.min}
                    max={filter.max}
                    step={filter.step}
                    placeholder="Min"
                    value={minVal}
                    error={isInvalid ? 'Min exceeds max' : undefined}
                    onChange={v => emitRange(v, maxVal)}
                />
                <span className="control-panel__filter-range-sep">—</span>
                <InputNumber
                    min={filter.min}
                    max={filter.max}
                    step={filter.step}
                    placeholder="Max"
                    value={maxVal}
                    error={isInvalid ? 'Max is below min' : undefined}
                    onChange={v => emitRange(minVal, v)}
                />
            </div>
        );
    }

    if (filter.type === 'date-range') {
        const dateArr = Array.isArray(filter.value) ? (filter.value as string[]) : [];
        const fromStr: string | undefined = dateArr[0] || undefined;
        const toStr: string | undefined = dateArr[1] || undefined;
        const presets = filter.presets ?? DEFAULT_DATE_RANGE_PRESETS;

        const parseLocalDate = (s: string | undefined): Date | undefined => {
            if (!s) return undefined;
            const [y, m, d] = s.split('-').map(Number);
            return new Date(y, m - 1, d);
        };

        const formatToDateStr = (val: Date): string => {
            const y = val.getFullYear();
            const m = String(val.getMonth() + 1).padStart(2, '0');
            const d = String(val.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        const emitRange = (newFrom: string | undefined, newTo: string | undefined) =>
            emitFilterChange({ filterId: filter.id, type: filter.type, value: [newFrom ?? '', newTo ?? ''] });

        const handlePreset = (days: number) => {
            const end = filter.maxDate ? parseLocalDate(filter.maxDate) : new Date();
            if (!end) return;

            const start = new Date(end);
            start.setDate(start.getDate() - days);
            emitRange(formatToDateStr(start), formatToDateStr(end));
        };

        return (
            <div className="control-panel__filter-date-range">
                {presets.length > 0 && (
                    <div className="control-panel__filter-date-presets">
                        {presets.map(preset => (
                            <Button key={preset.days} size="small" variant="default" onClick={() => handlePreset(preset.days)}>
                                {preset.label}
                            </Button>
                        ))}
                    </div>
                )}
                <DatePicker
                    mode="range"
                    minDate={parseLocalDate(filter.minDate)}
                    maxDate={parseLocalDate(filter.maxDate)}
                    placeholder={filter.placeholder ?? 'Select range'}
                    value={fromStr && toStr ? { start: parseLocalDate(fromStr)!, end: parseLocalDate(toStr)! } : undefined}
                    onChange={val => {
                        if (val && typeof val === 'object' && !Array.isArray(val) && 'start' in val) {
                            emitRange(formatToDateStr(val.start), formatToDateStr(val.end));
                            return;
                        }

                        emitRange(undefined, undefined);
                    }}
                />
            </div>
        );
    }

    if (filter.type === 'dropdown') {
        if (!filter.multiple && filterOptions.length > 0 && filterOptions.length <= DROPDOWN_RADIO_FILTER_LIMIT) {
            return (
                <div className="control-panel__filter-list">
                    {filterOptions.map(option => {
                        const isSelected = filter.value === option.value;
                        return (
                            <div key={option.value} className={`control-panel__filter-radio ${isSelected ? 'control-panel__filter-radio--selected' : ''}`}>
                                <label className="control-panel__filter-radio-label">
                                    <input
                                        checked={isSelected}
                                        className="control-panel__filter-radio-input"
                                        name={filter.id}
                                        onChange={() =>
                                            emitFilterChange({
                                                filterId: filter.id,
                                                type: filter.type,
                                                value: option.value,
                                                option,
                                                options: [option],
                                            })
                                        }
                                        type="radio"
                                        value={option.value}
                                    />
                                    {option.color && <span className="control-panel__filter-swatch" style={{ backgroundColor: option.color }} />}
                                    {option.icon && <Icon name={option.icon} />}
                                    <span className="control-panel__filter-label">{option.label}</span>
                                    {option.count !== undefined && <span className="control-panel__filter-count">{option.count}</span>}
                                </label>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <Dropdown
                className="control-panel__filter-dropdown"
                multiple={filter.multiple}
                name={filter.id}
                onChange={selectedOption => {
                    const selectedOptions = Array.isArray(selectedOption) ? selectedOption : selectedOption ? [selectedOption] : [];
                    emitFilterChange({
                        filterId: filter.id,
                        type: filter.type,
                        value: Array.isArray(selectedOption) ? getFilterArrayValue(selectedOption.map(o => o.value)) : (selectedOption?.value ?? null),
                        option: Array.isArray(selectedOption) ? null : (selectedOption as ControlPanelFilterOption | null),
                        options: selectedOptions as ControlPanelFilterOption[],
                    });
                }}
                options={filterOptions}
                placeholder={filter.placeholder}
                searchable={filter.searchable ?? false}
                selectedCountDisplay="inline"
                usePortal={false}
                value={typeof filter.value === 'boolean' ? null : filter.value}
            />
        );
    }

    if (filter.type === 'chips') {
        const trimmedSearch = chipSearch.trim().toLowerCase();
        const visibleOptions = filter.searchable && trimmedSearch
            ? filterOptions.filter(o => o.label.toLowerCase().includes(trimmedSearch))
            : filterOptions;
        return (
            <div className="control-panel__filter-chips-wrap">
                {filter.searchable && filterOptions.length > 0 && (
                    <InputSearch
                        className="control-panel__filter-chip-search"
                        value={chipSearch}
                        onChange={setChipSearch}
                        placeholder={filter.placeholder ?? 'Filter...'}
                    />
                )}
                <div
                    className="control-panel__filter-chips"
                    style={filter.maxHeight !== undefined
                        ? { maxHeight: typeof filter.maxHeight === 'number' ? `${filter.maxHeight}px` : filter.maxHeight, overflowY: 'auto' }
                        : undefined}
                >
                    {visibleOptions.map(option => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                            <Chip
                                key={option.value}
                                color={option.color}
                                count={option.count}
                                disabled={option.disabled}
                                icon={option.icon}
                                title={option.tooltip}
                                selected={isSelected}
                                onClick={() => {
                                    if (option.disabled) return;
                                    const nextValue = isSelected ? selectedValues.filter(v => v !== option.value) : [...selectedValues, option.value];
                                    emitFilterChange({
                                        filterId: filter.id,
                                        type: filter.type,
                                        value: getFilterArrayValue(nextValue),
                                        option,
                                        options: filterOptions.filter(o => nextValue.includes(o.value)),
                                    });
                                }}
                            >
                                {option.imageUrl && (
                                    <img
                                        className="control-panel__filter-chip-avatar"
                                        src={option.imageUrl}
                                        alt=""
                                    />
                                )}
                                {option.label}
                            </Chip>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="control-panel__filter-list">
            {filterOptions.map(option => {
                const isSelected = filter.value === option.value;
                return (
                    <div
                        key={option.value}
                        className={`control-panel__filter-radio ${isSelected ? 'control-panel__filter-radio--selected' : ''} ${option.disabled ? 'control-panel__filter-radio--disabled' : ''}`}
                        title={option.tooltip}
                    >
                        <label className="control-panel__filter-radio-label">
                            <input
                                checked={isSelected}
                                className="control-panel__filter-radio-input"
                                disabled={option.disabled}
                                name={filter.id}
                                onChange={() => emitFilterChange({ filterId: filter.id, type: filter.type, value: option.value, option, options: [option] })}
                                type="radio"
                                value={option.value}
                            />
                            {option.color && <span className="control-panel__filter-swatch" style={{ backgroundColor: option.color }} />}
                            <span className="control-panel__filter-label">{option.label}</span>
                            {option.count !== undefined && <span className="control-panel__filter-count">{option.count}</span>}
                        </label>
                    </div>
                );
            })}
        </div>
    );
};
