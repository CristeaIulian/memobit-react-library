import { FC } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Button } from '../Button';

import './ToggleButtons.scss';

interface ToggleProps {
    onToggleChange: (mode: string) => void;
    state: string;
    states: {
        label: string;
        key: string;
        icon: string;
    }[];
}

export const ToggleButtons: FC<ToggleProps> = ({ state, onToggleChange, states }: ToggleProps) => {
    const { isAtLeast } = useBreakpoint();

    return (
        <div className="toggle-buttons">
            {states.map((s, index) => (
                <Button
                    key={`btn-toggle2-${index}-${s}`}
                    variant={state === s.key ? 'warning' : 'default'}
                    prefixIcon={s.icon}
                    onClick={() => onToggleChange(s.key)}
                >
                    {isAtLeast('tablet') ? s.label : ''}
                </Button>
            ))}
        </div>
    );
};
