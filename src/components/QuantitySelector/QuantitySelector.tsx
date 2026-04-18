import { forwardRef } from 'react';

import { Button } from '../Button/Button';
import { InputNumber } from '../InputNumber/InputNumber';

import './QuantitySelector.scss';

export interface QuantitySelectorProps {
    disabled?: boolean;
    error?: string;
    id?: string;
    inputWidth?: number;
    label?: string;
    max?: number;
    min?: number;
    onChange?: (value: number | undefined) => void;
    readOnlyInput?: boolean;
    required?: boolean;
    step?: number;
    success?: string;
    value?: number;
}

export const QuantitySelector = forwardRef<HTMLInputElement, QuantitySelectorProps>(
    ({ disabled = false, error, id, inputWidth, label, max, min = 0, onChange, readOnlyInput = false, required = false, step = 1, success, value }, ref) => {
        // Calculate input width based on max value or use provided width
        const calculateInputWidth = () => {
            if (inputWidth) return inputWidth;
            if (max !== undefined) {
                const digits = Math.max(String(max).length, String(min).length, 3);
                return digits;
            }
            return 3; // Default to 3 digits
        };

        const digits = calculateInputWidth();
        const handleDecrease = () => {
            if (disabled) return;

            const currentValue = value ?? 0;
            const newValue = currentValue - step;

            if (min !== undefined && newValue < min) {
                return;
            }

            onChange?.(newValue);
        };

        const handleIncrease = () => {
            if (disabled) return;

            const currentValue = value ?? 0;
            const newValue = currentValue + step;

            if (max !== undefined && newValue > max) {
                return;
            }

            onChange?.(newValue);
        };

        const handleInputChange = (newValue: number | undefined) => {
            if (readOnlyInput) return;

            if (newValue === undefined) {
                onChange?.(undefined);
                return;
            }

            if (min !== undefined && newValue < min) {
                onChange?.(min);
                return;
            }

            if (max !== undefined && newValue > max) {
                onChange?.(max);
                return;
            }

            onChange?.(newValue);
        };

        const isDecreaseDisabled = disabled || (min !== undefined && (value ?? 0) <= min);
        const isIncreaseDisabled = disabled || (max !== undefined && (value ?? 0) >= max);

        return (
            <div className="quantity-selector-wrapper">
                {label && (
                    <label htmlFor={id} className="quantity-selector-label">
                        {label}
                        {required && <span className="quantity-selector-required">*</span>}
                    </label>
                )}
                <div
                    className={`quantity-selector${readOnlyInput ? ' quantity-selector-readonly' : ''}${error ? ' quantity-selector-error' : ''}${success ? ' quantity-selector-success' : ''}`}
                    style={{ '--digits': digits } as React.CSSProperties}
                >
                    <Button
                        className="quantity-selector-button quantity-selector-button-decrease"
                        disabled={isDecreaseDisabled}
                        onClick={handleDecrease}
                        size="small"
                        variant="default"
                        type="button"
                    >
                        −
                    </Button>
                    <div className="quantity-selector-input">
                        <InputNumber
                            disabled={disabled}
                            id={id}
                            max={max}
                            min={min}
                            onChange={handleInputChange}
                            ref={ref}
                            step={step}
                            value={value}
                        />
                    </div>
                    <Button
                        className="quantity-selector-button quantity-selector-button-increase"
                        disabled={isIncreaseDisabled}
                        onClick={handleIncrease}
                        size="small"
                        variant="default"
                        type="button"
                    >
                        +
                    </Button>
                </div>
                {error && <span className="quantity-selector-error-message">{error}</span>}
                {success && <span className="quantity-selector-success-message">{success}</span>}
            </div>
        );
    }
);
