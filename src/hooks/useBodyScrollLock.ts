import { useEffect, useRef } from 'react';

export const useBodyScrollLock = (isLocked: boolean) => {
    const originalStyles = useRef<{ overflow: string; height: string } | null>(null);

    useEffect(() => {
        if (isLocked) {
            // Store original styles only once
            if (!originalStyles.current) {
                originalStyles.current = {
                    overflow: document.body.style.overflow,
                    height: document.body.style.height,
                };
            }

            // Lock scroll
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        } else {
            // Restore original styles
            if (originalStyles.current) {
                document.body.style.overflow = originalStyles.current.overflow;
                document.body.style.height = originalStyles.current.height;
                originalStyles.current = null;
            }
        }

        // Cleanup on unmount
        return () => {
            if (originalStyles.current) {
                document.body.style.overflow = originalStyles.current.overflow;
                document.body.style.height = originalStyles.current.height;
                originalStyles.current = null;
            }
        };
    }, [isLocked]);
};
