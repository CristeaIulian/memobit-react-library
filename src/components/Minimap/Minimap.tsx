import React, { useCallback, useRef } from 'react';

import './Minimap.scss';

export interface MinimapBand {
    /** Region start as a fraction of total width (0..1). */
    start: number;
    /** Region end as a fraction of total width (0..1). */
    end: number;
    color: string;
}

export interface MinimapProps {
    /** Density value per bucket, ordered left to right. */
    buckets: number[];
    /** Visible window start as a fraction of total width (0..1). */
    viewportStart: number;
    /** Visible window end as a fraction of total width (0..1). */
    viewportEnd: number;
    /** Called with the desired window start fraction (0..1) when the user scrubs. */
    onScrub: (startFraction: number) => void;
    /** Optional colored regions drawn beneath the density bars. */
    bands?: MinimapBand[];
    /** Optional caption shown above the strip. */
    caption?: string;
    className?: string;
}

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const Minimap: React.FC<MinimapProps> = ({
    buckets,
    viewportStart,
    viewportEnd,
    onScrub,
    bands,
    caption,
    className = '',
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);

    const windowWidth = Math.max(0, viewportEnd - viewportStart);
    const maxValue = Math.max(1, ...buckets);

    const scrubToClientX = useCallback(
        (clientX: number) => {
            const track = trackRef.current;
            if (!track) return;
            const rect = track.getBoundingClientRect();
            const fraction = clamp01((clientX - rect.left) / rect.width);
            // Center the window on the cursor, keeping it within bounds.
            const start = Math.max(0, Math.min(1 - windowWidth, fraction - windowWidth / 2));
            onScrub(start);
        },
        [onScrub, windowWidth]
    );

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            draggingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            scrubToClientX(e.clientX);
        },
        [scrubToClientX]
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!draggingRef.current) return;
            scrubToClientX(e.clientX);
        },
        [scrubToClientX]
    );

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        draggingRef.current = false;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    }, []);

    return (
        <div className={`minimap ${className}`.trim()}>
            {caption && <div className="minimap__caption">{caption}</div>}
            <div
                ref={trackRef}
                className="minimap__track"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <div className="minimap__bars">
                    {buckets.map((value, i) => (
                        <span
                            key={i}
                            className="minimap__bar"
                            style={{ height: `${(value / maxValue) * 100}%` }}
                        />
                    ))}
                </div>

                {bands && bands.length > 0 && (
                    <div className="minimap__bands">
                        {bands.map((band, i) => (
                            <span
                                key={i}
                                className="minimap__band"
                                style={{
                                    left: `${clamp01(band.start) * 100}%`,
                                    width: `${clamp01(band.end - band.start) * 100}%`,
                                    background: band.color,
                                }}
                            />
                        ))}
                    </div>
                )}

                <div
                    className="minimap__viewport"
                    style={{
                        left: `${clamp01(viewportStart) * 100}%`,
                        width: `${clamp01(windowWidth) * 100}%`,
                    }}
                />
            </div>
        </div>
    );
};
