import type { SyntheticEvent } from 'react';

export const DATA_FILES_PATH = '/data-files';

export interface ImagePaths {
    basePath: string;
    getDefaultImageUrl: () => string;
    getCategoryImageUrl: (categoryKey: string) => string;
    getImageUrl: (filename: string | File, categoryKey?: string) => string;
    getNextImageFallback: (currentSrc: string, categoryKey?: string) => string | null;
    applyImageFallback: (event: SyntheticEvent<HTMLImageElement>, categoryKey?: string) => void;
}

/**
 * Image paths for one entity folder under /data-files, laid out as:
 *   default.jpg            — fallback for the whole folder
 *   category/<key>.jpg     — per-category fallback
 *   specific/<filename>    — uploaded images
 * The folder is named after what it holds (e.g. 'books'), never after the app.
 */
export const createImagePaths = (folder: string): ImagePaths => {
    const basePath = `${DATA_FILES_PATH}/${folder.replace(/^\/+|\/+$/g, '')}`;

    const getDefaultImageUrl = (): string => `${basePath}/default.jpg`;

    const getCategoryImageUrl = (categoryKey: string): string => `${basePath}/category/${categoryKey}.jpg`;

    // File (unsaved upload) → blob URL; full/blob/already-prefixed → unchanged;
    // empty → category fallback, else default; bare filename → specific/.
    const getImageUrl = (filename: string | File, categoryKey?: string): string => {
        if (typeof filename !== 'string') {
            return URL.createObjectURL(filename);
        }

        if (!filename) {
            return categoryKey ? getCategoryImageUrl(categoryKey) : getDefaultImageUrl();
        }

        if (filename.includes(basePath) || filename.startsWith('blob:') || filename.startsWith('http')) {
            return filename;
        }

        return `${basePath}/specific/${filename}`;
    };

    // Walks specific → category → default, returning null once nothing is left to try.
    const getNextImageFallback = (currentSrc: string, categoryKey?: string): string | null => {
        const defaultImage = getDefaultImageUrl();
        const categoryImage = categoryKey ? getCategoryImageUrl(categoryKey) : defaultImage;

        if (!currentSrc) {
            return categoryImage;
        }

        if (currentSrc.endsWith(defaultImage)) {
            return null;
        }

        if (currentSrc.includes(`${basePath}/category/`)) {
            return defaultImage;
        }

        return categoryImage;
    };

    // Drop-in <img onError> handler that advances the fallback chain one step per failure.
    const applyImageFallback = (event: SyntheticEvent<HTMLImageElement>, categoryKey?: string): void => {
        const image = event.currentTarget;
        const fallbackSrc = getNextImageFallback(image.src, categoryKey);

        if (fallbackSrc && !image.src.endsWith(fallbackSrc)) {
            image.src = fallbackSrc;
            return;
        }

        image.onerror = null;
    };

    return { basePath, getDefaultImageUrl, getCategoryImageUrl, getImageUrl, getNextImageFallback, applyImageFallback };
};
