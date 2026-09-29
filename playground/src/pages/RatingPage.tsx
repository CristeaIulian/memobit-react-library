import React, { useState } from 'react';

import { Rating } from '../../../src';

export const RatingPage: React.FC = () => {
    const [fullRating, setFullRating] = useState(6);
    const [halfRating, setHalfRating] = useState(7);
    const [barRating, setBarRating] = useState(7);
    const [moodRating, setMoodRating] = useState(4);
    const [shortMood, setShortMood] = useState(2);
    const [hoverValue, setHoverValue] = useState<number | null>(null);

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
                <h2>Emoji Ratings</h2>
                <p>
                    A sad → happy mood scale. Unlike the other icons this is a pick-one scale rather than a cumulative fill: exactly the chosen face lights up
                    and the rest stay muted.
                </p>

                <div className="showcase-group">
                    <h3>Five faces</h3>
                    <div className="component-group">
                        <Rating icon="emoji" maxRate={5} rating={1} />
                    </div>
                    <div className="component-group">
                        <Rating icon="emoji" maxRate={5} rating={3} />
                    </div>
                    <div className="component-group">
                        <Rating icon="emoji" maxRate={5} rating={5} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Selectable</h3>
                    <p>Colour follows the mood by default: red at the sad end, amber in the middle, green at the happy end.</p>
                    <div className="component-group">
                        <Rating icon="emoji" maxRate={5} onSelect={setMoodRating} rating={moodRating} selectable />
                    </div>
                    <p>Selected: {moodRating}/5</p>
                </div>

                <div className="showcase-group">
                    <h3>A single variant instead of the mood colours</h3>
                    <p>
                        <code>emojiColorByMood={'{false}'}</code> tints every face with <code>variant</code> instead.
                    </p>
                    <div className="component-group">
                        <Rating emojiColorByMood={false} icon="emoji" maxRate={5} onSelect={setMoodRating} rating={moodRating} selectable variant="info" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Other scale lengths</h3>
                    <p>The expressions spread across however many faces there are.</p>
                    <div className="component-group">
                        <Rating icon="emoji" maxRate={3} onSelect={setShortMood} rating={Math.min(shortMood, 3)} selectable />
                    </div>
                    <div className="component-group">
                        <Rating icon="emoji" maxRate={7} onSelect={setShortMood} rating={shortMood} selectable />
                    </div>
                    <div className="component-group">
                        <Rating icon="emoji" maxRate={10} onSelect={setShortMood} rating={shortMood} selectable />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Sizes</h3>
                    <div className="component-group">
                        <Rating emojiSize={20} icon="emoji" maxRate={5} rating={4} showValue={false} />
                    </div>
                    <div className="component-group">
                        <Rating emojiSize={28} icon="emoji" maxRate={5} rating={4} showValue={false} />
                    </div>
                    <div className="component-group">
                        <Rating emojiSize={40} icon="emoji" maxRate={5} rating={4} showValue={false} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Without the value, and aligned</h3>
                    <div className="component-group">
                        <Rating align="space-between" icon="emoji" maxRate={5} rating={2} showValue={false} />
                    </div>
                    <div className="component-group">
                        <Rating align="right" icon="emoji" maxRate={5} rating={4} showValue={false} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Hover callbacks</h3>
                    <div className="component-group">
                        <Rating
                            icon="emoji"
                            maxRate={5}
                            onHover={setHoverValue}
                            onHoverEnd={() => setHoverValue(null)}
                            onSelect={setMoodRating}
                            rating={moodRating}
                            selectable
                        />
                    </div>
                    <p>Hover value: {hoverValue ?? 'none'}</p>
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
                    <h3>Hover Callbacks</h3>
                    <div className="component-group">
                        <Rating
                            rating={fullRating}
                            icon="star"
                            maxRate={10}
                            selectable
                            onSelect={setFullRating}
                            onHover={setHoverValue}
                            onHoverEnd={() => setHoverValue(null)}
                        />
                    </div>
                    <p>Hover value: {hoverValue ?? 'none'}</p>
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
