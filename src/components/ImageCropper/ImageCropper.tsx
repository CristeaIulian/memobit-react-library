import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';

import { logger } from '@memobit/core';

import {
    cropImage,
    type CropRegion,
    type EncodedImage,
    FULL_IMAGE,
    type ImageRotation,
    loadImageElement,
    renderImageRegion,
    rotatedSize,
} from '../../helpers/ImageCrop';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { ToggleSwitch } from '../ToggleSwitch';

import { type CropHandle, fitRegionToAspect, initialRegion } from './cropGeometry';
import { useCropDrag } from './useCropDrag';

import './ImageCropper.scss';

export interface ImageCropperProps {
    isOpen: boolean;
    /** The photo to crop: a picked File/Blob or an image URL. */
    source: Blob | string | null;
    onApply: (image: EncodedImage) => void;
    onCancel: () => void;
    title?: string;
    /** Width ÷ height the crop is locked to, e.g. 85.6 / 54 for a bank card. Omit for a free crop. */
    aspect?: number;
    /** Label for the switch that unlocks the aspect, e.g. "Card shape". */
    aspectLabel?: string;
    /** Shows the switch that lets the user crop freely when `aspect` is set. Defaults to true. */
    allowFreeAspect?: boolean;
    /** Offers "Use full image", which encodes the whole (rotated) image. Defaults to true. */
    allowFullImage?: boolean;
    /** Longest edge of the result, in pixels. Defaults to 1600. */
    maxEdge?: number;
    /** 0–1 encoder quality. Defaults to the helper's WebP/JPEG defaults. */
    quality?: number;
}

const PREVIEW_EDGE = 1200;
const PREVIEW_QUALITY = 0.9;
const HANDLES: CropHandle[] = ['nw', 'ne', 'sw', 'se'];
const NEXT_ROTATION: Record<ImageRotation, ImageRotation> = { 0: 90, 90: 180, 180: 270, 270: 0 };

interface LoadedImage {
    source: Blob | string;
    element: HTMLImageElement;
}

const percent = (fraction: number): string => `${(fraction * 100).toFixed(3)}%`;

/**
 * Crop (and rotate) a photo before it is uploaded. The result is already downscaled and encoded as
 * WebP (JPEG where WebP cannot be encoded), ready to send as a memobit-framework upload.
 */
export const ImageCropper: FC<ImageCropperProps> = ({
    isOpen,
    source,
    onApply,
    onCancel,
    title = 'Crop image',
    aspect,
    aspectLabel = 'Keep shape',
    allowFreeAspect = true,
    allowFullImage = true,
    maxEdge,
    quality,
}) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const [loaded, setLoaded] = useState<LoadedImage | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [rotation, setRotation] = useState<ImageRotation>(0);
    const [isLocked, setIsLocked] = useState(Boolean(aspect));
    const [region, setRegion] = useState<CropRegion>(FULL_IMAGE);
    const [isEncoding, setIsEncoding] = useState(false);

    const image = loaded && loaded.source === source ? loaded.element : null;
    const size = image ? rotatedSize(image, rotation) : { width: 1, height: 1 };
    const activeAspect = isLocked ? aspect : undefined;

    useEffect(() => {
        if (!isOpen || !source) return;
        let cancelled = false;
        setLoadError(null);
        loadImageElement(source)
            .then(element => {
                if (cancelled) return;
                setLoaded({ source, element });
                setRotation(0);
                setIsLocked(Boolean(aspect));
                setRegion(initialRegion(element.naturalWidth, element.naturalHeight, aspect));
            })
            .catch(error => {
                if (!cancelled) setLoadError(error instanceof Error ? error.message : 'This image could not be opened.');
            });
        return () => {
            cancelled = true;
        };
    }, [isOpen, source, aspect]);

    // A downscaled, rotated copy to crop on: dragging over a 12-megapixel original would stutter.
    const previewUrl = useMemo(() => {
        if (!image) return null;
        try {
            return renderImageRegion(image, FULL_IMAGE, rotation, PREVIEW_EDGE).toDataURL('image/jpeg', PREVIEW_QUALITY);
        } catch (error) {
            logger.error('Image preview failed', error);
            return null;
        }
    }, [image, rotation]);

    const { startDrag, frameHandlers } = useCropDrag({
        frameRef,
        region,
        onChange: setRegion,
        imageWidth: size.width,
        imageHeight: size.height,
        aspect: activeAspect,
    });

    const rotate = () => {
        if (!image) return;
        const next = NEXT_ROTATION[rotation];
        const rotated = rotatedSize(image, next);
        setRotation(next);
        setRegion(initialRegion(rotated.width, rotated.height, activeAspect));
    };

    const reset = () => {
        if (!image) return;
        setRotation(0);
        setIsLocked(Boolean(aspect));
        setRegion(initialRegion(image.naturalWidth, image.naturalHeight, aspect));
    };

    const toggleLock = (locked: boolean) => {
        setIsLocked(locked);
        if (locked && aspect) setRegion(current => fitRegionToAspect(current, size.width, size.height, aspect));
    };

    const apply = async (target: CropRegion) => {
        if (!image) return;
        setIsEncoding(true);
        try {
            onApply(await cropImage(image, target, { rotation, maxEdge, quality }));
        } catch (error) {
            logger.error('Image crop failed', error);
            setLoadError(error instanceof Error ? error.message : 'The image could not be cropped.');
        } finally {
            setIsEncoding(false);
        }
    };

    const boxStyle: CSSProperties = { left: percent(region.x), top: percent(region.y), width: percent(region.width), height: percent(region.height) };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            title={title}
            titleIcon="image"
            size="large"
            primary={{ text: 'Apply', icon: 'checkmark', variant: 'info', onClick: () => void apply(region), loading: isEncoding, disabled: !image }}
            secondary={{ text: 'Cancel', variant: 'plain', onClick: onCancel }}
            tertiary={
                allowFullImage ? { text: 'Use full image', variant: 'ghost', onClick: () => void apply(FULL_IMAGE), disabled: !image || isEncoding } : undefined
            }
        >
            <div className="ImageCropper">
                {loadError && <p className="ImageCropper_error">{loadError}</p>}

                <div className="ImageCropper_stage">
                    {previewUrl ? (
                        <div className="ImageCropper_frame" ref={frameRef} {...frameHandlers}>
                            <img className="ImageCropper_image" src={previewUrl} alt="" draggable={false} />
                            <div className="ImageCropper_box" style={boxStyle} onPointerDown={startDrag('move')}>
                                <span className="ImageCropper_grid" />
                                {HANDLES.map(handle => (
                                    <span key={handle} className={`ImageCropper_handle ImageCropper_handle--${handle}`} onPointerDown={startDrag(handle)} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        !loadError && <p className="ImageCropper_loading">Opening image…</p>
                    )}
                </div>

                <div className="ImageCropper_controls">
                    <Button size="small" variant="default" icon="synchronize" onClick={rotate} disabled={!image}>
                        Rotate
                    </Button>
                    <Button size="small" variant="ghost" icon="return" onClick={reset} disabled={!image}>
                        Reset
                    </Button>
                    {aspect && allowFreeAspect && (
                        <div className="ImageCropper_lock">
                            <ToggleSwitch size="small" checked={isLocked} onChange={toggleLock} />
                            <span>{aspectLabel}</span>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
