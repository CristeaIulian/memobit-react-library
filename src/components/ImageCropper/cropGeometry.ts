import type { CropRegion } from '../../helpers/ImageCrop';

export type CropHandle = 'move' | 'nw' | 'ne' | 'sw' | 'se';

/** Smallest crop side, as a fraction of the image side. */
export const MIN_CROP = 0.08;
const DEFAULT_COVERAGE = 0.9;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/**
 * `aspect` is width ÷ height in pixels. A region stores fractions of the image, so the same
 * pixel ratio becomes a different fraction ratio on a non-square image.
 */
const fractionRatio = (aspect: number, imageWidth: number, imageHeight: number): number => (aspect * imageHeight) / imageWidth;

/** The largest centred region of the given aspect covering 90% of the image, or 90% of it when free. */
export const initialRegion = (imageWidth: number, imageHeight: number, aspect?: number): CropRegion => {
    if (!aspect) {
        const margin = (1 - DEFAULT_COVERAGE) / 2;
        return { x: margin, y: margin, width: DEFAULT_COVERAGE, height: DEFAULT_COVERAGE };
    }

    const ratio = fractionRatio(aspect, imageWidth, imageHeight);
    let width = DEFAULT_COVERAGE;
    let height = width / ratio;
    if (height > DEFAULT_COVERAGE) {
        height = DEFAULT_COVERAGE;
        width = height * ratio;
    }
    return { x: (1 - width) / 2, y: (1 - height) / 2, width, height };
};

/** Fits an existing region to a newly locked aspect, keeping its centre where possible. */
export const fitRegionToAspect = (region: CropRegion, imageWidth: number, imageHeight: number, aspect: number): CropRegion => {
    const ratio = fractionRatio(aspect, imageWidth, imageHeight);
    let width = region.width;
    let height = width / ratio;
    if (height > 1) {
        height = 1;
        width = height * ratio;
    }
    if (width > 1) {
        width = 1;
        height = width / ratio;
    }
    const centerX = region.x + region.width / 2;
    const centerY = region.y + region.height / 2;
    return {
        x: clamp(centerX - width / 2, 0, 1 - width),
        y: clamp(centerY - height / 2, 0, 1 - height),
        width,
        height,
    };
};

/**
 * Applies a pointer drag (dx, dy as fractions of the image) to the region it started from.
 * Corners resize against the opposite corner, which stays fixed; with an aspect the height follows
 * the width, and both are capped so the region never leaves the image.
 */
export const dragRegion = (
    start: CropRegion,
    handle: CropHandle,
    dx: number,
    dy: number,
    imageWidth: number,
    imageHeight: number,
    aspect?: number
): CropRegion => {
    if (handle === 'move') {
        return {
            ...start,
            x: clamp(start.x + dx, 0, 1 - start.width),
            y: clamp(start.y + dy, 0, 1 - start.height),
        };
    }

    const west = handle === 'nw' || handle === 'sw';
    const north = handle === 'nw' || handle === 'ne';
    const anchorX = west ? start.x + start.width : start.x;
    const anchorY = north ? start.y + start.height : start.y;
    // Room between the fixed corner and the image edge the dragged corner moves towards.
    const roomX = west ? anchorX : 1 - anchorX;
    const roomY = north ? anchorY : 1 - anchorY;

    let width = clamp(start.width + (west ? -dx : dx), MIN_CROP, roomX);
    let height = clamp(start.height + (north ? -dy : dy), MIN_CROP, roomY);

    if (aspect) {
        const ratio = fractionRatio(aspect, imageWidth, imageHeight);
        // Follow whichever axis the pointer moved further along, then fit the other to the ratio.
        if (Math.abs(dx) >= Math.abs(dy) * ratio) {
            height = width / ratio;
        } else {
            width = height * ratio;
        }
        if (height > roomY) {
            height = roomY;
            width = height * ratio;
        }
        if (width > roomX) {
            width = roomX;
            height = width / ratio;
        }
        const minWidth = Math.max(MIN_CROP, MIN_CROP * ratio);
        if (width < minWidth) {
            width = minWidth;
            height = width / ratio;
        }
    }

    width = Math.min(width, 1);
    height = Math.min(height, 1);
    return {
        x: clamp(west ? anchorX - width : anchorX, 0, 1 - width),
        y: clamp(north ? anchorY - height : anchorY, 0, 1 - height),
        width,
        height,
    };
};
