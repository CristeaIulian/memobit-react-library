import { useEffect, useRef } from 'react';

interface LockedBodyStyles {
    overflow: string;
    position: string;
    top: string;
    left: string;
    right: string;
    width: string;
    scrollY: number;
}

export const useBodyScrollLock = (isLocked: boolean) => {
    const originalStyles = useRef<LockedBodyStyles | null>(null);

    useEffect(() => {
        const restore = () => {
            if (!originalStyles.current) return;
            const { overflow, position, top, left, right, width, scrollY } = originalStyles.current;
            document.body.style.overflow = overflow;
            document.body.style.position = position;
            document.body.style.top = top;
            document.body.style.left = left;
            document.body.style.right = right;
            document.body.style.width = width;
            window.scrollTo(0, scrollY);
            originalStyles.current = null;
        };

        if (isLocked) {
            if (!originalStyles.current) {
                const scrollY = window.scrollY;
                originalStyles.current = {
                    overflow: document.body.style.overflow,
                    position: document.body.style.position,
                    top: document.body.style.top,
                    left: document.body.style.left,
                    right: document.body.style.right,
                    width: document.body.style.width,
                    scrollY,
                };
                // Pin the body in place so the page can't scroll while the drawer/modal is open,
                // while keeping the scroll position visually stable via a negative `top` offset.
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollY}px`;
                document.body.style.left = '0';
                document.body.style.right = '0';
                document.body.style.width = '100%';
            }
        } else {
            restore();
        }

        return () => {
            restore();
        };
    }, [isLocked]);
};
