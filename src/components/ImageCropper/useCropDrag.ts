import { PointerEvent as ReactPointerEvent, RefObject, useRef } from 'react';

import type { CropRegion } from '../../helpers/ImageCrop';

import { type CropHandle, dragRegion } from './cropGeometry';

interface DragState {
    handle: CropHandle;
    pointerId: number;
    startX: number;
    startY: number;
    start: CropRegion;
    frameWidth: number;
    frameHeight: number;
}

interface UseCropDragOptions {
    frameRef: RefObject<HTMLDivElement | null>;
    region: CropRegion;
    onChange: (region: CropRegion) => void;
    imageWidth: number;
    imageHeight: number;
    aspect?: number;
}

/**
 * Pointer handling for the crop box. Pointer events cover mouse, pen and touch alike; the pressed
 * element captures the pointer, so a drag keeps working when it leaves the box, and its move/up
 * events bubble to the frame, which owns the handlers below.
 */
export const useCropDrag = ({ frameRef, region, onChange, imageWidth, imageHeight, aspect }: UseCropDragOptions) => {
    const dragRef = useRef<DragState | null>(null);

    const startDrag = (handle: CropHandle) => (event: ReactPointerEvent<HTMLElement>) => {
        const frame = frameRef.current;
        if (!frame || event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        const rect = frame.getBoundingClientRect();
        dragRef.current = {
            handle,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            start: region,
            frameWidth: rect.width,
            frameHeight: rect.height,
        };
    };

    const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        const dx = (event.clientX - drag.startX) / drag.frameWidth;
        const dy = (event.clientY - drag.startY) / drag.frameHeight;
        onChange(dragRegion(drag.start, drag.handle, dx, dy, imageWidth, imageHeight, aspect));
    };

    const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.pointerId === event.pointerId) {
            dragRef.current = null;
        }
    };

    return { startDrag, frameHandlers: { onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag } };
};
