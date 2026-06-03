import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { InputText } from '../InputText';
import { caretDown } from '../../icons/caret-down';
import { clear } from '../../icons/clear';

import './Dropdown.scss';

export interface DropdownOption {
    className?: string;
    details?: React.ReactNode;
    icon?: IconName;
    label: string;
    suffixIcon?: IconName;
    value: string | number;
}

export type DropdownSelectedCountDisplay = 'inline' | 'floating' | 'none';

export interface DropdownProps {
    allowCustomValue?: boolean;
    autofocus?: boolean;
    className?: string;
    disabled?: boolean;
    error?: string;
    highlighted?: boolean;
    id?: string;
    label?: string;
    multiple?: boolean;
    name: string;
    onChange: (option: DropdownOption | DropdownOption[] | null, name: string) => void;
    onSearchChange?: (search: string) => void;
    options: DropdownOption[];
    placeholder?: string;
    searchable?: boolean;
    searchValue?: string;
    selectedCountDisplay?: DropdownSelectedCountDisplay;
    success?: string;
    usePortal?: boolean;
    value?: number | number[] | string | string[] | null;
    valueAsChip?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
    allowCustomValue = false,
    autofocus = false,
    className = '',
    disabled = false,
    error,
    highlighted = false,
    id,
    label,
    multiple = false,
    name,
    onChange,
    onSearchChange,
    options,
    placeholder = 'Select an option',
    searchable = true,
    searchValue,
    selectedCountDisplay = 'inline',
    success,
    usePortal = true,
    value,
    valueAsChip = true,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filterText, setFilterText] = useState<string>(searchValue || '');
    const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>(options);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const [selectedOptions, setSelectedOptions] = useState<DropdownOption[]>([]);
    const [portalPosition, setPortalPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
    const [shouldOpenUpward, setShouldOpenUpward] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<(HTMLLIElement | null)[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const uid = useId();
    const inputId = id ?? `dropdown-${uid}`;

    // Filter options when filterText changes
    useEffect(() => {
        if (!searchable || !filterText) {
            setFilteredOptions(options);
        } else {
            const filtered = options.filter(option => option.label.toLowerCase().includes(filterText.toLowerCase()));
            setFilteredOptions(filtered);
        }

        // Reset focused index when options change
        setFocusedIndex(-1);
    }, [filterText, options, searchable]);

    // Tracks the value seen on the previous run of the controlled-value
    // effect below. Lets us tell apart "value actually changed" (parent
    // committed a new selection or cleared it) from "value unchanged, effect
    // re-fired because options/multiple/etc reference changed" (common when
    // parents pass an inline .map() result as options). The distinction
    // matters because filterText carries user-typed search text — wiping it
    // on every options-ref change destroyed the typed text mid-keystroke.
    const prevValueRef = useRef<typeof value>(value);

    // Handle controlled component behavior with value prop.
    //
    // Two responsibilities, treated differently:
    //   1. selectedOptions — keep in sync with `value` against the current
    //      `options` list. Always update so a late-arriving options list
    //      can resolve a label for an already-set value.
    //   2. filterText (the search input contents) — only touch when `value`
    //      actually transitions. If `value` is unchanged and the effect
    //      re-fired purely because the options array got a new reference,
    //      the user may be actively typing and we MUST NOT clobber their
    //      input.
    useEffect(() => {
        const prevValue = prevValueRef.current;
        prevValueRef.current = value;
        const valueChanged = !Object.is(prevValue, value);

        // Reset scenarios — only touch filterText if value actually transitioned.
        if (value === null || value === undefined) {
            if (valueChanged) {
                setSelectedOptions([]);
                setFilterText('');
            }
            return;
        }

        if (multiple && Array.isArray(value) && value.length === 0) {
            if (valueChanged) {
                setSelectedOptions([]);
                setFilterText('');
            }
            return;
        }

        if (!multiple && value === '') {
            if (valueChanged) {
                setSelectedOptions([]);
                setFilterText('');
            }
            return;
        }

        if (options.length > 0) {
            if (multiple && Array.isArray(value)) {
                const selected = options.filter(option => {
                    if (typeof option.value === 'number') {
                        return (value as number[]).includes(option.value);
                    }

                    return (value as string[]).includes(option.value.toString());
                });
                setSelectedOptions(selected);
                // Multiple mode shows chips, not search text — clear filterText
                // when the value actually changes, but never on an options-ref
                // re-render (user could be typing to add another chip).
                if (valueChanged) setFilterText('');
            } else if (!multiple && (typeof value === 'string' || typeof value === 'number')) {
                // Handle both string and number values for single selection
                const selectedOption = options.find(option => {
                    if (typeof option.value === 'number' && typeof value === 'number') {
                        return option.value === value;
                    }
                    return option.value.toString() === value.toString();
                });

                if (selectedOption) {
                    setSelectedOptions([selectedOption]);
                    // Only sync the displayed label when value actually changes.
                    // If user is searching with a value already set, preserve typing.
                    if (valueChanged) setFilterText(selectedOption.label);
                } else if (allowCustomValue && typeof value === 'string' && value.trim()) {
                    // If custom values are allowed and value is a non-empty string, show it as a custom option
                    const customOption: DropdownOption = {
                        label: value.trim(),
                        value: value.trim(),
                        className: 'custom-option',
                    };
                    setSelectedOptions([customOption]);
                    if (valueChanged) setFilterText(value.trim());
                } else {
                    // If value doesn't match any option, clear selection — but
                    // only on actual value change, not on options-ref churn.
                    if (valueChanged) {
                        setSelectedOptions([]);
                        setFilterText('');
                    }
                }
            }
        } else if (allowCustomValue && !multiple && typeof value === 'string' && value.trim()) {
            // If no options but custom values are allowed and value is a non-empty string, show it
            const customOption: DropdownOption = {
                label: value.trim(),
                value: value.trim(),
                className: 'custom-option',
            };
            setSelectedOptions([customOption]);
            if (valueChanged) setFilterText(value.trim());
        } else {
            // If no options available yet, clear the display — only when value transitions.
            if (valueChanged) {
                setSelectedOptions([]);
                setFilterText('');
            }
        }
    }, [value, options, multiple, searchable, allowCustomValue]);

    // Sync external searchValue with internal filterText
    useEffect(() => {
        if (searchable && searchValue !== undefined) {
            setFilterText(searchValue);
        }
    }, [searchValue, searchable]);

    // Calculate if dropdown should open upward and update portal position
    useEffect(() => {
        if (!isOpen || !dropdownRef.current) return;

        const calculatePosition = () => {
            if (!dropdownRef.current) return;

            const rect = dropdownRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const dropdownMenuHeight = 300; // Approximate max height of dropdown menu

            // Calculate available space above and below
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            // Determine if should open upward
            const openUpward = spaceBelow < dropdownMenuHeight && spaceAbove > spaceBelow;
            setShouldOpenUpward(openUpward);

            // Update portal position if using portal
            if (usePortal) {
                setPortalPosition({
                    top: openUpward ? rect.top + window.scrollY : rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        };

        calculatePosition();

        window.addEventListener('scroll', calculatePosition, true);
        window.addEventListener('resize', calculatePosition);

        return () => {
            window.removeEventListener('scroll', calculatePosition, true);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [isOpen, usePortal]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                // For portal, also check if click is inside the portal menu
                if (usePortal && isOpen) {
                    const portalMenu = document.querySelector('.dropdown-menu--portal');
                    if (portalMenu && portalMenu.contains(event.target as Node)) {
                        return;
                    }
                }

                // Auto-create custom value on close when allowCustomValue is enabled
                if (allowCustomValue && !multiple && filterText.trim()) {
                    const matchesSelection = selectedOptions.length > 0 && selectedOptions[0].label.toLowerCase() === filterText.trim().toLowerCase();

                    if (!matchesSelection) {
                        const existingOption = options.find(o => o.label.toLowerCase() === filterText.toLowerCase() || o.value.toString() === filterText);
                        const resolvedOption: DropdownOption = existingOption || {
                            label: filterText.trim(),
                            value: filterText.trim(),
                            className: 'custom-option',
                        };
                        setSelectedOptions([resolvedOption]);
                        setFilterText(resolvedOption.label);
                        setIsOpen(false);
                        if (onChange) {
                            onChange(resolvedOption, name);
                        }
                        return;
                    }
                }

                setIsOpen(false);

                // Restore the selected value text when closing in single selection mode
                if (!multiple && selectedOptions.length > 0) {
                    setFilterText(selectedOptions[0].label);
                } else if (multiple && searchable) {
                    setFilterText('');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [allowCustomValue, filterText, isOpen, multiple, name, onChange, options, searchable, selectedOptions, usePortal]);

    const handleOptionClick = (option: DropdownOption) => {
        if (multiple) {
            const isSelected = selectedOptions.some(selected => selected.value === option.value);
            let newSelection: DropdownOption[];

            if (isSelected) {
                newSelection = selectedOptions.filter(selected => selected.value !== option.value);
            } else {
                newSelection = [...selectedOptions, option];
            }

            setSelectedOptions(newSelection);

            if (searchable) {
                setFilterText(''); // Clear filter after selection in multiple mode
            }

            if (onChange) {
                onChange(newSelection, name);
            }
        } else {
            if (searchable) {
                setFilterText(option.label);
            } else {
                setFilterText(option.label);
            }
            setSelectedOptions([option]);
            setIsOpen(false);

            if (onChange) {
                onChange(option, name);
            }
        }
    };

    const handleCreateCustomValue = () => {
        if (!allowCustomValue || !filterText.trim()) return;

        // Check if custom value already exists
        const existingOption = options.find(option => option.label.toLowerCase() === filterText.toLowerCase() || option.value.toString() === filterText);

        if (existingOption) {
            handleOptionClick(existingOption);
            return;
        }

        // Create new custom option
        const customOption: DropdownOption = {
            label: filterText.trim(),
            value: filterText.trim(),
            className: 'custom-option',
        };

        if (multiple) {
            const newSelection = [...selectedOptions, customOption];
            setSelectedOptions(newSelection);
            setFilterText('');

            if (onChange) {
                onChange(newSelection, name);
            }
        } else {
            setSelectedOptions([customOption]);
            setFilterText(customOption.label);
            setIsOpen(false);

            if (onChange) {
                onChange(customOption, name);
            }
        }
    };

    const handleRemoveSelectedOption = (optionToRemove: DropdownOption) => {
        const newSelection = selectedOptions.filter(selected => selected.value !== optionToRemove.value);
        setSelectedOptions(newSelection);

        if (onChange) {
            if (multiple) {
                onChange(newSelection, name);
            } else {
                onChange(null, name);
                if (!searchable) {
                    setFilterText('');
                }
            }
        }
    };

    const handleClear = () => {
        setSelectedOptions([]);
        if (!searchable || !multiple) {
            setFilterText('');
        }
        setIsOpen(false);

        if (onChange) {
            onChange(multiple ? [] : null, name);
        }
    };

    const handleInputChange = (inputValue: string) => {
        setFilterText(inputValue);

        if (!isOpen) {
            setIsOpen(true);
        }

        onSearchChange?.(inputValue);
    };

    const handleInputClick = () => {
        if (disabled) return;

        setIsOpen(true);

        // Clear filter text in single-select mode to show all options (only when a value is already selected)
        if (!multiple && searchable && selectedOptions.length > 0) {
            setFilterText('');
        }

        if (multiple || searchable) {
            inputRef.current?.focus();
        }
    };

    const toggleDropdown = () => {
        if (disabled) return;

        setIsOpen(!isOpen);

        if (!isOpen) {
            setFocusedIndex(-1);

            // Clear filter text in single-select mode to show all options (only when a value is already selected)
            if (!multiple && searchable && selectedOptions.length > 0) {
                setFilterText('');
            }

            if (multiple || searchable) {
                inputRef.current?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true);
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (allowCustomValue && filterText && filteredOptions.length === 0) {
                    // No options to navigate to
                    return;
                }
                setFocusedIndex(prevIndex => {
                    const maxIndex =
                        allowCustomValue && filterText && !filteredOptions.some(o => o.label.toLowerCase() === filterText.toLowerCase())
                            ? filteredOptions.length
                            : filteredOptions.length - 1;

                    const newIndex = prevIndex < maxIndex ? prevIndex + 1 : 0;
                    if (newIndex < filteredOptions.length && optionsRef.current[newIndex]) {
                        optionsRef.current[newIndex]?.scrollIntoView({ block: 'nearest' });
                    }
                    return newIndex;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (allowCustomValue && filterText && filteredOptions.length === 0) {
                    return;
                }
                setFocusedIndex(prevIndex => {
                    const maxIndex =
                        allowCustomValue && filterText && !filteredOptions.some(o => o.label.toLowerCase() === filterText.toLowerCase())
                            ? filteredOptions.length
                            : filteredOptions.length - 1;

                    const newIndex = prevIndex > 0 ? prevIndex - 1 : maxIndex;
                    if (newIndex < filteredOptions.length && optionsRef.current[newIndex]) {
                        optionsRef.current[newIndex]?.scrollIntoView({ block: 'nearest' });
                    }
                    return newIndex;
                });
                break;
            case 'Enter':
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
                    handleOptionClick(filteredOptions[focusedIndex]);
                } else if (allowCustomValue && filterText && focusedIndex === filteredOptions.length) {
                    // Focus is on "Create custom value" option
                    handleCreateCustomValue();
                } else if (allowCustomValue && filterText && filteredOptions.length === 0) {
                    // No options available, create custom value
                    handleCreateCustomValue();
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);

                // Restore the selected value text when closing in single selection mode
                if (!multiple && selectedOptions.length > 0) {
                    setFilterText(selectedOptions[0].label);
                } else if (multiple && searchable) {
                    setFilterText('');
                }
                break;
            case 'Backspace':
                if (multiple && filterText === '' && selectedOptions.length > 0) {
                    e.preventDefault();
                    handleRemoveSelectedOption(selectedOptions[selectedOptions.length - 1]);
                }
                break;
            default:
                break;
        }
    };

    const isOptionSelected = (option: DropdownOption): boolean => {
        return selectedOptions.some(selected => selected.value === option.value);
    };

    const getMultiSelectDisplayText = (): string => {
        if (selectedOptions.length === 0) {
            return '';
        }

        const firstLabel = selectedOptions[0].label;

        if (selectedOptions.length === 1) {
            return firstLabel;
        }

        if (selectedOptions.length === 2) {
            return `${firstLabel} (+1 other)`;
        }

        return `${firstLabel} (+${selectedOptions.length - 1} others)`;
    };

    const getDisplayText = (): string => {
        if (searchable) {
            // If actively typing/filtering, show the filter text
            if (filterText) {
                return filterText;
            }
            // If not typing, show the selected value
            if (selectedOptions.length > 0) {
                if (multiple) {
                    return getMultiSelectDisplayText();
                }
                return selectedOptions[0].label;
            }
            return '';
        }

        // For non-searchable, show selected option(s)
        if (selectedOptions.length > 0) {
            if (multiple) {
                return getMultiSelectDisplayText();
            }
            return selectedOptions[0].label;
        }

        return '';
    };

    const getPlaceholderText = (): string => {
        if (selectedOptions.length > 0) {
            return '';
        }
        return placeholder;
    };

    const renderSelectedCount = () => {
        if (!multiple || selectedOptions.length === 0 || selectedCountDisplay === 'none') {
            return null;
        }

        if (selectedCountDisplay === 'floating') {
            return <div className="dropdown-selected-count">{selectedOptions.length} selected</div>;
        }

        return null;
    };

    const shouldShowCreateOption = (): boolean => {
        return !!(
            allowCustomValue &&
            filterText &&
            filterText.trim() &&
            !filteredOptions.some(option => option.label.toLowerCase() === filterText.toLowerCase() || option.value.toString() === filterText)
        );
    };

    const renderDropdownMenu = () => {
        if (!isOpen || disabled) return null;

        const menuContent = (
            <div
                ref={menuRef}
                className={`dropdown-menu ${usePortal ? 'dropdown-menu--portal' : ''} ${shouldOpenUpward ? 'dropdown-menu--upward' : ''}`}
                style={
                    usePortal
                        ? {
                              position: 'absolute',
                              top: shouldOpenUpward ? 'auto' : `${portalPosition.top}px`,
                              bottom: shouldOpenUpward ? `${window.innerHeight - portalPosition.top}px` : 'auto',
                              left: `${portalPosition.left}px`,
                              width: `${portalPosition.width}px`,
                              zIndex: 9999,
                          }
                        : undefined
                }
            >
                {filteredOptions.length > 0 || shouldShowCreateOption() ? (
                    <ul className="dropdown-options-list">
                        {filteredOptions.map((option, index) => (
                            <li
                                key={`dd-option-${uid}-${index}`}
                                ref={el => {
                                    optionsRef.current[index] = el;
                                }}
                                className={`dropdown-option ${option.className || ''} ${focusedIndex === index ? 'focused' : ''} ${isOptionSelected(option) ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(option)}
                                onMouseEnter={() => setFocusedIndex(index)}
                            >
                                {multiple && (
                                    <div className="dropdown-option-checkbox">
                                        <div className={`checkbox ${isOptionSelected(option) ? 'checked' : ''}`}>
                                            {isOptionSelected(option) && (
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                    <path
                                                        d="M9 1L3.5 6.5L1 4"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="dropdown-option-content">
                                    <span className="dropdown-option-label">
                                        {option.icon && <Icon name={option.icon} />}
                                        <span>{option.label}</span>
                                        {option.suffixIcon && <Icon name={option.suffixIcon} />}
                                    </span>
                                    {option.details && <span className="dropdown-option-details">{option.details}</span>}
                                </div>
                            </li>
                        ))}

                        {shouldShowCreateOption() && (
                            <li
                                ref={el => {
                                    optionsRef.current[filteredOptions.length] = el;
                                }}
                                className={`dropdown-option dropdown-option--create ${focusedIndex === filteredOptions.length ? 'focused' : ''}`}
                                onClick={handleCreateCustomValue}
                                onMouseEnter={() => setFocusedIndex(filteredOptions.length)}
                            >
                                <div className="dropdown-option-content">
                                    <span className="dropdown-option-label">
                                        <Icon name="plus" />
                                        <span>Create &ldquo;{filterText}&rdquo;</span>
                                    </span>
                                </div>
                            </li>
                        )}
                    </ul>
                ) : (
                    <div className="dropdown-no-options">No options found</div>
                )}
            </div>
        );

        if (usePortal) {
            return createPortal(menuContent, document.body);
        }

        return menuContent;
    };

    const selectedSingleOption = !multiple && selectedOptions.length === 1 ? selectedOptions[0] : null;
    const showValueChip = valueAsChip && !isOpen && !multiple && selectedOptions.length > 0;
    const showSelectedPrefixIcon = Boolean(selectedSingleOption?.icon && !filterText && !showValueChip);
    const showSelectedSuffixIcon = Boolean(selectedSingleOption?.suffixIcon && !showValueChip);

    return (
        <div
            className={`dropdown-container ${error ? 'dropdown-error' : ''} ${success ? 'dropdown-success' : ''} ${highlighted ? 'dropdown-highlighted' : ''} ${multiple ? 'multiple' : ''} ${disabled ? 'disabled' : ''} ${multiple ? `count-display-${selectedCountDisplay}` : ''} ${className}`}
            ref={dropdownRef}
        >
            {label && (
                <label htmlFor={inputId} className="dropdown-label">
                    {label}
                </label>
            )}

            <div
                className={`dropdown-input-container ${showSelectedPrefixIcon ? 'dropdown-input-container--has-prefix-icon' : ''} ${showSelectedSuffixIcon ? 'dropdown-input-container--has-suffix-icon' : ''}`}
            >
                {showSelectedPrefixIcon && selectedSingleOption?.icon && (
                    <span className="dropdown-selected-icon dropdown-selected-icon--prefix">
                        <Icon name={selectedSingleOption.icon} />
                    </span>
                )}

                {showValueChip && selectedSingleOption && (
                    <span className="dropdown-value-chip" onClick={handleInputClick}>
                        {selectedSingleOption.icon && <Icon name={selectedSingleOption.icon} />}
                        <span className="dropdown-value-chip__label">{selectedSingleOption.label}</span>
                    </span>
                )}

                <InputText
                    ref={inputRef}
                    id={inputId}
                    placeholder={showValueChip ? '' : getPlaceholderText()}
                    value={showValueChip ? '' : getDisplayText()}
                    onChange={searchable || multiple ? handleInputChange : () => {}}
                    onClick={handleInputClick}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoFocus={autofocus}
                    disabled={disabled}
                />

                <div className="dropdown-actions-buttons">
                    {showSelectedSuffixIcon && selectedSingleOption?.suffixIcon && (
                        <span className="dropdown-selected-icon dropdown-selected-icon--suffix">
                            <Icon name={selectedSingleOption.suffixIcon} />
                        </span>
                    )}

                    {((!multiple && selectedOptions.length > 0) || (multiple && selectedOptions.length > 0)) && (
                        <span className="dropdown-action-button dropdown-clear-button">
                            <Button variant="plain" onClick={handleClear} disabled={disabled}>
                                {clear}
                            </Button>
                        </span>
                    )}

                    <span className={`dropdown-action-button dropdown-toggle-button ${isOpen ? 'open' : ''}`}>
                        <Button variant="plain" onClick={toggleDropdown} disabled={disabled}>
                            {caretDown}
                        </Button>
                    </span>
                </div>

                {renderSelectedCount()}
            </div>

            {renderDropdownMenu()}

            {error && <span className="dropdown-error-message">{error}</span>}
            {success && <span className="dropdown-success-message">{success}</span>}
        </div>
    );
};
