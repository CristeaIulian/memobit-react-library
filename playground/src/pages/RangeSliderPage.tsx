import React, { useState } from 'react';

import { formatMoney, RangeSlider, type RangeSliderValue } from '../../../src';

export const RangeSliderPage: React.FC = () => {
    const [basic, setBasic] = useState<RangeSliderValue>([20, 70]);
    const [price, setPrice] = useState<RangeSliderValue>([150, 850]);
    const [year, setYear] = useState<RangeSliderValue>([2015, 2022]);
    const [rating, setRating] = useState<RangeSliderValue>([2.5, 4.5]);
    const [hours, setHours] = useState<RangeSliderValue>([9, 17]);
    const [settled, setSettled] = useState<RangeSliderValue>([30, 60]);
    const [committed, setCommitted] = useState<RangeSliderValue | null>(null);

    return (
        <div className="range-slider-page">
            <h1>Range Slider</h1>
            <p>
                Two thumbs over one track for picking a lower and an upper bound. Neither thumb crosses the other, clicking the bare track jumps the nearer
                thumb, and a focused thumb takes the arrow keys, Page Up/Down, Home and End.
            </p>

            <section className="page-section">
                <h2>Basic</h2>

                <div className="showcase-group">
                    <h3>Zero to a hundred</h3>
                    <RangeSlider label="Range" onChange={setBasic} value={basic} />
                    <p>
                        Value: [{basic[0]}, {basic[1]}]
                    </p>
                </div>

                <div className="showcase-group">
                    <h3>Without the readout</h3>
                    <RangeSlider onChange={setBasic} showValues={false} value={basic} />
                </div>
            </section>

            <section className="page-section">
                <h2>Variants</h2>

                <div className="showcase-group">
                    <h3>Accent colours</h3>
                    <RangeSlider label="accent" onChange={setBasic} value={basic} variant="accent" />
                    <RangeSlider label="info" onChange={setBasic} value={basic} variant="info" />
                    <RangeSlider label="success" onChange={setBasic} value={basic} variant="success" />
                    <RangeSlider label="warning" onChange={setBasic} value={basic} variant="warning" />
                    <RangeSlider label="danger" onChange={setBasic} value={basic} variant="danger" />
                </div>

                <div className="showcase-group">
                    <h3>Thin</h3>
                    <RangeSlider label="Thin track" onChange={setBasic} thin value={basic} variant="info" />
                </div>
            </section>

            <section className="page-section">
                <h2>Formatted values</h2>

                <div className="showcase-group">
                    <h3>Money</h3>
                    <RangeSlider
                        formatValue={value => formatMoney(value)}
                        label="Price"
                        max={2000}
                        min={0}
                        onChange={setPrice}
                        step={50}
                        value={price}
                        variant="success"
                    />
                </div>

                <div className="showcase-group">
                    <h3>Years, with ticks</h3>
                    <RangeSlider
                        formatValue={value => String(value)}
                        label="Model year"
                        max={2026}
                        min={2010}
                        onChange={setYear}
                        tickStep={4}
                        value={year}
                        variant="info"
                    />
                </div>

                <div className="showcase-group">
                    <h3>Hours of the day</h3>
                    <RangeSlider
                        formatValue={value => `${String(value).padStart(2, '0')}:00`}
                        label="Opening hours"
                        max={24}
                        min={0}
                        onChange={setHours}
                        tickStep={6}
                        value={hours}
                    />
                </div>
            </section>

            <section className="page-section">
                <h2>Fractional steps</h2>

                <div className="showcase-group">
                    <h3>Half stars</h3>
                    <p>The decimal places in the readout follow the step, so no float artefacts leak through.</p>
                    <RangeSlider label="Rating" max={5} min={0} onChange={setRating} step={0.5} tickStep={1} value={rating} variant="warning" />
                </div>
            </section>

            <section className="page-section">
                <h2>Minimum distance</h2>

                <div className="showcase-group">
                    <h3>The thumbs stay 20 apart</h3>
                    <p>Useful when a degenerate range would be meaningless — an empty filter, say.</p>
                    <RangeSlider label="At least 20 wide" minDistance={20} onChange={setBasic} value={basic} variant="danger" />
                </div>
            </section>

            <section className="page-section">
                <h2>onChangeEnd</h2>

                <div className="showcase-group">
                    <h3>Fire a query only once the drag settles</h3>
                    <RangeSlider label="Filter" onChange={setSettled} onChangeEnd={setCommitted} value={settled} />
                    <p>
                        Live: [{settled[0]}, {settled[1]}] — committed: {committed ? `[${committed[0]}, ${committed[1]}]` : 'nothing yet'}
                    </p>
                </div>
            </section>

            <section className="page-section">
                <h2>Disabled</h2>

                <div className="showcase-group">
                    <RangeSlider disabled label="Locked" onChange={() => undefined} value={[25, 75]} />
                </div>
            </section>
        </div>
    );
};
