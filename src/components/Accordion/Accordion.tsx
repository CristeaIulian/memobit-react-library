import React, { ReactNode, useEffect, useRef, useState } from 'react';

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

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false, defaultExpanded = [], onChange, className = '' }: AccordionProps) => {
    const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpanded);

    const handleToggle = (id: string) => {
        const item = items.find(item => item.id === id);
        if (item?.disabled) return;

        let newExpandedIds: string[];

        if (allowMultiple) {
            newExpandedIds = expandedIds.includes(id) ? expandedIds.filter(expandedId => expandedId !== id) : [...expandedIds, id];
        } else {
            newExpandedIds = expandedIds.includes(id) ? [] : [id];
        }

        setExpandedIds(newExpandedIds);
        onChange?.(newExpandedIds);
    };

    return (
        <div className={`accordion ${className}`}>
            {items.map(item => {
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

const AccordionItem: React.FC<AccordionItemProps> = ({ id, title, icon, content, isExpanded, disabled = false, onToggle }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isFirstRun = useRef(true);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        // On mount, snap to the correct state without animating.
        if (isFirstRun.current) {
            isFirstRun.current = false;
            el.style.maxHeight = isExpanded ? 'none' : '0';
            return;
        }

        if (isExpanded) {
            // Animate from 0 to the measured content height.
            el.style.maxHeight = `${el.scrollHeight}px`;

            const handleTransitionEnd = (event: TransitionEvent) => {
                // Release the cap so later content or viewport changes can't clip the panel.
                if (event.propertyName === 'max-height') {
                    el.style.maxHeight = 'none';
                }
            };
            el.addEventListener('transitionend', handleTransitionEnd);
            return () => el.removeEventListener('transitionend', handleTransitionEnd);
        }

        // Collapse: pin to the current pixel height, then transition to 0.
        el.style.maxHeight = `${el.scrollHeight}px`;
        void el.offsetHeight; // force reflow so the browser registers the start height
        el.style.maxHeight = '0';
    }, [isExpanded]);

    const handleClick = () => {
        if (!disabled) {
            onToggle(id);
        }
    };

    return (
        <div className={`accordion-item ${isExpanded ? 'accordion-item--expanded' : ''} ${disabled ? 'accordion-item--disabled' : ''}`}>
            <button type="button" className="accordion-item__header" onClick={handleClick} disabled={disabled}>
                <span className="accordion-item__title">
                    {icon && <Icon name={icon} />}
                    <span className="accordion-item__title-text">{title}</span>
                </span>
                <span className="accordion-item__icon">
                    <Icon name="caret-down" size="md" />
                </span>
            </button>
            <div ref={wrapperRef} className="accordion-item__content-wrapper">
                <div className="accordion-item__content">{content}</div>
            </div>
        </div>
    );
};
