import { FC, useCallback, useEffect, useState } from 'react';

import './ScrollToTop.scss';

interface ScrollToTopProps {
    scrollContainer?: HTMLElement | null;
    scrollThreshold?: number;
    className?: string;
}

export const ScrollToTop: FC<ScrollToTopProps> = ({ scrollContainer, scrollThreshold = 200, className }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const target = scrollContainer ?? window;

        const handleScroll = () => {
            const scrollY = scrollContainer
                ? scrollContainer.scrollTop
                : window.scrollY;
            setVisible(scrollY > scrollThreshold);
        };

        target.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            target.removeEventListener('scroll', handleScroll);
        };
    }, [scrollContainer, scrollThreshold]);

    const scrollToTop = useCallback(() => {
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [scrollContainer]);

    if (!visible) {
        return null;
    }

    return (
        <button className={`scroll-to-top${className ? ` ${className}` : ''}`} onClick={scrollToTop} title="Scroll to top">
            <span className="scroll-to-top__icon">&#9650;</span>
        </button>
    );
};
