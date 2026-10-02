import { useEffect } from 'react';

interface LockedBodyStyles {
    overflow: string;
    position: string;
    top: string;
    left: string;
    right: string;
    width: string;
    scrollY: number;
}

// Module scope, not a ref per hook instance: overlays stack — a task drawer over a day
// agenda, a confirm modal over either — and each one locks. Held per instance, the second
// lock captured the *locked* body as its "original" and restored that on close, reading a
// scroll position of 0 from an already-fixed body and jerking the page to the top while
// the drawer underneath was still open. Only the first lock captures, only the last
// releases, so the page comes back exactly where it was left.
let lockCount = 0;
let originalStyles: LockedBodyStyles | null = null;

export const useBodyScrollLock = (isLocked: boolean) => {
    useEffect(() => {
        if (!isLocked) {
            return;
        }

        lockCount += 1;

        if (lockCount === 1) {
            const scrollY = window.scrollY;

            originalStyles = {
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

        return () => {
            lockCount -= 1;

            if (lockCount > 0 || !originalStyles) {
                return;
            }

            const { left, overflow, position, right, scrollY, top, width } = originalStyles;

            document.body.style.overflow = overflow;
            document.body.style.position = position;
            document.body.style.top = top;
            document.body.style.left = left;
            document.body.style.right = right;
            document.body.style.width = width;
            window.scrollTo(0, scrollY);

            originalStyles = null;
        };
    }, [isLocked]);
};
