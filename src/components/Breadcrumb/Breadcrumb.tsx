import React from 'react';

import './Breadcrumb.scss';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: string;
    className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, separator = '/', className = '' }) => {
    const handleClick = (item: BreadcrumbItem, event: React.MouseEvent) => {
        if (item.onClick) {
            event.preventDefault();
            item.onClick();
        }
    };

    return (
        <nav className={`breadcrumb ${className}`}>
            <ol className="breadcrumb__list">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="breadcrumb__item">
                            {item.href && !isLast ? (
                                <a href={item.href} className="breadcrumb__link" onClick={e => handleClick(item, e)}>
                                    {item.label}
                                </a>
                            ) : (
                                <span className={`breadcrumb__text ${isLast ? 'breadcrumb__text--current' : ''}`}>{item.label}</span>
                            )}
                            {!isLast && <span className="breadcrumb__separator">{separator}</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
