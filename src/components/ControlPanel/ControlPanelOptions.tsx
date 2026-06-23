import React from 'react';

import { Button } from '../Button';
import { Chip } from '../Chip';
import { IconName } from '../Icon';
import { Separator } from '../Separator';
import { Tooltip } from '../Tooltip';

import {
    ControlPanelGroupByConfig,
    ControlPanelOption,
    ControlPanelOptionChangeEvent,
    ControlPanelOptionGroup,
    ControlPanelViewMode,
    ControlPanelViewToggleConfig,
    ControlPanelVisibleColumnsConfig,
} from './ControlPanel.types';

interface ViewToggleOptionItem {
    value: string;
    label: string;
    icon: IconName | React.ReactElement;
}

const VIEW_TOGGLE_OPTIONS: ViewToggleOptionItem[] = [
    { value: 'cards', label: 'Grid', icon: 'grid' },
    { value: 'table', label: 'Table', icon: 'table' },
];

const GALLERY_OPTION: ViewToggleOptionItem = { value: 'gallery', label: 'Gallery', icon: 'gallery' };

interface ControlPanelOptionsProps {
    normalizedOptionGroups: ControlPanelOptionGroup[];
    onOptionChange?: (event: ControlPanelOptionChangeEvent) => void;
    viewToggle?: ControlPanelViewToggleConfig;
    groupBy?: ControlPanelGroupByConfig;
    visibleColumns?: ControlPanelVisibleColumnsConfig;
}

export const ControlPanelOptions: React.FC<ControlPanelOptionsProps> = ({
    normalizedOptionGroups,
    onOptionChange,
    viewToggle,
    groupBy,
    visibleColumns,
}) => (
    <div className="control-panel__options">
        <div className="control-panel__options-header">
            <span className="control-panel__options-heading">Options</span>
        </div>

        {viewToggle && (
            <div className="control-panel__option control-panel__option--view-toggle">
                <div className="control-panel__option-view-toggle">
                    {(viewToggle.options ?? [...VIEW_TOGGLE_OPTIONS, ...(viewToggle.showGallery ? [GALLERY_OPTION] : [])]).map(opt => (
                        <Button
                            key={opt.value}
                            icon={opt.icon}
                            size="small"
                            variant={viewToggle.value === opt.value ? 'info' : 'default'}
                            onClick={() => viewToggle.onChange(opt.value as ControlPanelViewMode)}
                        >
                            {opt.label}
                        </Button>
                    ))}
                </div>
            </div>
        )}

        {groupBy && groupBy.options.length > 0 && (
            <>
                {viewToggle && <Separator spacing={0} />}
                <div className="control-panel__option control-panel__option--group-by">
                    <span className="control-panel__filter-title">Group by</span>
                    <div className="control-panel__filter-chips">
                        {groupBy.options.map(opt => {
                            const isSelected = groupBy.value === opt.value;
                            return (
                                <Chip key={opt.value} selected={isSelected} onClick={() => groupBy.onChange(isSelected ? null : opt.value)}>
                                    {opt.label}
                                </Chip>
                            );
                        })}
                    </div>
                </div>
            </>
        )}

        {visibleColumns && (
            <>
                {(viewToggle || (groupBy && groupBy.options.length > 0)) && <Separator spacing={0} />}
                <div className="control-panel__option control-panel__option--chips">
                    <span className="control-panel__filter-title">Visible columns</span>
                    <div className="control-panel__filter-chips">
                        {visibleColumns.options.map(opt => {
                            const isSelected = visibleColumns.value.includes(opt.value);
                            return (
                                <Chip
                                    key={opt.value}
                                    selected={isSelected}
                                    onClick={() => {
                                        const next = isSelected
                                            ? visibleColumns.value.filter(v => v !== opt.value)
                                            : [...visibleColumns.value, opt.value];
                                        visibleColumns.onChange(next);
                                    }}
                                >
                                    {opt.label}
                                </Chip>
                            );
                        })}
                    </div>
                </div>
            </>
        )}

        {normalizedOptionGroups.length > 0 && (viewToggle || groupBy || visibleColumns) && <Separator spacing={0} />}

        {normalizedOptionGroups.map((group, groupIndex) => (
            <div className="control-panel__option-group" key={group.id ?? group.label ?? groupIndex}>
                {group.label && <span className="control-panel__option-group-label">{group.label}</span>}
                {group.options.map((option, optionIndex) => {
                    const previous: ControlPanelOption | undefined = optionIndex > 0 ? group.options[optionIndex - 1] : undefined;
                    const showSeparator = !!previous && previous.type !== option.type;
                    return (
                        <React.Fragment key={option.id}>
                            {showSeparator && <Separator spacing={0} />}
                            <div className={`control-panel__option control-panel__option--${option.type}`}>
                                {option.type === 'checkbox' && (
                                    <Chip
                                        selected={option.value ?? false}
                                        onClick={() => onOptionChange?.({ optionId: option.id, value: !(option.value ?? false) })}
                                    >
                                        {option.label}
                                    </Chip>
                                )}
                                {option.type === 'radio' && (
                                    <>
                                        {option.label && <span className="control-panel__filter-title">{option.label}</span>}
                                        <div className="control-panel__filter-list">
                                            {option.options.map(radioOption => {
                                                const isSelected = option.value === radioOption.value;
                                                const emitChange = () => onOptionChange?.({ optionId: option.id, value: radioOption.value });
                                                const row = (
                                                    <div
                                                        className={`control-panel__filter-radio ${isSelected ? 'control-panel__filter-radio--selected' : ''} ${radioOption.disabled ? 'control-panel__filter-radio--disabled' : ''}`}
                                                    >
                                                        <label className="control-panel__filter-radio-label">
                                                            <input
                                                                checked={isSelected}
                                                                className="control-panel__filter-radio-input"
                                                                disabled={radioOption.disabled}
                                                                name={`control-panel-option-${option.id}`}
                                                                onChange={emitChange}
                                                                /* Re-clicking the selected radio fires no `change`, so re-emit here. */
                                                                onClick={() => {
                                                                    if (radioOption.disabled) return;
                                                                    if (isSelected) emitChange();
                                                                }}
                                                                type="radio"
                                                                value={radioOption.value}
                                                            />
                                                            <span className="control-panel__filter-label">{radioOption.label}</span>
                                                        </label>
                                                    </div>
                                                );
                                                return radioOption.title ? (
                                                    <Tooltip key={radioOption.value} title={radioOption.title}>
                                                        {row}
                                                    </Tooltip>
                                                ) : (
                                                    <React.Fragment key={radioOption.value}>{row}</React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                                {option.type === 'chips' && (
                                    <>
                                        {option.label && <span className="control-panel__filter-title">{option.label}</span>}
                                        <div className="control-panel__filter-chips">
                                            {option.options.map(chipOption => {
                                                const isSelected = option.value.includes(chipOption.value);
                                                return (
                                                    <Chip
                                                        key={chipOption.value}
                                                        disabled={chipOption.disabled}
                                                        title={chipOption.title}
                                                        selected={isSelected}
                                                        onClick={() => {
                                                            if (chipOption.disabled) return;
                                                            const next = isSelected
                                                                ? option.value.filter(v => v !== chipOption.value)
                                                                : [...option.value, chipOption.value];
                                                            onOptionChange?.({ optionId: option.id, value: next });
                                                        }}
                                                    >
                                                        {chipOption.label}
                                                    </Chip>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        ))}
    </div>
);
