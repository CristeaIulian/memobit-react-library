import React, { useMemo, useState } from 'react';

import { Badge, Button, ProgressBar, TourHud } from '../../../src';

import './TourHudPage.scss';

interface TourStep {
    title: string;
    note?: string;
    label: string;
    metric: string;
    value: number;
    status: 'success' | 'warning' | 'info';
}

const productSteps: TourStep[] = [
    {
        title: 'Start with the revenue summary',
        note: 'The HUD stays anchored while the guided surface changes behind it.',
        label: 'Overview',
        metric: '$128.4k',
        value: 72,
        status: 'success',
    },
    {
        title: 'Review the retention dip',
        note: 'Use notes for extra context, cautions, or handoff details.',
        label: 'Retention',
        metric: '84%',
        value: 48,
        status: 'warning',
    },
    {
        title: 'Inspect the activation cohort',
        note: 'The stepLabel prop is handy for dates, versions, or chapters.',
        label: 'Activation',
        metric: '31.8%',
        value: 64,
        status: 'info',
    },
    {
        title: 'Finish with open work',
        note: 'Exit can close the tour, reset state, or return to the normal UI.',
        label: 'Tasks',
        metric: '12',
        value: 88,
        status: 'success',
    },
];

const releaseSteps = [
    {
        title: 'Baseline capture',
        note: 'Snapshot the current conversion funnel before the rollout starts.',
        phase: 'May 14',
    },
    {
        title: 'Feature flag enabled',
        note: 'Watch traffic, latency, and support volume in the same guided pass.',
        phase: 'May 15',
    },
    {
        title: 'Post-release review',
        note: 'Keep the HUD concise and move supporting detail into the surface.',
        phase: 'May 16',
    },
];

const clampStep = (value: number, total: number): number => Math.max(0, Math.min(total - 1, value));

export const TourHudPage: React.FC = () => {
    const [productIndex, setProductIndex] = useState(0);
    const [releaseIndex, setReleaseIndex] = useState(1);
    const [compactIndex, setCompactIndex] = useState(1);
    const [isProductTourVisible, setProductTourVisible] = useState(true);

    const productStep = productSteps[productIndex];
    const releaseStep = releaseSteps[releaseIndex];
    const productProgress = useMemo(() => ((productIndex + 1) / productSteps.length) * 100, [productIndex]);

    return (
        <div className="tour-hud-page">
            <h1>Tour HUD Component</h1>
            <p>A floating heads-up display for guided walkthroughs, history mode, and step-through review surfaces.</p>

            <section className="page-section">
                <h2>Guided Dashboard Tour</h2>

                <div className="showcase-group">
                    <h3>Controlled walkthrough with exit and restart</h3>

                    <div className="tour-hud-demo tour-hud-demo--dashboard">
                        <div className="tour-hud-demo__toolbar">
                            <div>
                                <strong>Growth workspace</strong>
                                <span>Weekly operating review</span>
                            </div>
                            <Badge variant={productStep.status}>{productStep.label}</Badge>
                        </div>

                        <div className="tour-hud-dashboard">
                            <div className="tour-hud-dashboard__panel tour-hud-dashboard__panel--main">
                                <span className="tour-hud-dashboard__eyebrow">Current focus</span>
                                <strong>{productStep.metric}</strong>
                                <ProgressBar value={productStep.value} state={productStep.status} label={productStep.label} labelPosition="below" />
                            </div>

                            <div className="tour-hud-dashboard__panel">
                                <span className="tour-hud-dashboard__eyebrow">Queue</span>
                                <strong>{productSteps.length - productIndex}</strong>
                                <p>Remaining review stops</p>
                            </div>

                            <div className="tour-hud-dashboard__panel">
                                <span className="tour-hud-dashboard__eyebrow">Progress</span>
                                <strong>{Math.round(productProgress)}%</strong>
                                <p>Walkthrough completion</p>
                            </div>
                        </div>

                        {isProductTourVisible ? (
                            <TourHud
                                label="Growth tour"
                                stepLabel={`Week ${productIndex + 22}`}
                                index={productIndex}
                                total={productSteps.length}
                                title={productStep.title}
                                note={productStep.note}
                                width={620}
                                onPrev={() => setProductIndex(index => clampStep(index - 1, productSteps.length))}
                                onNext={() => setProductIndex(index => clampStep(index + 1, productSteps.length))}
                                onExit={() => setProductTourVisible(false)}
                            />
                        ) : (
                            <div className="tour-hud-demo__restart">
                                <Button onClick={() => setProductTourVisible(true)} icon="play">
                                    Restart Tour
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>History Mode</h2>

                <div className="showcase-group">
                    <h3>Custom accent color for a release timeline</h3>

                    <div className="tour-hud-demo tour-hud-demo--timeline">
                        <div className="tour-hud-timeline">
                            {releaseSteps.map((step, index) => (
                                <button
                                    key={step.phase}
                                    type="button"
                                    className={`tour-hud-timeline__item ${index === releaseIndex ? 'is-active' : ''}`}
                                    onClick={() => setReleaseIndex(index)}
                                >
                                    <span>{step.phase}</span>
                                    <strong>{step.title}</strong>
                                </button>
                            ))}
                        </div>

                        <TourHud
                            className="tour-hud--release"
                            label="Release history"
                            stepLabel={releaseStep.phase}
                            index={releaseIndex}
                            total={releaseSteps.length}
                            title={releaseStep.title}
                            note={releaseStep.note}
                            width="560px"
                            onPrev={() => setReleaseIndex(index => clampStep(index - 1, releaseSteps.length))}
                            onNext={() => setReleaseIndex(index => clampStep(index + 1, releaseSteps.length))}
                            onExit={() => setReleaseIndex(0)}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Compact Copy</h2>

                <div className="showcase-group">
                    <h3>Short title without a note</h3>

                    <div className="tour-hud-demo tour-hud-demo--compact">
                        <div className="tour-hud-steps">
                            {[0, 1, 2].map(index => (
                                <Button key={index} size="small" variant={compactIndex === index ? 'info' : 'ghost'} onClick={() => setCompactIndex(index)}>
                                    Step {index + 1}
                                </Button>
                            ))}
                        </div>

                        <TourHud
                            label="Quick audit"
                            index={compactIndex}
                            total={3}
                            title={['Choose scope', 'Compare findings', 'Close review'][compactIndex]}
                            onPrev={() => setCompactIndex(index => clampStep(index - 1, 3))}
                            onNext={() => setCompactIndex(index => clampStep(index + 1, 3))}
                            onExit={() => setCompactIndex(0)}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
