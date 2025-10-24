import React from 'react';

import './InformationTooltip.scss';

interface InformationTooltipProps {
    direction?: 'right' | 'left';
    title: string;
}

export const InformationTooltip = ({ direction = 'right', title }: InformationTooltipProps) => {
    const [showTooltip, setShowTooltip] = React.useState(false);

    const toggleTooltip = (newState: boolean) => {
        setShowTooltip(newState);
    };

    return (
        <span className="information-tooltip">
            <span
                className="information-tooltip-icon"
                onClick={() => toggleTooltip(!showTooltip)}
                onMouseOver={() => toggleTooltip(true)}
                onMouseOut={() => toggleTooltip(false)}
            >
                ️ ️ℹ️
            </span>
            {showTooltip && <div className={`information-tooltip-content information-tooltip-content-${direction}`}>{title}</div>}
        </span>
    );
};
