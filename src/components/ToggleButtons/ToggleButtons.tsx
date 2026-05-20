import { FC } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Button, type ButtonVariant } from '../Button';
import { Icon, IconName } from '../Icon';
import { Tooltip } from '../Tooltip';

import './ToggleButtons.scss';

interface ToggleState {
    label: string;
    key: string;
    icon?: IconName;
    description?: string;
}

interface ToggleProps {
    activeVariant?: ButtonVariant;
    onToggleChange: (mode: string) => void;
    state: string;
    layout?: 'buttons' | 'cards';
    size?: 'small' | 'medium' | 'large';
    states: ToggleState[];
}

export const ToggleButtons: FC<ToggleProps> = ({
    activeVariant = 'warning',
    state,
    onToggleChange,
    states,
    layout = 'buttons',
    size = 'medium',
}: ToggleProps) => {
    const { isAtLeast } = useBreakpoint();

    if (layout === 'cards') {
        return (
            <div className="toggle-buttons toggle-buttons--cards">
                {states.map(s => {
                    const card = (
                        <button
                            key={s.key}
                            type="button"
                            className={`toggle-buttons__card${state === s.key ? ' toggle-buttons__card--active' : ''}`}
                            onClick={() => onToggleChange(s.key)}
                        >
                            {s.icon && (
                                <span className="toggle-buttons__card-icon">
                                    <Icon name={s.icon} size="xl" />
                                </span>
                            )}
                            <span className="toggle-buttons__card-label">{s.label}</span>
                        </button>
                    );

                    return s.description ? (
                        <Tooltip key={s.key} title={s.description}>
                            {card}
                        </Tooltip>
                    ) : (
                        card
                    );
                })}
            </div>
        );
    }

    return (
        <div className="toggle-buttons">
            {states.map((s, index) => (
                <Button
                    key={`btn-toggle2-${index}-${s}`}
                    size={size}
                    variant={state === s.key ? activeVariant : 'default'}
                    icon={s.icon}
                    onClick={() => onToggleChange(s.key)}
                >
                    {isAtLeast('tablet') ? s.label : ''}
                </Button>
            ))}
        </div>
    );
};
