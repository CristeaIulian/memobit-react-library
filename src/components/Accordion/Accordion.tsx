import React, { useState, ReactNode } from 'react';

import { Icon, type IconName } from '../Icon';

import './Accordion.scss';

export interface AccordionItemData {
    id: string;
    title: string | ReactNode;
    content: string | ReactNode;
    icon?: IconName;
    disabled?: boolean;
}

export interface AccordionProps {
    items: AccordionItemData[];
    allowMultiple?: boolean;
    defaultExpanded?: string[];
    onChange?: (expandedIds: string[]) => void;
    className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
    items,
    allowMultiple = false,
    defaultExpanded = [],
    onChange,
    className = '',
}: AccordionProps) => {
    const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpanded);

    const handleToggle = (id: string) => {
        const item = items.find(item => item.id === id);
        if (item?.disabled) return;

        let newExpandedIds: string[];

        if (allowMultiple) {
            newExpandedIds = expandedIds.includes(id)
                ? expandedIds.filter(expandedId => expandedId !== id)
                : [...expandedIds, id];
        } else {
            newExpandedIds = expandedIds.includes(id) ? [] : [id];
        }

        setExpandedIds(newExpandedIds);
        onChange?.(newExpandedIds);
    };

    return (
        <div className={`accordion ${className}`}>
            {items.map((item) => {
                const isExpanded = expandedIds.includes(item.id);
                return (
                    <AccordionItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        icon={item.icon}
                        content={item.content}
                        isExpanded={isExpanded}
                        disabled={item.disabled}
                        onToggle={handleToggle}
                    />
                );
            })}
        </div>
    );
};

interface AccordionItemProps {
    id: string;
    title: string | ReactNode;
    icon?: IconName;
    content: string | ReactNode;
    isExpanded: boolean;
    disabled?: boolean;
    onToggle: (id: string) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
    id,
    title,
    icon,
    content,
    isExpanded,
    disabled = false,
    onToggle,
}) => {
    const handleClick = () => {
        if (!disabled) {
            onToggle(id);
        }
    };

    return (
        <div
            className={`accordion-item ${isExpanded ? 'accordion-item--expanded' : ''} ${
                disabled ? 'accordion-item--disabled' : ''
            }`}
        >
            <button
                type="button"
                className="accordion-item__header"
                onClick={handleClick}
                disabled={disabled}
            >
                <span className="accordion-item__title">
                    {icon && <Icon name={icon} />}
                    <span className="accordion-item__title-text">{title}</span>
                </span>
                <span className="accordion-item__icon">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </button>
            <div className="accordion-item__content-wrapper">
                <div className="accordion-item__content">{content}</div>
            </div>
        </div>
    );
};
