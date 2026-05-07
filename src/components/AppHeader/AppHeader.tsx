import React, { ReactNode } from 'react';

import { Separator } from '../Separator';

import './AppHeader.scss';

export interface AppHeaderProps {
    icon?: ReactNode;
    appName?: string;
    heading?: string;
    onClick?: () => void;
    className?: string;
    showSeparator?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ icon, appName, heading, onClick, className = '', showSeparator = true }) => {
    const headerClassName = ['app-header', onClick ? 'app-header--clickable' : '', className].filter(Boolean).join(' ');

    return (
        <>
            <div className={headerClassName} onClick={onClick}>
                {icon && <span className="app-header__icon">{icon}</span>}
                <div className="app-header__copy">
                    {appName && <span className="app-header__app-name">{appName}</span>}
                    {heading && <span className="app-header__headline">{heading}</span>}
                </div>
            </div>
            {showSeparator && <Separator className="app-header__separator" spacing={0} />}
        </>
    );
};
