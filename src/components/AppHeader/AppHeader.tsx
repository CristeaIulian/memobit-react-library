import React, { ReactNode } from 'react';

import { Icon, IconName } from '../Icon';
import { Separator } from '../Separator';

import './AppHeader.scss';

export interface AppHeaderProps {
    icon?: IconName;
    emoji?: string;
    svg?: ReactNode;
    appName?: string;
    heading?: string;
    onClick?: () => void;
    className?: string;
    showSeparator?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ emoji, icon, svg, appName, heading, onClick, className = '', showSeparator = true }) => {
    const headerClassName = ['app-header', onClick ? 'app-header--clickable' : '', className].filter(Boolean).join(' ');

    return (
        <>
            <div className={headerClassName} onClick={onClick}>
                {emoji && <span className="app-header__icon">{emoji}</span>}
                {svg && <span className="app-header__icon">{svg}</span>}
                {icon && (
                    <span className="app-header__icon">
                        <Icon name={icon} />
                    </span>
                )}
                <div className="app-header__copy">
                    {appName && <span className="app-header__app-name">{appName}</span>}
                    {heading && <span className="app-header__headline">{heading}</span>}
                </div>
            </div>
            {showSeparator && <Separator className="app-header__separator" spacing={0} />}
        </>
    );
};
