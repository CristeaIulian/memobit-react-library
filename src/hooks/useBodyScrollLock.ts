import { useEffect } from 'react';

export const useBodyScrollLock = (isLocked: boolean) => {
    useEffect(() => {
        if (isLocked) {
            // Store original overflow
            const originalOverflow = document.body.style.overflow;
            const originalHeight = document.body.style.height;

            // Lock scroll
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';

            // Cleanup function
            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.height = originalHeight;
            };
        }
    }, [isLocked]);
};
