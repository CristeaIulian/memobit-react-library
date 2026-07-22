import { FC, useState } from 'react';

import { Icon, IconName } from '../Icon';
import { Tooltip } from '../Tooltip';

import './FloatButton.scss';

export interface FloatButtonAction {
    label: string;
    icon: IconName;
    onClick: () => void;
}

interface FloatButtonProps {
    actions: FloatButtonAction[];
}

export const FloatButton: FC<FloatButtonProps> = ({ actions }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Single action - direct click
    if (actions.length === 1) {
        return (
            <div className="float-button-container">
                <Tooltip title={actions[0].label} position="left">
                    <button className="float-button" onClick={actions[0].onClick}>
                        <span className="float-button__icon">
                            <Icon name={actions[0].icon} size="xxl" />
                        </span>
                    </button>
                </Tooltip>
            </div>
        );
    }

    // Multiple actions - show menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleActionClick = (action: FloatButtonAction) => {
        action.onClick();
        setIsMenuOpen(false);
    };

    return (
        <div className="float-button-container">
            {isMenuOpen && (
                <>
                    <div className="float-button-overlay" onClick={() => setIsMenuOpen(false)} />
                    <div className="float-button-menu">
                        {actions.map((action, index) => (
                            <button key={`float-button-${index}`} className="float-button-menu__item" onClick={() => handleActionClick(action)}>
                                <span className="float-button-menu__icon">
                                    <Icon name={action.icon} />
                                </span>
                                <span className="float-button-menu__label">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}

            <Tooltip title="Actions menu">
                <button className={`float-button ${isMenuOpen ? 'float-button--active' : ''}`} onClick={toggleMenu}>
                    <span className="float-button__icon">
                        <Icon name={isMenuOpen ? 'clear' : 'plus'} size="xxl" />
                    </span>
                </button>
            </Tooltip>
        </div>
    );
};
