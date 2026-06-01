import { FC, ReactNode } from 'react';

import { Button, ButtonVariant } from '../Button';
import { Icon, IconName } from '../Icon';
import { Popover } from '../Popover';

import './ConfirmPopover.scss';

export interface ConfirmPopoverButton {
    text?: string;
    icon?: IconName;
    variant?: ButtonVariant;
    onClick?: () => void;
}

export interface ConfirmPopoverProps {
    visible: boolean;
    onClose: () => void;
    anchorEl: HTMLElement | null;
    title?: ReactNode;
    message?: ReactNode;
    icon?: IconName;
    confirm: ConfirmPopoverButton & { onClick: () => void };
    cancel?: ConfirmPopoverButton;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    offset?: number;
}

export const ConfirmPopover: FC<ConfirmPopoverProps> = ({
    visible,
    onClose,
    anchorEl,
    title,
    message,
    icon,
    confirm,
    cancel,
    placement = 'auto',
    offset,
}) => {
    const handleConfirm = () => {
        confirm.onClick();
        onClose();
    };
    const handleCancel = () => {
        cancel?.onClick?.();
        onClose();
    };

    return (
        <Popover
            visible={visible}
            onClose={onClose}
            anchorEl={anchorEl}
            placement={placement}
            {...(offset !== undefined ? { offset } : {})}
        >
            <div className="confirm-popover">
                {(title || icon) && (
                    <div className="confirm-popover__header">
                        {icon && <Icon name={icon} />}
                        {title && <span className="confirm-popover__title">{title}</span>}
                    </div>
                )}
                {message && <div className="confirm-popover__message">{message}</div>}
                <div className="confirm-popover__actions">
                    <Button
                        size="small"
                        variant={cancel?.variant ?? 'default'}
                        icon={cancel?.icon}
                        onClick={handleCancel}
                    >
                        {cancel?.text ?? 'Cancel'}
                    </Button>
                    <Button
                        size="small"
                        variant={confirm.variant ?? 'info'}
                        icon={confirm.icon}
                        onClick={handleConfirm}
                    >
                        {confirm.text ?? 'Confirm'}
                    </Button>
                </div>
            </div>
        </Popover>
    );
};
