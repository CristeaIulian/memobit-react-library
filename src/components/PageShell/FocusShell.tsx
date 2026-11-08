import { FC } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useMessages } from '../../hooks/useLanguage';

import { getButtonActions, getMenuItems, navToMenuItems } from './menuItems';
import { ActionButton, AppMark, PageMenu, PageTabsRow } from './PageParts';
import { PageShellProps } from './PageShell.types';
import { getHeadingText } from './shellText';
import { useAppFrame } from './useAppFrame';
import { useConfirmedActions } from './useConfirmedActions';

/**
 * Focus: the whole screen for one task (a running quiz, an editor). A slim top bar holds the logo, the title, the
 * actions and the menu; the app's sections move into the menu, and search, sort and filters are not offered.
 */
export const FocusShell: FC<PageShellProps> = props => {
    const { title, tabs, footer, children } = props;
    const { isMobile } = useBreakpoint();
    const t = useMessages(libMessages);
    const frame = useAppFrame();
    const { primaryAction, actions, dialog } = useConfirmedActions(props.primaryAction, props.actions ?? []);
    const heading = getHeadingText(props, t);
    const menuItems = [...navToMenuItems(frame?.nav ?? []), ...getMenuItems(actions, frame?.menuItems ?? [], isMobile)];

    return (
        <div className={['page-shell', 'page-shell--focus', isMobile ? 'page-shell--phone' : 'page-shell--desktop'].join(' ')}>
            <div className="page-shell__main">
                <header className="page-shell__toolbar">
                    {frame && <AppMark app={frame.app} logoOnly />}
                    <div className="page-shell__titles">
                        <h1 className="page-shell__title">{title}</h1>
                        {heading && <p className="page-shell__heading">{heading}</p>}
                    </div>
                    <span className="page-shell__spacer" />
                    {!isMobile && getButtonActions(actions).map(action => <ActionButton key={action.id} action={action} />)}
                    {primaryAction && <ActionButton action={primaryAction} />}
                    {props.status ?? frame?.status}
                    <PageMenu items={menuItems} />
                </header>

                <PageTabsRow tabs={tabs} />

                <div className="page-shell__content">{children}</div>

                {footer && <div className="page-shell__footer">{footer}</div>}
            </div>
            {dialog}
        </div>
    );
};
