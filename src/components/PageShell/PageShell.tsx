import { FC } from 'react';

import { PageShellProps } from './PageShell.types';
import { WorkbenchShell } from './WorkbenchShell';

import './PageShell.scss';

/** Lays out a page's title, actions, search, sort, filters and view options around its content, per device. */
export const PageShell: FC<PageShellProps> = ({ layout = 'workbench', ...props }) => {
    switch (layout) {
        case 'workbench':
            return <WorkbenchShell {...props} />;
    }
};
