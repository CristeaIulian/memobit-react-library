import { CSSProperties, FC, ReactElement, useEffect, useRef, useState } from 'react';

import './RollingNumber.scss';

export type RollingNumberSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
export type RollingNumberVariant = 'default' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
export type RollingNumberDirection = 'up' | 'down' | 'none';

export interface RollingNumberProps {
    className?: string;
    /** Tint the readout green when the value rose and red when it fell, overriding `variant`. */
    colorByDirection?: boolean;
    decimals?: number;
    decimalSeparator?: string;
    /** Roll duration in milliseconds. */
    duration?: number;
    /** Thousands separator. Pass an empty string to switch grouping off. */
    groupSeparator?: string;
    prefix?: string;
    size?: RollingNumberSize;
    /** Delay added per digit so the columns land one after another, in milliseconds. */
    stagger?: number;
    suffix?: string;
    value: number;
    variant?: RollingNumberVariant;
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const formatValue = (value: number, decimals: number, groupSeparator: string, decimalSeparator: string): string => {
    const isNegative = value < 0;
    const fixed = Math.abs(value).toFixed(decimals);
    const [whole, fraction] = fixed.split('.');

    const grouped = groupSeparator ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator) : whole;
    const body = fraction ? `${grouped}${decimalSeparator}${fraction}` : grouped;

    return isNegative ? `-${body}` : body;
};

interface RollingDigitCustomProperties extends CSSProperties {
    '--_roll-delay': string;
    '--_roll-digit': number;
}

export const RollingNumber: FC<RollingNumberProps> = ({
    className = '',
    colorByDirection = false,
    decimals = 0,
    decimalSeparator = '.',
    duration = 600,
    groupSeparator = ',',
    prefix,
    size = 'xl',
    stagger = 40,
    suffix,
    value,
    variant = 'default',
}: RollingNumberProps): ReactElement => {
    const previousValue = useRef(value);
    const [direction, setDirection] = useState<RollingNumberDirection>('none');
    // Mounting with the digits already in place would animate every column up from zero on
    // first paint, which reads as noise rather than as a change.
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (value === previousValue.current) return;

        setDirection(value > previousValue.current ? 'up' : 'down');
        previousValue.current = value;
    }, [value]);

    const characters = formatValue(value, decimals, groupSeparator, decimalSeparator).split('');

    const classes = [
        'rolling-number',
        `rolling-number--${size}`,
        colorByDirection ? `rolling-number--direction-${direction}` : `rolling-number--${variant}`,
        hasMounted ? 'rolling-number--animated' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <span className={classes} style={{ '--_roll-duration': `${duration}ms` } as CSSProperties} title={characters.join('')}>
            {prefix && <span className="rolling-number__affix">{prefix}</span>}

            {characters.map((character, index) => {
                const isDigit = character >= '0' && character <= '9';
                // Keyed and delayed from the right so a value gaining a digit does not reshuffle
                // the columns that did not change, and the units place leads the roll.
                const placeFromRight = characters.length - 1 - index;

                if (!isDigit) {
                    return (
                        <span className="rolling-number__separator" key={`sep-${placeFromRight}`}>
                            {character}
                        </span>
                    );
                }

                const digitStyle: RollingDigitCustomProperties = {
                    '--_roll-delay': `${placeFromRight * stagger}ms`,
                    '--_roll-digit': Number(character),
                };

                return (
                    <span className="rolling-number__digit" key={`digit-${placeFromRight}`}>
                        <span className="rolling-number__strip" style={digitStyle}>
                            {DIGITS.map(digit => (
                                <span className="rolling-number__cell" key={digit}>
                                    {digit}
                                </span>
                            ))}
                        </span>
                    </span>
                );
            })}

            {suffix && <span className="rolling-number__affix">{suffix}</span>}
        </span>
    );
};
