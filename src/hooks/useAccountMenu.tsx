import { type ComponentType, type ReactElement, useState } from 'react';

import { ChangePasswordModal } from '../components/Auth/ChangePasswordModal';
import { WatchLinkModal } from '../components/Auth/WatchLinkModal';
import type { MenuHamburgerItem } from '../components/MenuHamburger';
import { ThemeSettings } from '../components/ThemeSettings';

import { useAuth } from './useAuth';

interface AccountMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface UseAccountMenuOptions {
    // Shown in ThemeSettings' "For <app>" recommended filter.
    appName: string;
    // Pass MfaSetupModal from '@memobit/libs/mfa' to offer two-factor setup. It is injected
    // rather than imported so the main bundle never pulls in its QR-code dependency.
    mfaModal?: ComponentType<AccountMenuModalProps>;
    // Adds "Link a watch" for apps with a Garmin watch companion. The app must route the
    // framework's watch/* endpoints (memobit-framework README, "Watch pairing").
    watchLink?: boolean;
    themeLabel?: string;
    loginPath?: string;
}

export interface UseAccountMenuReturn {
    themeItem: MenuHamburgerItem;
    // Change Password, Two-factor (when enabled) and Logout.
    accountItems: MenuHamburgerItem[];
    // themeItem followed by accountItems — what most toolbars append after their nav items.
    items: MenuHamburgerItem[];
    // The modals the items open; render once next to the toolbar.
    modals: ReactElement;
}

export const useAccountMenu = ({
    appName,
    mfaModal: MfaModal,
    watchLink = false,
    themeLabel = 'Theme',
    loginPath = '/login',
}: UseAccountMenuOptions): UseAccountMenuReturn => {
    const { user, logout } = useAuth();
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isMfaOpen, setIsMfaOpen] = useState(false);
    const [isWatchLinkOpen, setIsWatchLinkOpen] = useState(false);
    const showWatchLink = watchLink && Boolean(user);

    const handleLogout = async () => {
        await logout();
        window.location.href = loginPath;
    };

    const themeItem: MenuHamburgerItem = { label: themeLabel, icon: 'theme-picker', onClick: () => setIsThemeOpen(true), isActive: false, separator: true };

    const accountItems: MenuHamburgerItem[] = [
        { label: 'Change Password', icon: 'lock', onClick: () => setIsChangePasswordOpen(true), isActive: false },
        ...(MfaModal
            ? [{ label: 'Two-factor Authentication', icon: 'key', onClick: () => setIsMfaOpen(true), isActive: false } satisfies MenuHamburgerItem]
            : []),
        ...(showWatchLink
            ? [{ label: 'Link a watch', icon: 'link', onClick: () => setIsWatchLinkOpen(true), isActive: false } satisfies MenuHamburgerItem]
            : []),
        { label: `Logout ${user?.username ?? ''}`.trim(), icon: 'logout', onClick: handleLogout, isActive: false },
    ];

    const modals = (
        <>
            <ThemeSettings isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} currentApp={appName} />
            <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
            {MfaModal && <MfaModal isOpen={isMfaOpen} onClose={() => setIsMfaOpen(false)} />}
            {showWatchLink && <WatchLinkModal isOpen={isWatchLinkOpen} onClose={() => setIsWatchLinkOpen(false)} />}
        </>
    );

    return { themeItem, accountItems, items: [themeItem, ...accountItems], modals };
};
