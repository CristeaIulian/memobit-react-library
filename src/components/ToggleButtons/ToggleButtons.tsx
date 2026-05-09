import { FC } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Button } from '../Button';
import { Tooltip } from '../Tooltip';

import './ToggleButtons.scss';
import { IconName } from '../Icon';

interface ToggleState {
    label: string;
    key: string;
    icon: IconName;
    description?: string;
}

interface ToggleProps {
    onToggleChange: (mode: string) => void;
    state: string;
    layout?: 'buttons' | 'cards';
    states: ToggleState[];
}

export const ToggleButtons: FC<ToggleProps> = ({ state, onToggleChange, states, layout = 'buttons' }: ToggleProps) => {
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
                            <span className="toggle-buttons__card-icon">{s.icon}</span>
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
                <Button key={`btn-toggle2-${index}-${s}`} variant={state === s.key ? 'warning' : 'default'} icon={s.icon} onClick={() => onToggleChange(s.key)}>
                    {isAtLeast('tablet') ? s.label : ''}
                </Button>
            ))}
        </div>
    );
};
