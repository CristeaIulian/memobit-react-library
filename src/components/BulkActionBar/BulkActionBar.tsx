import React, { type ReactNode } from 'react';

import { Button, type ButtonVariant } from '../Button';
import { type IconName } from '../Icon';

import './BulkActionBar.scss';

export interface BulkAction {
    key: string;
    label: string;
    icon?: IconName;
    variant?: ButtonVariant;
    disabled?: boolean;
    title?: string;
    onClick: () => void | Promise<void>;
}

export interface BulkActionBarProgress {
    done: number;
    total: number;
    label?: string;
}

export interface BulkActionBarProps {
    selectionCount: number;
    visible?: boolean;
    label?: ReactNode;
    progress?: BulkActionBarProgress;
    actions: BulkAction[];
    onClear?: () => void;
    clearLabel?: string;
    position?: 'top' | 'bottom';
    className?: string;
}

const formatProgress = (progress: BulkActionBarProgress): string => {
    if (progress.label) return `${progress.label} ${progress.done}/${progress.total}`;
    return `Running ${progress.done}/${progress.total}`;
};

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
    selectionCount,
    visible,
    label,
    progress,
    actions,
    onClear,
    clearLabel = 'Clear',
    position = 'bottom',
    className,
}) => {
    const shouldRender = visible ?? selectionCount > 0;
    if (!shouldRender) return null;

    const rootClassName = ['memobit-bulk-action-bar', `memobit-bulk-action-bar--${position}`, className].filter(Boolean).join(' ');

    const displayLabel: ReactNode = progress ? formatProgress(progress) : label ?? `${selectionCount} selected`;

    return (
        <div className={rootClassName}>
            <div className="memobit-bulk-action-bar__label">{displayLabel}</div>
            <div className="memobit-bulk-action-bar__actions">
                {actions.map(action => (
                    <Button
                        key={action.key}
                        disabled={action.disabled}
                        icon={action.icon}
                        onClick={() => void action.onClick()}
                        size="medium"
                        title={action.title}
                        variant={action.variant ?? 'default'}
                    >
                        {action.label}
                    </Button>
                ))}
                {onClear && (
                    <Button disabled={progress !== undefined} icon="clear" onClick={onClear} size="medium" variant="ghost">
                        {clearLabel}
                    </Button>
                )}
            </div>
        </div>
    );
};
