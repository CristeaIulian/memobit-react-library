import { CSSProperties, FC, ReactElement, ReactNode } from 'react';

import type { GridColumns } from './Grid';

export type ColSpan = GridColumns;

export interface ColProps {
    children: ReactNode;
    className?: string;
    /** Column count this cell occupies on desktop. */
    span?: ColSpan;
    /** Column count on mobile (<= 768px). Defaults to filling the row. */
    spanMobile?: ColSpan;
    /** Column count on tablet (769px - 1024px). Defaults to `span`, clamped by the parent. */
    spanTablet?: ColSpan;
    style?: CSSProperties;
}

interface ColCustomProperties extends CSSProperties {
    '--_col-span': number;
    '--_col-span-mobile': number;
    '--_col-span-tablet': number;
}

export const Col: FC<ColProps> = ({ children, className = '', span = 1, spanMobile, spanTablet, style }: ColProps): ReactElement => {
    const colStyle: ColCustomProperties = {
        '--_col-span': span,
        // A wide cell on a one-column phone layout should simply take the row.
        '--_col-span-mobile': spanMobile ?? span,
        '--_col-span-tablet': spanTablet ?? span,
        ...style,
    };

    return (
        <div className={['grid__col', className].filter(Boolean).join(' ')} style={colStyle}>
            {children}
        </div>
    );
};
