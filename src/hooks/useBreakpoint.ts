import { useCallback,useEffect, useState } from 'react';

// Define breakpoint types
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'largeDesktop';

// Define breakpoint values
export const breakpoints = {
    mobile: { min: 0, max: 767 },
    tablet: { min: 768, max: 991 },
    desktop: { min: 992, max: 1199 },
    largeDesktop: { min: 1200, max: Infinity },
} as const;

// Media queries for each breakpoint
const mediaQueries = {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 991px)',
    desktop: '(min-width: 992px) and (max-width: 1199px)',
    largeDesktop: '(min-width: 1200px)',
} as const;

interface UseBreakpointReturn {
    currentBreakpoint: Breakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isLargeDesktop: boolean;
    isAbove: (breakpoint: Breakpoint) => boolean;
    isBelow: (breakpoint: Breakpoint) => boolean;
    isAtLeast: (breakpoint: Breakpoint) => boolean;
    isAtMost: (breakpoint: Breakpoint) => boolean;
}

// Helper function to get current breakpoint based on window width
const getCurrentBreakpoint = (): Breakpoint => {
    if (typeof window === 'undefined') return 'desktop'; // SSR fallback

    const width = window.innerWidth;

    if (width <= breakpoints.mobile.max) return 'mobile';
    if (width >= breakpoints.tablet.min && width <= breakpoints.tablet.max) return 'tablet';
    if (width >= breakpoints.desktop.min && width <= breakpoints.desktop.max) return 'desktop';

    return 'largeDesktop';
};

// Helper function to get breakpoint order index
const getBreakpointIndex = (breakpoint: Breakpoint): number => {
    const order: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'largeDesktop'];
    return order.indexOf(breakpoint);
};

export const useBreakpoint = (): UseBreakpointReturn => {
    const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(getCurrentBreakpoint);

    // Memoized comparison functions
    const isAbove = useCallback(
        (breakpoint: Breakpoint): boolean => {
            return getBreakpointIndex(currentBreakpoint) > getBreakpointIndex(breakpoint);
        },
        [currentBreakpoint]
    );

    const isBelow = useCallback(
        (breakpoint: Breakpoint): boolean => {
            return getBreakpointIndex(currentBreakpoint) < getBreakpointIndex(breakpoint);
        },
        [currentBreakpoint]
    );

    const isAtLeast = useCallback(
        (breakpoint: Breakpoint): boolean => {
            return getBreakpointIndex(currentBreakpoint) >= getBreakpointIndex(breakpoint);
        },
        [currentBreakpoint]
    );

    const isAtMost = useCallback(
        (breakpoint: Breakpoint): boolean => {
            return getBreakpointIndex(currentBreakpoint) <= getBreakpointIndex(breakpoint);
        },
        [currentBreakpoint]
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Create media query lists for efficient listening
        const mediaQueryLists = Object.entries(mediaQueries).map(([breakpoint, query]) => ({
            breakpoint: breakpoint as Breakpoint,
            mql: window.matchMedia(query),
        }));

        // Handler for media query changes
        const handleMediaQueryChange = () => {
            setCurrentBreakpoint(getCurrentBreakpoint());
        };

        // Add listeners to all media queries
        mediaQueryLists.forEach(({ mql }) => {
            // Modern browsers
            if (mql.addEventListener) {
                mql.addEventListener('change', handleMediaQueryChange);
            } else {
                // Fallback for older browsers
                mql.addListener(handleMediaQueryChange);
            }
        });

        // Set initial breakpoint
        setCurrentBreakpoint(getCurrentBreakpoint());

        // Cleanup function
        return () => {
            mediaQueryLists.forEach(({ mql }) => {
                if (mql.removeEventListener) {
                    mql.removeEventListener('change', handleMediaQueryChange);
                } else {
                    mql.removeListener(handleMediaQueryChange);
                }
            });
        };
    }, []);

    return {
        currentBreakpoint,
        isMobile: currentBreakpoint === 'mobile',
        isTablet: currentBreakpoint === 'tablet',
        isDesktop: currentBreakpoint === 'desktop',
        isLargeDesktop: currentBreakpoint === 'largeDesktop',
        isAbove,
        isBelow,
        isAtLeast,
        isAtMost,
    };
};
