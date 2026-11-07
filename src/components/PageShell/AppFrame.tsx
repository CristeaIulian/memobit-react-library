import { FC, useMemo, useState } from 'react';

import { useAccountMenu, UseAccountMenuOptions } from '../../hooks/useAccountMenu';
import { ThemeSettings } from '../ThemeSettings';

import { AppFrameProps, AppFrameTheme } from './PageShell.types';
import { AppFrameContext } from './useAppFrame';

type PlainAppFrameProps = Omit<AppFrameProps, 'account' | 'theme'>;

const PlainAppFrame: FC<PlainAppFrameProps> = ({ app, nav, menuItems, status, children }) => {
    const value = useMemo(() => ({ app, nav, menuItems, status }), [app, nav, menuItems, status]);
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

// For apps without sign-in, which have no account menu to carry the Theme entry.
const ThemeAppFrame: FC<PlainAppFrameProps & { theme: AppFrameTheme }> = ({ theme, menuItems = [], children, ...rest }) => {
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const themeItem = { label: theme.label ?? 'Theme', icon: 'theme-picker' as const, onClick: () => setIsThemeOpen(true), isActive: false, separator: true };

    return (
        <PlainAppFrame {...rest} menuItems={[...menuItems, themeItem]}>
            {children}
            <ThemeSettings isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} currentApp={theme.appName} />
        </PlainAppFrame>
    );
};

/** Set once per app: its name, logo and app-wide menu. Every PageShell inside it shows them in the right place for the device. */
export const AppFrame: FC<AppFrameProps> = ({ account, theme, ...props }) => {
    if (account) return <AccountAppFrame account={account} {...props} />;
    if (theme) return <ThemeAppFrame theme={theme} {...props} />;
    return <PlainAppFrame {...props} />;
};
