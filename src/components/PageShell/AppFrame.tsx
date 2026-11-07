import { FC, useMemo } from 'react';

import { useAccountMenu, UseAccountMenuOptions } from '../../hooks/useAccountMenu';

import { AppFrameProps } from './PageShell.types';
import { AppFrameContext } from './useAppFrame';

type PlainAppFrameProps = Omit<AppFrameProps, 'account'>;

const PlainAppFrame: FC<PlainAppFrameProps> = ({ app, nav, menuItems, children }) => {
    const value = useMemo(() => ({ app, nav, menuItems }), [app, nav, menuItems]);
    return <AppFrameContext.Provider value={value}>{children}</AppFrameContext.Provider>;
};

// A separate component so the account hook runs only for apps that ask for the account menu.
const AccountAppFrame: FC<PlainAppFrameProps & { account: UseAccountMenuOptions }> = ({ account, menuItems = [], children, ...rest }) => {
    const accountMenu = useAccountMenu(account);
    return (
        <PlainAppFrame {...rest} menuItems={[...menuItems, ...accountMenu.items]}>
            {children}
            {accountMenu.modals}
        </PlainAppFrame>
    );
};

/** Set once per app: its name, logo and app-wide menu. Every PageShell inside it shows them in the right place for the device. */
export const AppFrame: FC<AppFrameProps> = ({ account, ...props }) =>
    account ? <AccountAppFrame account={account} {...props} /> : <PlainAppFrame {...props} />;
