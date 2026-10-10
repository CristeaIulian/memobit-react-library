import type { SyntheticEvent } from 'react';

// Every app keeps its uploaded entity images under the same generic folder:
//   default.jpg            — app-wide fallback
//   category/<key>.jpg     — per-category fallback
//   specific/<filename>    — uploaded images
export const IMAGES_BASE_PATH = '/data-files/images';

export const getDefaultImageUrl = (): string => `${IMAGES_BASE_PATH}/default.jpg`;

export const getCategoryImageUrl = (categoryKey: string): string => `${IMAGES_BASE_PATH}/category/${categoryKey}.jpg`;

/**
 * Resolves what an <img> should show for a stored image value:
 * - a File (new, unsaved upload) → a blob URL
 * - a full URL, blob URL or already-prefixed path → unchanged
 * - empty → the category fallback, else the app default
 * - a bare filename → its path under specific/
 */
export const getImageUrl = (filename: string | File, categoryKey?: string): string => {
    if (typeof filename !== 'string') {
        return URL.createObjectURL(filename);
    }

    if (!filename) {
        return categoryKey ? getCategoryImageUrl(categoryKey) : getDefaultImageUrl();
    }

    if (filename.includes(IMAGES_BASE_PATH) || filename.startsWith('blob:') || filename.startsWith('http')) {
        return filename;
    }

    return `${IMAGES_BASE_PATH}/specific/${filename}`;
};

// Walks the fallback chain specific → category → default, returning null once there is
// nothing left to try so the caller can stop retrying.
export const getNextImageFallback = (currentSrc: string, categoryKey?: string): string | null => {
    const defaultImage = getDefaultImageUrl();
    const categoryImage = categoryKey ? getCategoryImageUrl(categoryKey) : defaultImage;

    if (!currentSrc) {
        return categoryImage;
    }

    if (currentSrc.endsWith(defaultImage)) {
        return null;
    }

    if (currentSrc.includes(`${IMAGES_BASE_PATH}/category/`)) {
        return defaultImage;
    }

    return categoryImage;
};

// Drop-in <img onError> handler that advances the fallback chain one step per failure.
export const applyImageFallback = (event: SyntheticEvent<HTMLImageElement>, categoryKey?: string): void => {
    const image = event.currentTarget;
    const fallbackSrc = getNextImageFallback(image.src, categoryKey);

    if (fallbackSrc && !image.src.endsWith(fallbackSrc)) {
        image.src = fallbackSrc;
        return;
    }

    image.onerror = null;
};
