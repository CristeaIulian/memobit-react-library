import React, { useState } from 'react';

import { Button, DirectionPad, type DirectionPadDirection } from '../../../src';

const STEP = 12;
const LIMIT = 48;

const clamp = (value: number): number => Math.max(-LIMIT, Math.min(LIMIT, value));

export const DirectionPadPage: React.FC = () => {
    const [lastDirection, setLastDirection] = useState<DirectionPadDirection | undefined>();
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const move = (direction: DirectionPadDirection): void => {
        setLastDirection(direction);
        setPosition(current => {
            switch (direction) {
                case 'up':
                    return { ...current, y: clamp(current.y - STEP) };
                case 'down':
                    return { ...current, y: clamp(current.y + STEP) };
                case 'left':
                    return { ...current, x: clamp(current.x - STEP) };
                case 'right':
                    return { ...current, x: clamp(current.x + STEP) };
            }
        });
    };

    return (
        <div className="direction-pad-page">
            <h1>Direction Pad</h1>
            <p>
                A round pan/tilt pad: four arrows around a centre hub, like a camera app&apos;s joystick. One <code>onDirection</code> callback receives{' '}
                <code>&apos;up&apos;</code>, <code>&apos;down&apos;</code>, <code>&apos;left&apos;</code> or <code>&apos;right&apos;</code>.
            </p>

            <section className="page-section">
                <h2>Sizes</h2>

                <div className="showcase-group">
                    <h3>Compact and large</h3>
                    <p>Compact sits beside a row of small buttons; large fills a settings section.</p>
                    <div className="component-group">
                        <DirectionPad onDirection={setLastDirection} />
                        <DirectionPad onDirection={setLastDirection} size="large" />
                        <span>Last pressed: {lastDirection ?? '—'}</span>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Floating</h2>

                <div className="showcase-group">
                    <h3>Translucent, over a video or image</h3>
                    <div className="component-group">
                        <div
                            style={{
                                alignItems: 'flex-end',
                                background: 'linear-gradient(135deg, var(--rating-color-info), var(--rating-color-warning))',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                height: 180,
                                justifyContent: 'flex-end',
                                padding: 'var(--spacing-12)',
                                width: 320,
                            }}
                        >
                            <DirectionPad floating onDirection={setLastDirection} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Centre slot</h2>

                <div className="showcase-group">
                    <h3>A button in the hub</h3>
                    <p>
                        Pass <code>center</code> to replace the plain hub, here with a &quot;home&quot; button that resets the position.
                    </p>
                    <div className="component-group">
                        <DirectionPad
                            center={<Button borders="rounded" icon="home" onClick={() => setPosition({ x: 0, y: 0 })} size="small" />}
                            onDirection={move}
                            size="large"
                        />
                        <div
                            style={{
                                alignItems: 'center',
                                border: '1px solid var(--card-border-color)',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                height: 120,
                                justifyContent: 'center',
                                width: 120,
                            }}
                        >
                            <div
                                style={{
                                    background: 'var(--rating-color-info)',
                                    borderRadius: 'var(--radius-full)',
                                    height: 16,
                                    transform: `translate(${position.x}px, ${position.y}px)`,
                                    transition: 'transform var(--transition-fast)',
                                    width: 16,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Disabled</h2>

                <div className="showcase-group">
                    <div className="component-group">
                        <DirectionPad disabled onDirection={setLastDirection} />
                        <DirectionPad disabled onDirection={setLastDirection} size="large" />
                    </div>
                </div>
            </section>
        </div>
    );
};
