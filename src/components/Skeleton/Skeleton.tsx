import React from 'react';

import './Skeleton.scss';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps {
    variant?: SkeletonVariant;
    animation?: SkeletonAnimation;
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    count?: number;
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    animation = 'pulse',
    width,
    height,
    borderRadius,
    count = 1,
    className = '',
}: SkeletonProps) => {
    const getVariantStyles = (): React.CSSProperties => {
        const styles: React.CSSProperties = {};

        // Set width
        if (width !== undefined) {
            styles.width = typeof width === 'number' ? `${width}px` : width;
        } else {
            styles.width = '100%';
        }

        // Set height based on variant
        if (height !== undefined) {
            styles.height = typeof height === 'number' ? `${height}px` : height;
        } else {
            switch (variant) {
                case 'text':
                    styles.height = '1em';
                    break;
                case 'circular':
                    styles.height = width !== undefined
                        ? (typeof width === 'number' ? `${width}px` : width)
                        : '40px';
                    styles.width = styles.height;
                    break;
                case 'rectangular':
                    styles.height = '100px';
                    break;
                case 'rounded':
                    styles.height = '40px';
                    break;
            }
        }

        // Set border radius based on variant
        if (borderRadius !== undefined) {
            styles.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
        } else {
            switch (variant) {
                case 'text':
                    styles.borderRadius = '4px';
                    break;
                case 'circular':
                    styles.borderRadius = '50%';
                    break;
                case 'rectangular':
                    styles.borderRadius = '0';
                    break;
                case 'rounded':
                    styles.borderRadius = '8px';
                    break;
            }
        }

        return styles;
    };

    const skeletonClass = `skeleton skeleton--${variant} skeleton--${animation} ${className}`;
    const styles = getVariantStyles();

    const skeletons = Array.from({ length: count }, (_, index) => (
        <div key={index} className={skeletonClass} style={styles} />
    ));

    return count > 1 ? (
        <div className="skeleton-group">
            {skeletons}
        </div>
    ) : (
        <>{skeletons}</>
    );
};
