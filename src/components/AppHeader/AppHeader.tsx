import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { Separator } from '../Separator';

import './AppHeader.scss';

export interface AppHeaderProps {
    icon?: ReactNode;
    appName?: string;
    headline?: string;
    onClick?: () => void;
    className?: string;
    showSeparator?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ icon, appName, headline, onClick, className = '', showSeparator = true }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
        onClick?.();
    };

    const headerClassName = ['app-header', 'app-header--clickable', className].filter(Boolean).join(' ');

    return (
        <>
            <div className={headerClassName} onClick={handleClick}>
                {icon && <span className="app-header__icon">{icon}</span>}
                <div className="app-header__copy">
                    {appName && <span className="app-header__app-name">{appName}</span>}
                    {headline && <span className="app-header__headline">{headline}</span>}
                </div>
            </div>
            {showSeparator && <Separator className="app-header__separator" spacing={0} />}
        </>
    );
};
