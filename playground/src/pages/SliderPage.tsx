import React, { useState } from 'react';

import { Slider } from '../../../src';

export const SliderPage: React.FC = () => {
    const [sliderValue1, setSliderValue1] = useState<number>(50);
    const [sliderValue2, setSliderValue2] = useState<number>(7);

    return (
        <div className="slider-page">
            <h1>Slider Component</h1>
            <p>A slider component for selecting values from a range.</p>

            <section className="page-section">
                <h2>Slider Examples</h2>

                <div className="showcase-group">
                    <h3>Slider (0-100 range)</h3>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Slider value={sliderValue1} onChange={setSliderValue1} min={0} max={100} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Slider (1-10 range)</h3>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Slider value={sliderValue2} onChange={setSliderValue2} min={1} max={10} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Slider without display</h3>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Slider value={sliderValue1} onChange={setSliderValue1} showValues={false} />
                    </div>
                </div>
            </section>
        </div>
    );
};
