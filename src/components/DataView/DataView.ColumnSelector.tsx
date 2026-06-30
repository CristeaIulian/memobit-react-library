import { useRef, useState } from 'react';

import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { Popover } from '../Popover';

import type { DataViewColumnSelectorConfig } from './DataView.types';

interface DataViewColumnSelectorProps {
    config: DataViewColumnSelectorConfig;
}

export function DataViewColumnSelector({ config }: DataViewColumnSelectorProps) {
    const { options, selectedKeys, onChange, label = 'Columns' } = config;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [visible, setVisible] = useState(false);

    if (options.length === 0) return null;

    const toggleKey = (key: string, checked: boolean) => {
        if (checked) {
            if (selectedKeys.includes(key)) return;
            onChange([...selectedKeys, key]);
        } else {
            onChange(selectedKeys.filter(k => k !== key));
        }
    };

    return (
        <div className="data-view__column-selector">
            <Button ref={buttonRef} variant="ghost" size="small" icon="table" onClick={() => setVisible(v => !v)}>
                <span className="data-view__column-selector-label">
                    {label}
                    <Icon name="caret-down" size="sm" />
                </span>
            </Button>
            <Popover visible={visible} onClose={() => setVisible(false)} anchorEl={buttonRef.current} placement="bottom">
                <div className="data-view__column-selector-list">
                    {options.map(option => {
                        const isChecked = selectedKeys.includes(option.key);
                        return (
                            <label key={option.key} className="data-view__column-selector-item">
                                <Checkbox checked={isChecked} onChange={checked => toggleKey(option.key, checked)} />
                                <span>{option.label}</span>
                            </label>
                        );
                    })}
                </div>
            </Popover>
        </div>
    );
}
