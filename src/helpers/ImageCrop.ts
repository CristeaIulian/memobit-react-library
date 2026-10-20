export type ImageRotation = 0 | 90 | 180 | 270;

/** A region of an image as fractions (0–1) of its width and height, measured after rotation. */
export interface CropRegion {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface EncodeImageOptions {
    /** Longest edge of the output, in pixels. Smaller images are never upscaled. Defaults to 1600. */
    maxEdge?: number;
    /** 0–1. Defaults to 0.82 for WebP and 0.85 for the JPEG fallback. */
    quality?: number;
    rotation?: ImageRotation;
}

export interface EncodedImage {
    /** `data:` URL, handy for an instant preview. */
    dataUrl: string;
    /** The same bytes as base64 without the `data:` prefix, the shape memobit-framework uploads expect. */
    base64: string;
    mimeType: 'image/webp' | 'image/jpeg';
    extension: 'webp' | 'jpg';
    width: number;
    height: number;
}

export const FULL_IMAGE: CropRegion = { x: 0, y: 0, width: 1, height: 1 };

const DEFAULT_MAX_EDGE = 1600;
const WEBP_QUALITY = 0.82;
const JPEG_QUALITY = 0.85;

/** Loads a Blob/File or URL into a decoded image element. */
export const loadImageElement = (source: Blob | string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const url = typeof source === 'string' ? source : URL.createObjectURL(source);
        const release = () => {
            if (typeof source !== 'string') URL.revokeObjectURL(url);
        };
        const image = new Image();
        image.onload = () => {
            release();
            resolve(image);
        };
        image.onerror = () => {
            release();
            reject(new Error('This file could not be read as an image.'));
        };
        image.src = url;
    });

const isQuarterTurn = (rotation: ImageRotation): boolean => rotation === 90 || rotation === 270;

/** Image size once rotated. */
export const rotatedSize = (image: HTMLImageElement, rotation: ImageRotation = 0): { width: number; height: number } =>
    isQuarterTurn(rotation) ? { width: image.naturalHeight, height: image.naturalWidth } : { width: image.naturalWidth, height: image.naturalHeight };

const context2d = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('Image processing is not available in this browser.');
    }
    return context;
};

/**
 * Draws `region` of the rotated image into a canvas no bigger than `maxEdge`. The rotation and
 * crop are applied in one pass from the original pixels, so nothing is resampled twice.
 */
export const renderImageRegion = (image: HTMLImageElement, region: CropRegion, rotation: ImageRotation = 0, maxEdge = DEFAULT_MAX_EDGE): HTMLCanvasElement => {
    const rotated = rotatedSize(image, rotation);
    const sourceWidth = region.width * rotated.width;
    const sourceHeight = region.height * rotated.height;
    const scale = Math.min(1, maxEdge / Math.max(sourceWidth, sourceHeight));

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    const context = context2d(canvas);

    // Map rotated-image coordinates onto the output: scale, shift the region to the origin, then
    // rotate the original image about the rotated frame's corner.
    context.scale(scale, scale);
    context.translate(-region.x * rotated.width, -region.y * rotated.height);
    if (rotation === 90) {
        context.translate(rotated.width, 0);
    } else if (rotation === 180) {
        context.translate(rotated.width, rotated.height);
    } else if (rotation === 270) {
        context.translate(0, rotated.height);
    }
    context.rotate((rotation * Math.PI) / 180);
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0);

    return canvas;
};

/** Encodes a canvas as WebP, or JPEG where the browser cannot encode WebP (canvas then falls back to PNG). */
export const encodeCanvas = (canvas: HTMLCanvasElement, quality?: number): EncodedImage => {
    const webp = canvas.toDataURL('image/webp', quality ?? WEBP_QUALITY);
    const isWebp = webp.startsWith('data:image/webp');
    const dataUrl = isWebp ? webp : canvas.toDataURL('image/jpeg', quality ?? JPEG_QUALITY);

    return {
        dataUrl,
        base64: dataUrl.split(',')[1] ?? '',
        mimeType: isWebp ? 'image/webp' : 'image/jpeg',
        extension: isWebp ? 'webp' : 'jpg',
        width: canvas.width,
        height: canvas.height,
    };
};

/**
 * Crops, rotates, downscales and encodes an image in the browser before it is uploaded: a phone
 * photo shrinks from megabytes to a few hundred kilobytes, and EXIF metadata (GPS included) is dropped.
 */
export const cropImage = async (
    source: Blob | string | HTMLImageElement,
    region: CropRegion = FULL_IMAGE,
    options: EncodeImageOptions = {}
): Promise<EncodedImage> => {
    const image = source instanceof HTMLImageElement ? source : await loadImageElement(source);
    const canvas = renderImageRegion(image, region, options.rotation ?? 0, options.maxEdge ?? DEFAULT_MAX_EDGE);
    return encodeCanvas(canvas, options.quality);
};
