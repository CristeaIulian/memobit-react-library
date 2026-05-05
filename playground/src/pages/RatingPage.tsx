import React, { useState } from 'react';

import { Rating } from '../../../src';

export const RatingPage: React.FC = () => {
    const [fullRating, setFullRating] = useState(6);
    const [halfRating, setHalfRating] = useState(7);
    const [barRating, setBarRating] = useState(7);

    return (
        <div className="rating-page">
            <h1>Rating Component</h1>
            <p>A rating component for displaying and selecting ratings with stars or bullets.</p>

            <section className="page-section">
                <h2>Star Ratings</h2>
                <div className="showcase-group">
                    <h3>Stars</h3>
                    <div className="component-group">
                        <Rating rating={3} maxRate={10} />
                    </div>
                    <div className="component-group">
                        <Rating rating={7} maxRate={10} variant="info" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Half Stars</h3>
                    <div className="component-group">
                        <Rating rating={7} maxRate={10} useHalf />
                    </div>
                    <div className="component-group">
                        <Rating rating={7} maxRate={10} useHalf showValue={false} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Bullet Ratings</h2>
                <div className="showcase-group">
                    <h3>Rating as dots</h3>
                    <div className="component-group">
                        <Rating rating={3} maxRate={10} useHalf icon="bullet" variant="success" />
                    </div>
                    <div className="component-group">
                        <Rating rating={7} maxRate={10} icon="bullet" variant="warning" />
                    </div>
                    <div className="component-group">
                        <Rating rating={5} maxRate={10} useHalf icon="bullet" variant="danger" />
                    </div>
                    <div className="component-group">
                        <Rating rating={8} maxRate={10} icon="bullet" variant="info" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Bar Ratings</h2>
                <div className="showcase-group">
                    <h3>Rating as bars</h3>
                    <div className="component-group">
                        <Rating rating={3} maxRate={5} icon="bar" variant="warning" />
                    </div>
                    <div className="component-group">
                        <Rating rating={3} maxRate={10} icon="bar" variant="success" />
                    </div>
                    <div className="component-group">
                        <Rating rating={7} maxRate={10} icon="bar" variant="warning" />
                    </div>
                    <div className="component-group">
                        <Rating rating={5} maxRate={10} useHalf icon="bar" variant="danger" />
                    </div>
                    <div className="component-group">
                        <Rating rating={8} maxRate={10} icon="bar" variant="info" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Rating Alignment</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Rating rating={3} maxRate={10} useHalf align="left" />
                    </div>
                    <div className="component-group">
                        <Rating rating={3} maxRate={10} useHalf align="right" />
                    </div>
                    <div className="component-group">
                        <Rating rating={3} maxRate={10} align="space-between" />
                    </div>
                    <div className="component-group">
                        <Rating rating={5} maxRate={10} useHalf icon="bullet" align="left" />
                    </div>
                    <div className="component-group">
                        <Rating rating={8} maxRate={10} icon="bullet" align="right" />
                    </div>
                    <div className="component-group">
                        <Rating rating={8} maxRate={10} icon="bullet" align="space-between" />
                    </div>
                    <div className="component-group">
                        <Rating rating={5} maxRate={10} icon="bar" variant="info" align="left" />
                    </div>
                    <div className="component-group">
                        <Rating rating={8} maxRate={10} icon="bar" variant="info" align="right" />
                    </div>
                    <div className="component-group">
                        <Rating rating={8} maxRate={10} icon="bar" variant="info" align="space-between" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Selectable Rating</h2>

                <div className="showcase-group">
                    <h3>Full Stars</h3>
                    <div className="component-group">
                        <Rating rating={fullRating} maxRate={10} selectable onSelect={setFullRating} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Half Stars</h3>
                    <div className="component-group">
                        <Rating rating={halfRating} useHalf selectable onSelect={setHalfRating} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Half Bars</h3>
                    <div className="component-group">
                        <Rating rating={barRating} useHalf selectable icon="bar" variant="info" onSelect={setBarRating} />
                    </div>
                </div>
            </section>
        </div>
    );
};
