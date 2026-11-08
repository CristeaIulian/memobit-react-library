import { ReactElement, useState } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useMessages } from '../../hooks/useLanguage';
import { ConfirmDialog } from '../ConfirmDialog';

import { PageAction } from './PageShell.types';

interface ConfirmedActions {
    primaryAction?: PageAction;
    actions: PageAction[];
    /** The dialog that asks before a `confirm` action runs; render it once in the shell. */
    dialog: ReactElement;
}

/** The page's actions with every `confirm` action rerouted through a dialog, wherever it is drawn (button or menu). */
export const useConfirmedActions = (primaryAction: PageAction | undefined, actions: PageAction[]): ConfirmedActions => {
    const t = useMessages(libMessages);
    const [pending, setPending] = useState<PageAction | null>(null);

    const route = (action: PageAction): PageAction => (action.confirm ? { ...action, onClick: () => setPending(action) } : action);

    const dialog = (
        <ConfirmDialog
            isOpen={pending !== null}
            title={pending?.confirm?.title ?? pending?.label ?? ''}
            message={pending?.confirm?.message ?? ''}
            confirm={{
                text: pending?.confirm?.confirmLabel ?? t.confirm,
                variant: pending?.confirm?.variant ?? 'danger',
                onClick: () => {
                    pending?.onClick();
                    setPending(null);
                },
            }}
            cancel={{ text: t.cancel, onClick: () => setPending(null) }}
            usePortal
        />
    );

    return { primaryAction: primaryAction && route(primaryAction), actions: actions.map(route), dialog };
};
