import React, { useState } from 'react';

import { AngleSlider } from '../../../src';

export const AngleSliderPage: React.FC = () => {
    const [heading, setHeading] = useState(45);
    const [gradient, setGradient] = useState(135);
    const [rotation, setRotation] = useState(0);
    const [arc, setArc] = useState(90);
    const [snapped, setSnapped] = useState(90);

    return (
        <div className="angle-slider-page">
            <h1>Angle Slider</h1>
            <p>
                A dial for picking an angle. Zero sits at twelve o&apos;clock and grows clockwise. Drag anywhere on the dial, or focus it and use the arrow keys —
                Page Up/Down jump ten steps, Home and End go to the ends.
            </p>

            <section className="page-section">
                <h2>Basic</h2>

                <div className="showcase-group">
                    <h3>Full turn</h3>
                    <div className="component-group">
                        <AngleSlider label="Heading" onChange={setHeading} value={heading} />
                        <AngleSlider label="Gradient" onChange={setGradient} value={gradient} variant="info" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Without the readout</h3>
                    <div className="component-group">
                        <AngleSlider label="Rotation" onChange={setRotation} showValue={false} value={rotation} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Variants</h2>

                <div className="showcase-group">
                    <h3>Accent colours</h3>
                    <div className="component-group">
                        <AngleSlider label="accent" onChange={setHeading} value={heading} variant="accent" />
                        <AngleSlider label="info" onChange={setHeading} value={heading} variant="info" />
                        <AngleSlider label="success" onChange={setHeading} value={heading} variant="success" />
                        <AngleSlider label="warning" onChange={setHeading} value={heading} variant="warning" />
                        <AngleSlider label="danger" onChange={setHeading} value={heading} variant="danger" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Sizes</h2>

                <div className="showcase-group">
                    <h3>From compact to prominent</h3>
                    <div className="component-group">
                        <AngleSlider label="72" onChange={setGradient} size={72} value={gradient} />
                        <AngleSlider label="120" onChange={setGradient} size={120} value={gradient} />
                        <AngleSlider label="180" onChange={setGradient} size={180} value={gradient} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Steps and ticks</h2>

                <div className="showcase-group">
                    <h3>Snapping to 15°</h3>
                    <div className="component-group">
                        <AngleSlider label="15° steps" onChange={setSnapped} step={15} tickStep={15} value={snapped} variant="success" />
                        <AngleSlider label="45° steps" onChange={setSnapped} step={45} tickStep={45} value={snapped} variant="success" />
                        <AngleSlider label="90° steps" onChange={setSnapped} step={90} tickStep={90} value={snapped} variant="success" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>No ticks</h3>
                    <div className="component-group">
                        <AngleSlider label="Free" onChange={setGradient} tickStep={0} value={gradient} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Partial range</h2>

                <div className="showcase-group">
                    <h3>Clamped between min and max</h3>
                    <p>A tilt control that only allows a quarter turn either side of centre.</p>
                    <div className="component-group">
                        <AngleSlider label="Tilt (0–90°)" max={90} min={0} onChange={setArc} tickStep={15} value={arc} variant="warning" />
                        <AngleSlider label="Fan (0–180°)" max={180} min={0} onChange={setArc} tickStep={30} value={arc} variant="warning" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Disabled</h2>

                <div className="showcase-group">
                    <div className="component-group">
                        <AngleSlider disabled label="Locked" onChange={setHeading} value={210} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Driving something with it</h2>

                <div className="showcase-group">
                    <h3>Live gradient angle</h3>
                    <div className="component-group">
                        <AngleSlider label="Angle" onChange={setGradient} value={gradient} variant="info" />
                        <div
                            style={{
                                background: `linear-gradient(${gradient}deg, var(--rating-color-info), var(--rating-color-warning))`,
                                borderRadius: 'var(--radius)',
                                height: 140,
                                width: 220,
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
