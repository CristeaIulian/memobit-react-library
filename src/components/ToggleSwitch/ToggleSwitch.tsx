import React from 'react';

import './ToggleSwitch.scss';

export type ToggleSwitchVariant = 'plain' | 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface ToggleSwitchProps {
    checked?: boolean;
    className?: string;
    disabled?: boolean;
    offLabel?: string;
    onChange?: (checked: boolean) => void;
    onLabel?: string;
    showLabels?: boolean;
    size?: 'small' | 'medium' | 'large';
    variant?: ToggleSwitchVariant;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    checked = false,
    className,
    disabled = false,
    offLabel = 'Off',
    onChange,
    onLabel = 'On',
    showLabels = true,
    size = 'medium',
    variant = 'default',
}: ToggleSwitchProps) => {
    const handleToggle = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            handleToggle();
        }
    };

    return (
        <div
            className={`toggle-switch toggle-switch-${size} toggle-switch-${variant} ${checked ? 'toggle-switch-checked' : ''} ${disabled ? 'toggle-switch-disabled' : ''} ${className || ''}`}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            role="switch"
            aria-checked={checked}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
        >
            <div className="toggle-switch__track">
                {showLabels && (
                    <span className="toggle-switch__label">
                        {checked ? onLabel : offLabel}
                    </span>
                )}
                <div className="toggle-switch__thumb"></div>
            </div>
        </div>
    );
};
