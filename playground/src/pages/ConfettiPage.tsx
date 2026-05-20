import React, { useRef } from 'react';

import { Button, Confetti, ConfettiHandle } from '../../../src';

export const ConfettiPage: React.FC = () => {
    // One ref per demo
    const confettiFullRef = useRef<ConfettiHandle>(null);
    const burstFullRef = useRef<ConfettiHandle>(null);
    const fireworksFullRef = useRef<ConfettiHandle>(null);

    const confettiContRef = useRef<ConfettiHandle>(null);
    const burstContRef = useRef<ConfettiHandle>(null);
    const fireworksContRef = useRef<ConfettiHandle>(null);

    const customColorsRef = useRef<ConfettiHandle>(null);
    const longDurationRef = useRef<ConfettiHandle>(null);
    const shortDurationRef = useRef<ConfettiHandle>(null);
    const heavyRef = useRef<ConfettiHandle>(null);

    return (
        <div className="confetti-page">
            {/* Fullscreen canvases — rendered once at top level so they cover the whole viewport */}
            <Confetti ref={confettiFullRef} variant="confetti" scope="fullscreen" duration={3500} />
            <Confetti ref={burstFullRef} variant="burst" scope="fullscreen" duration={2500} />
            <Confetti ref={fireworksFullRef} variant="fireworks" scope="fullscreen" duration={4000} />
            <Confetti ref={longDurationRef} variant="confetti" scope="fullscreen" duration={6000} />
            <Confetti ref={shortDurationRef} variant="burst" scope="fullscreen" duration={1200} />
            <Confetti ref={heavyRef} variant="confetti" scope="fullscreen" duration={3500} particleCount={400} />
            <Confetti
                ref={customColorsRef}
                variant="fireworks"
                scope="fullscreen"
                duration={4000}
                colors={['#ff0080', '#ff8c00', '#ffe600', '#00ff99', '#00cfff', '#cc00ff']}
            />

            <h1>Confetti / Celebration Component</h1>
            <p>A canvas-based celebration component with three variants, triggered programmatically via a ref handle.</p>

            {/* ── Fullscreen variants ── */}
            <section className="page-section">
                <h2>Fullscreen Variants</h2>
                <p className="section-description">All three variants rendered as a full-screen overlay above the page.</p>

                <div className="showcase-group">
                    <div className="component-group">
                        <Button icon="confetti" onClick={() => confettiFullRef.current?.trigger()}>
                            Classic Confetti
                        </Button>
                        <Button icon="burst" onClick={() => burstFullRef.current?.trigger()}>
                            Burst
                        </Button>
                        <Button icon="fireworks" onClick={() => fireworksFullRef.current?.trigger()}>
                            Fireworks
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Container scoped ── */}
            <section className="page-section">
                <h2>Container Scoped</h2>
                <p className="section-description">
                    Use <code>scope="container"</code> to confine the animation to a parent element. The parent must have <code>position: relative</code> and a
                    defined size.
                </p>

                <div className="showcase-group">
                    <div className="component-group" style={{ gap: '16px', flexDirection: 'column' }}>
                        <div
                            className="confetti-demo-box"
                            style={{
                                position: 'relative',
                                height: '160px',
                                border: '2px dashed #cbd5e1',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            <Confetti ref={confettiContRef} variant="confetti" scope="container" duration={3000} />
                            <Button icon="confetti" onClick={() => confettiContRef.current?.trigger()}>
                                Confetti here
                            </Button>
                        </div>

                        <div
                            className="confetti-demo-box"
                            style={{
                                position: 'relative',
                                height: '160px',
                                border: '2px dashed #cbd5e1',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            <Confetti ref={burstContRef} variant="burst" scope="container" duration={2500} />
                            <Button icon="burst" onClick={() => burstContRef.current?.trigger()}>
                                Burst here
                            </Button>
                        </div>

                        <div
                            className="confetti-demo-box"
                            style={{
                                position: 'relative',
                                height: '160px',
                                border: '2px dashed #cbd5e1',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            <Confetti ref={fireworksContRef} variant="fireworks" scope="container" duration={4000} />
                            <Button icon="fireworks" onClick={() => fireworksContRef.current?.trigger()}>
                                Fireworks here
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Custom colors ── */}
            <section className="page-section">
                <h2>Custom Colors</h2>
                <p className="section-description">
                    Pass a <code>colors</code> array to override the theme defaults. Falls back to CSS variable tokens when not provided.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <Button icon="rainbow" onClick={() => customColorsRef.current?.trigger()}>
                            Neon Fireworks
                        </Button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        {['#ff0080', '#ff8c00', '#ffe600', '#00ff99', '#00cfff', '#cc00ff'].map(c => (
                            <div key={c} style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: c, border: '1px solid #e2e8f0' }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Duration control ── */}
            <section className="page-section">
                <h2>Duration Control</h2>
                <p className="section-description">
                    Use the <code>duration</code> prop (in ms) to control how long the animation runs.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <Button icon="lightning" onClick={() => shortDurationRef.current?.trigger()}>
                            Short (1.2s burst)
                        </Button>
                        <Button icon="wait" onClick={() => longDurationRef.current?.trigger()}>
                            Long (6s confetti)
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Particle count ── */}
            <section className="page-section">
                <h2>Particle Count</h2>
                <p className="section-description">
                    Override the default particle count per variant using the <code>particleCount</code> prop.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <Button icon="snow" onClick={() => heavyRef.current?.trigger()}>
                            Heavy Confetti (400 particles)
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Usage notes ── */}
            <section className="page-section">
                <h2>Usage</h2>
                <div className="showcase-group">
                    <pre style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                        {`// 1. Create a ref
const confettiRef = useRef<ConfettiHandle>(null);

// 2. Render the component (once, near the top of your tree)
<Confetti
    ref={confettiRef}
    variant="fireworks"   // 'confetti' | 'burst' | 'fireworks'
    scope="fullscreen"    // 'fullscreen' | 'container'
    duration={4000}       // ms
    colors={['#ff0080']}  // optional, falls back to theme vars
    particleCount={80}    // optional, overrides per-variant default
/>

// 3. Trigger anywhere
confettiRef.current?.trigger();`}
                    </pre>
                </div>
            </section>
        </div>
    );
};
