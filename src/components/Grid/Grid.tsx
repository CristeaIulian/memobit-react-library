import { CSSProperties, FC, ReactElement, ReactNode } from 'react';

import './Grid.scss';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
export type GridGap = '0' | '2' | '4' | '6' | '8' | '12' | '16' | '20' | '24' | '32' | '40' | '48';
export type GridAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type GridJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around';

export interface GridProps {
    /** Vertical alignment of the items inside each row. */
    align?: GridAlign;
    children: ReactNode;
    className?: string;
    /** Columns from the desktop breakpoint up (> 1024px). */
    cols?: GridColumns;
    /** Columns on mobile (<= 768px). Defaults to 1 so content stacks. */
    colsMobile?: GridColumns;
    /** Columns on tablet (769px - 1024px). Defaults to `cols` capped at 2. */
    colsTablet?: GridColumns;
    /** Spacing token used between columns, and between rows unless `rowGap` overrides it. */
    gap?: GridGap;
    /** Horizontal distribution of a partially filled row. */
    justify?: GridJustify;
    /**
     * Switches to a fluid track: every child takes at least this many pixels and rows wrap on
     * their own. `cols` and the responsive overrides are ignored while this is set.
     */
    minColWidth?: number;
    /** Row spacing token, when rows should breathe differently from columns. */
    rowGap?: GridGap;
    style?: CSSProperties;
}

// The tablet default keeps a 3+ column desktop layout readable without the consumer
// having to spell out every breakpoint: anything wider than 2 columns halves down to 2.
const getTabletCols = (cols: GridColumns): GridColumns => (cols > 2 ? 2 : cols);

interface GridCustomProperties extends CSSProperties {
    '--_grid-cols': number;
    '--_grid-cols-mobile': number;
    '--_grid-cols-tablet': number;
    '--_grid-gap': string;
    '--_grid-min-col'?: string;
    '--_grid-row-gap': string;
}

export const Grid: FC<GridProps> = ({
    align = 'stretch',
    children,
    className = '',
    cols = 2,
    colsMobile = 1,
    colsTablet,
    gap = '16',
    justify = 'start',
    minColWidth,
    rowGap,
    style,
}: GridProps): ReactElement => {
    const gapToken = gap === '0' ? '0px' : `var(--spacing-${gap})`;
    const rowGapToken = rowGap === undefined ? gapToken : rowGap === '0' ? '0px' : `var(--spacing-${rowGap})`;

    const gridStyle: GridCustomProperties = {
        '--_grid-cols': cols,
        '--_grid-cols-mobile': colsMobile,
        '--_grid-cols-tablet': colsTablet ?? getTabletCols(cols),
        '--_grid-gap': gapToken,
        '--_grid-row-gap': rowGapToken,
        ...(minColWidth === undefined ? {} : { '--_grid-min-col': `${minColWidth}px` }),
        ...style,
    };

    const classes = [
        'grid',
        minColWidth === undefined ? '' : 'grid--fluid',
        `grid--align-${align}`,
        `grid--justify-${justify}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} style={gridStyle}>
            {children}
        </div>
    );
};
