import React from 'react';

import { Icon } from '../Icon';

import './TourHud.scss';

export interface TourHudProps {
    /** Context label, e.g. a dataset or tour name. */
    label: string;
    /** Optional descriptor shown after the step counter, e.g. a year. */
    stepLabel?: string;
    /** Zero-based index of the current step. */
    index: number;
    total: number;
    /** Primary line — the current step's title. */
    title: string;
    /** Optional secondary line, rendered italic. */
    note?: string;
    onPrev: () => void;
    onNext: () => void;
    onExit: () => void;
    className?: string;
}

/** Floating heads-up display for step-through ("history mode") navigation. */
export const TourHud: React.FC<TourHudProps> = ({
    label,
    stepLabel,
    index,
    total,
    title,
    note,
    onPrev,
    onNext,
    onExit,
    className = '',
}) => (
    <div className={`tour-hud ${className}`.trim()}>
        <div className="tour-hud__body">
            <div className="tour-hud__context">
                {label} · Stop {index + 1} / {total}
                {stepLabel ? ` · ${stepLabel}` : ''}
            </div>
            <div className="tour-hud__title">{title}</div>
            {note && <div className="tour-hud__note">{note}</div>}
        </div>
        <div className="tour-hud__controls">
            <button
                type="button"
                className="tour-hud__btn"
                disabled={index === 0}
                onClick={onPrev}
            >
                <Icon name="arrow-left" size="sm" />
                Prev
            </button>
            <button
                type="button"
                className="tour-hud__btn"
                disabled={index >= total - 1}
                onClick={onNext}
            >
                Next
                <Icon name="arrow-right" size="sm" />
            </button>
            <button type="button" className="tour-hud__btn" onClick={onExit}>
                Exit
            </button>
        </div>
    </div>
);
