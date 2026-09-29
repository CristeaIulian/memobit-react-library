import React from 'react';

import { Blockquote } from '../../../src';

export const BlockquotePage: React.FC = () => (
    <div className="blockquote-page">
        <h1>Blockquote</h1>
        <p>
            A quotation with optional attribution. Four appearances — a left rule, a filled card, bare text, or a large pull quote — each tintable with the
            semantic variants.
        </p>

        <section className="page-section">
            <h2>Appearances</h2>

            <div className="showcase-group">
                <h3>bar (default)</h3>
                <Blockquote author="Rich Hickey" source="Simple Made Easy">
                    Simplicity is a choice — it is your responsibility to pursue it.
                </Blockquote>
            </div>

            <div className="showcase-group">
                <h3>card</h3>
                <Blockquote appearance="card" author="Rich Hickey" source="Simple Made Easy">
                    Simplicity is a choice — it is your responsibility to pursue it.
                </Blockquote>
            </div>

            <div className="showcase-group">
                <h3>plain</h3>
                <Blockquote appearance="plain" author="Rich Hickey">
                    Simplicity is a choice — it is your responsibility to pursue it.
                </Blockquote>
            </div>

            <div className="showcase-group">
                <h3>pull</h3>
                <p>Larger, centred by default, and set in the display font — for breaking up a long page.</p>
                <Blockquote appearance="pull" author="Rich Hickey" source="Simple Made Easy" variant="accent">
                    Simplicity is a choice.
                </Blockquote>
            </div>
        </section>

        <section className="page-section">
            <h2>Variants</h2>

            <div className="showcase-group">
                <h3>Semantic tints</h3>
                <Blockquote variant="default">The default tint, for an ordinary quotation.</Blockquote>
                <Blockquote variant="accent">Accent, matching the theme.</Blockquote>
                <Blockquote variant="info">Info, for an aside or a note.</Blockquote>
                <Blockquote variant="success">Success, for a confirmed result.</Blockquote>
                <Blockquote variant="warning">Warning, for something to be careful about.</Blockquote>
                <Blockquote variant="danger">Danger, for a consequence that cannot be undone.</Blockquote>
            </div>

            <div className="showcase-group">
                <h3>As callouts</h3>
                <p>The card appearance with an icon reads as a documentation callout.</p>
                <Blockquote appearance="card" icon="information" variant="info">
                    The library ships a single shared source — a rebuild reaches every app.
                </Blockquote>
                <Blockquote appearance="card" icon="alarm" variant="warning">
                    Deploying <code>Online/*</code> needs the build step before the deploy step.
                </Blockquote>
            </div>
        </section>

        <section className="page-section">
            <h2>Sizes</h2>

            <div className="showcase-group">
                <h3>sm, md, lg</h3>
                <Blockquote size="sm" variant="accent">
                    Small — for a footnote or a caption-weight aside.
                </Blockquote>
                <Blockquote size="md" variant="accent">
                    Medium — the default, matching body copy.
                </Blockquote>
                <Blockquote size="lg" variant="accent">
                    Large — when the quote is the point of the section.
                </Blockquote>
            </div>
        </section>

        <section className="page-section">
            <h2>Attribution</h2>

            <div className="showcase-group">
                <h3>Author, source, both, neither</h3>
                <Blockquote author="Edsger W. Dijkstra">Simplicity is prerequisite for reliability.</Blockquote>
                <Blockquote source="The Elements of Style">Vigorous writing is concise.</Blockquote>
                <Blockquote author="Antoine de Saint-Exupéry" source="Terre des Hommes">
                    Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.
                </Blockquote>
                <Blockquote>No attribution at all — just the quote.</Blockquote>
            </div>

            <div className="showcase-group">
                <h3>Linked source</h3>
                <p>
                    Passing <code>href</code> turns the source into a link and sets the <code>cite</code> attribute on the quote.
                </p>
                <Blockquote appearance="card" author="MDN" href="https://developer.mozilla.org/" source="Web Docs" variant="info">
                    The <code>blockquote</code> element indicates that the enclosed text is an extended quotation.
                </Blockquote>
            </div>
        </section>

        <section className="page-section">
            <h2>Quote mark</h2>

            <div className="showcase-group">
                <h3>Decorative glyph behind the text</h3>
                <Blockquote appearance="card" author="Alan Kay" showQuoteMark variant="accent">
                    The best way to predict the future is to invent it.
                </Blockquote>
                <Blockquote appearance="pull" author="Alan Kay" showQuoteMark variant="info">
                    The best way to predict the future is to invent it.
                </Blockquote>
            </div>
        </section>

        <section className="page-section">
            <h2>Alignment</h2>

            <div className="showcase-group">
                <h3>Centring a pull quote, or un-centring it</h3>
                <Blockquote align="center" appearance="plain" author="Donald Knuth" size="lg" variant="accent">
                    Premature optimization is the root of all evil.
                </Blockquote>
                <Blockquote align="left" appearance="pull" author="Donald Knuth" variant="accent">
                    A pull quote forced back to the left.
                </Blockquote>
            </div>
        </section>

        <section className="page-section">
            <h2>Longer content</h2>

            <div className="showcase-group">
                <h3>Multiple paragraphs</h3>
                <Blockquote appearance="card" author="Review notes" source="Sprint 42" variant="info">
                    <p>
                        The migration went through in one pass. Every app picked the new tokens up from the shared build, and nothing needed a per-project
                        override afterwards.
                    </p>
                    <p>The only surprise was the tablet breakpoint, which had been carrying a hardcoded column count for about a year.</p>
                </Blockquote>
            </div>
        </section>
    </div>
);
