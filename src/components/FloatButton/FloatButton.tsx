import { FC, useState } from 'react';

import './FloatButton.scss';

export interface FloatButtonAction {
    label: string;
    icon: string;
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
                <button className="float-button" onClick={actions[0].onClick} aria-label={actions[0].label} title={actions[0].label}>
                    <span className="float-button__icon">{actions[0].icon}</span>
                </button>
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
                            <button key={index} className="float-button-menu__item" onClick={() => handleActionClick(action)} title={action.label}>
                                <span className="float-button-menu__icon">{action.icon}</span>
                                <span className="float-button-menu__label">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}

            <button className={`float-button ${isMenuOpen ? 'float-button--active' : ''}`} onClick={toggleMenu} aria-label="Actions menu" title="Actions">
                <span className="float-button__icon">{isMenuOpen ? '✖' : '+'}</span>
            </button>
        </div>
    );
};
