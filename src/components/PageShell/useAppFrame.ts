import { createContext, useContext } from 'react';

import { AppFrameProps } from './PageShell.types';

export type AppFrameContextValue = Omit<AppFrameProps, 'children'>;

export const AppFrameContext = createContext<AppFrameContextValue | null>(null);

/** The app identity and menu set by the nearest AppFrame, or null outside one. */
export const useAppFrame = (): AppFrameContextValue | null => useContext(AppFrameContext);
