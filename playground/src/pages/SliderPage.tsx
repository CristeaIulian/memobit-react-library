import React, { useState } from 'react';

import { Slider } from '../../../src';

export const SliderPage: React.FC = () => {
    const [sliderValue1, setSliderValue1] = useState<number>(50);
    const [sliderValue2, setSliderValue2] = useState<number>(7);
    const [fractionalValue, setFractionalValue] = useState<number>(0.7);
    const [matchValue, setMatchValue] = useState<number>(1.4);
    const [thinValue, setThinValue] = useState<number>(60);
    const [thinInlineValue, setThinInlineValue] = useState<number>(2.5);
    const [valueSizeValue, setValueSizeValue] = useState<number>(65);
    const [verticalValue, setVerticalValue] = useState<number>(40);
    const [verticalThinValue, setVerticalThinValue] = useState<number>(70);

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

                <div className="showcase-group">
                    <h3>Fractional step (0.5 – 0.95, step 0.05)</h3>
                    <p>The displayed value follows the step's decimal precision.</p>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Slider value={fractionalValue} onChange={setFractionalValue} min={0.5} max={0.95} step={0.05} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>showValueAtTheRight — compact form-row layout</h3>
                    <p>Value label height matches the slider thumb (~24px). Useful inside form rows where a tall stacked number takes too much space.</p>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Slider
                            value={matchValue}
                            onChange={setMatchValue}
                            min={0.1}
                            max={3.0}
                            step={0.1}
                            showValueAtTheRight
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Thin variant</h2>

                <div className="showcase-group">
                    <h3>thin — standard layout</h3>
                    <p>Smaller track (4px) and thumb (16px).</p>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Slider value={thinValue} onChange={setThinValue} min={0} max={100} thin />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>thin + showValueAtTheRight</h3>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Slider
                            value={thinInlineValue}
                            onChange={setThinInlineValue}
                            min={0.1}
                            max={5.0}
                            step={0.1}
                            thin
                            showValueAtTheRight
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Value size</h2>

                <div className="showcase-group">
                    <h3>valueSize="sm" (normal track)</h3>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Slider value={valueSizeValue} onChange={setValueSizeValue} min={0} max={100} valueSize="sm" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>valueSize="xxl" (thin track — overrides thin default)</h3>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Slider value={valueSizeValue} onChange={setValueSizeValue} min={0} max={100} thin valueSize="xxl" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>valueSize="xs" (inline)</h3>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Slider value={valueSizeValue} onChange={setValueSizeValue} min={0} max={100} showValueAtTheRight valueSize="xs" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Vertical variant</h2>

                <div className="showcase-group" style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
                    <div>
                        <h3>vertical</h3>
                        <Slider value={verticalValue} onChange={setVerticalValue} min={0} max={100} vertical />
                    </div>

                    <div>
                        <h3>vertical + thin</h3>
                        <Slider value={verticalThinValue} onChange={setVerticalThinValue} min={0} max={100} vertical thin />
                    </div>

                    <div>
                        <h3>vertical, no values</h3>
                        <Slider value={verticalValue} onChange={setVerticalValue} min={0} max={100} vertical showValues={false} />
                    </div>
                </div>
            </section>
        </div>
    );
};
