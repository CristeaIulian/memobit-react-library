import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '../Button';
import { InputText } from '../InputText';
import { clearIcon, removeIcon, verticalCaret } from './icons';

import './Dropdown.scss';

export interface DropdownOption {
    className?: string;
    details?: React.ReactNode;
    label: string;
    value: string | number;
}

export interface DropdownProps {
    allowCustomValue?: boolean;
    autofocus?: boolean;
    className?: string;
    disabled?: boolean;
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
    usePortal?: boolean;
    value?: number | number[] | string | string[] | null;
}

export const Dropdown: React.FC<DropdownProps> = ({
    allowCustomValue = false,
    autofocus = false,
    className = '',
    disabled = false,
    id = 'dropdown',
    label,
    multiple = false,
    name,
    onChange,
    onSearchChange,
    options,
    placeholder = 'Select an option',
    searchable = false,
    searchValue,
    usePortal = false,
    value,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filterText, setFilterText] = useState<string>(searchValue || '');
    const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>(options);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const [selectedOptions, setSelectedOptions] = useState<DropdownOption[]>([]);
    const [portalPosition, setPortalPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<(HTMLLIElement | null)[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

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

    // Handle controlled component behavior with value prop
    useEffect(() => {
        // Handle reset scenarios
        if (value === null || value === undefined) {
            setSelectedOptions([]);
            setFilterText('');
            return;
        }

        // Handle empty array for multiple selection reset
        if (multiple && Array.isArray(value) && value.length === 0) {
            setSelectedOptions([]);
            setFilterText('');
            return;
        }

        // Handle empty string for single selection reset
        if (!multiple && value === '') {
            setSelectedOptions([]);
            setFilterText('');
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
                // Clear filterText for multiple mode (chips are shown instead)
                setFilterText('');
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
                    // Set filterText for both searchable and non-searchable to show the selected value
                    setFilterText(selectedOption.label);
                } else {
                    // If value doesn't match any option, clear selection
                    setSelectedOptions([]);
                    setFilterText('');
                }
            }
        } else {
            // If no options available yet, clear the display
            setSelectedOptions([]);
            setFilterText('');
        }
    }, [value, options, multiple, searchable]);

    // Sync external searchValue with internal filterText
    useEffect(() => {
        if (searchable && searchValue !== undefined) {
            setFilterText(searchValue);
        }
    }, [searchValue, searchable]);

    // Update portal position when dropdown opens or on scroll/resize
    useEffect(() => {
        if (!usePortal || !isOpen || !dropdownRef.current) return;

        const updatePosition = () => {
            if (dropdownRef.current) {
                const rect = dropdownRef.current.getBoundingClientRect();
                setPortalPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        };

        updatePosition();

        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [usePortal, isOpen]);

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
                setIsOpen(false);
                if (multiple && searchable) {
                    setFilterText('');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [multiple, searchable, usePortal, isOpen]);

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

        if (multiple || searchable) {
            inputRef.current?.focus();
        }
    };

    const toggleDropdown = () => {
        if (disabled) return;

        setIsOpen(!isOpen);

        if (!isOpen) {
            setFocusedIndex(-1);
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

                // Restore the selected value text when closing (for non-searchable single selection)
                if (!multiple && !searchable && selectedOptions.length > 0) {
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

    const getDisplayText = (): string => {
        if (searchable) {
            // If actively typing/filtering, show the filter text
            if (filterText) {
                return filterText;
            }
            // If not typing, show the selected value for single selection
            if (!multiple && selectedOptions.length > 0) {
                return selectedOptions[0].label;
            }
            return '';
        }

        // For non-searchable single selection, show selected option
        if (!multiple && selectedOptions.length > 0) {
            return selectedOptions[0].label;
        }

        return '';
    };

    const getPlaceholderText = (): string => {
        if (multiple && selectedOptions.length > 0) {
            return `${selectedOptions.length} selected`;
        }
        return placeholder;
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
                className={`dropdown-menu ${usePortal ? 'dropdown-menu--portal' : ''}`}
                style={
                    usePortal
                        ? {
                              position: 'absolute',
                              top: `${portalPosition.top}px`,
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
                                key={option.value}
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
                                    {option.label}
                                    {option.details && <span className="dropdown-option-details">{option.details}</span>}
                                </div>
                            </li>
                        ))}

                        {shouldShowCreateOption() && (
                            <li
                                ref={el => {
                                    optionsRef.current[filteredOptions.length] = el;
                                }}
                                className={`dropdown-option ${focusedIndex === filteredOptions.length ? 'focused' : ''}`}
                                onClick={handleCreateCustomValue}
                                onMouseEnter={() => setFocusedIndex(filteredOptions.length)}
                            >
                                <div className="dropdown-option-content">
                                    <span>Create "{filterText}"</span>
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

    return (
        <div className={`dropdown-container ${multiple ? 'multiple' : ''} ${disabled ? 'disabled' : ''} ${className}`} ref={dropdownRef}>
            {label && (
                <label htmlFor={id} className="dropdown-label">
                    {label}
                </label>
            )}

            <div className="dropdown-input-container">
                {multiple && selectedOptions.length > 0 && (
                    <div className="dropdown-selected-items">
                        {selectedOptions.slice(0, 5).map(option => (
                            <div key={option.value} className="dropdown-selected-item">
                                <span className="dropdown-selected-item-label">{option.label}</span>
                                <span className="dropdown-selected-item-clear">
                                    <Button variant="plain" onClick={() => handleRemoveSelectedOption(option)} disabled={disabled}>
                                        {removeIcon}
                                    </Button>
                                </span>
                            </div>
                        ))}
                        {selectedOptions.length > 5 && <div className="dropdown-more-indicator">+{selectedOptions.length - 5} more</div>}
                    </div>
                )}

                <InputText
                    ref={inputRef}
                    id={id}
                    placeholder={getPlaceholderText()}
                    value={getDisplayText()}
                    onChange={searchable || multiple ? handleInputChange : () => {}}
                    onClick={handleInputClick}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoFocus={autofocus}
                    disabled={disabled}
                />

                {((!multiple && selectedOptions.length > 0) || (multiple && selectedOptions.length > 0)) && (
                    <span className="dropdown-action-button dropdown-clear-button">
                        <Button variant="plain" onClick={handleClear} disabled={disabled}>
                            {clearIcon}
                        </Button>
                    </span>
                )}

                <span className={`dropdown-action-button dropdown-toggle-button ${isOpen ? 'open' : ''}`}>
                    <Button variant="plain" onClick={toggleDropdown} disabled={disabled}>
                        {verticalCaret}
                    </Button>
                </span>
            </div>

            {renderDropdownMenu()}
        </div>
    );
};
