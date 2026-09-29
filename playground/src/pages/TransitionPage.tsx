import React, { useState } from 'react';

import { Button, Card, ToggleSwitch, Transition, type TransitionType } from '../../../src';

import './TransitionPage.scss';

const TYPES: TransitionType[] = ['fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale', 'collapse'];

const Panel: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div className="transition-demo-panel">{children ?? 'I animate in and out.'}</div>
);

export const TransitionPage: React.FC = () => {
    const [isShown, setIsShown] = useState(true);
    const [openTypes, setOpenTypes] = useState<Record<string, boolean>>(() => Object.fromEntries(TYPES.map(type => [type, true])));
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [items, setItems] = useState([1, 2, 3]);
    const [isStaggered, setIsStaggered] = useState(true);
    const [isKeptMounted, setIsKeptMounted] = useState(true);
    const [log, setLog] = useState<string[]>([]);
    const [hasGrown, setHasGrown] = useState(false);

    const appendLog = (entry: string) => setLog(current => [entry, ...current].slice(0, 6));

    return (
        <div className="transition-page">
            <h1>Transition</h1>
            <p>
                Wraps a piece of UI and plays an enter animation when <code>show</code> turns true, an exit animation when it turns false — and only unmounts
                once the exit has finished. Duration, delay and easing come in as props; the movement itself lives in CSS.
            </p>

            <section className="page-section">
                <h2>Every type</h2>

                <div className="showcase-group">
                    <h3>Toggle them individually</h3>
                    <div className="transition-demo-grid">
                        {TYPES.map(type => (
                            <div className="transition-demo-cell" key={type}>
                                <Button
                                    onClick={() => setOpenTypes(current => ({ ...current, [type]: !current[type] }))}
                                    size="small"
                                    variant={openTypes[type] ? 'info' : 'default'}
                                >
                                    {type}
                                </Button>
                                <div className="transition-demo-stage">
                                    <Transition show={openTypes[type]} type={type}>
                                        <Panel>{type}</Panel>
                                    </Transition>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Unmounting</h2>

                <div className="showcase-group">
                    <h3>The element leaves the DOM after the exit animation</h3>
                    <div className="component-group">
                        <ToggleSwitch checked={isShown} offLabel="Hidden" onChange={setIsShown} />
                    </div>
                    <div className="transition-demo-stage">
                        <Transition duration={400} onEntered={() => appendLog('entered')} onExited={() => appendLog('exited')} show={isShown} type="scale">
                            <Panel>Watch the callbacks below.</Panel>
                        </Transition>
                    </div>
                    <p>Log: {log.length > 0 ? log.join(' ← ') : 'toggle the switch'}</p>
                </div>

                <div className="showcase-group">
                    <h3>keepMounted</h3>
                    <p>
                        With <code>keepMounted</code> the element is hidden instead of removed — for content that is expensive to rebuild, like an iframe or a
                        chart.
                    </p>
                    <div className="component-group">
                        <ToggleSwitch checked={isKeptMounted} offLabel="Hidden" onChange={setIsKeptMounted} />
                    </div>
                    <div className="transition-demo-stage">
                        <Transition keepMounted show={isKeptMounted} type="fade">
                            <Panel>Still in the DOM when hidden.</Panel>
                        </Transition>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Collapse</h2>

                <div className="showcase-group">
                    <h3>Height animated from a measurement</h3>
                    <p>
                        <code>collapse</code> measures the open height and animates to it, then releases to <code>auto</code> so the section can follow content
                        that changes later.
                    </p>
                    <div className="component-group">
                        <Button onClick={() => setIsCollapsed(current => !current)} variant="info">
                            {isCollapsed ? 'Expand' : 'Collapse'}
                        </Button>
                        <Button onClick={() => setHasGrown(current => !current)} variant="default">
                            {hasGrown ? 'Shrink' : 'Grow'} the content
                        </Button>
                    </div>
                    <Transition duration={300} show={!isCollapsed} type="collapse">
                        <Card title="Details">
                            <p>A collapsing section, animated by height rather than by opacity alone.</p>
                            {hasGrown && (
                                <>
                                    <p>Extra content added after the section was already open.</p>
                                    <p>Because the height was released to auto, the section simply grows with it.</p>
                                </>
                            )}
                        </Card>
                    </Transition>
                </div>
            </section>

            <section className="page-section">
                <h2>Timing</h2>

                <div className="showcase-group">
                    <h3>Duration and easing</h3>
                    <div className="component-group">
                        <ToggleSwitch checked={isShown} offLabel="Hidden" onChange={setIsShown} />
                    </div>
                    <div className="transition-demo-grid">
                        <div className="transition-demo-cell">
                            <span className="transition-demo-caption">120ms</span>
                            <div className="transition-demo-stage">
                                <Transition duration={120} show={isShown} type="slide-up">
                                    <Panel>fast</Panel>
                                </Transition>
                            </div>
                        </div>
                        <div className="transition-demo-cell">
                            <span className="transition-demo-caption">400ms</span>
                            <div className="transition-demo-stage">
                                <Transition duration={400} show={isShown} type="slide-up">
                                    <Panel>medium</Panel>
                                </Transition>
                            </div>
                        </div>
                        <div className="transition-demo-cell">
                            <span className="transition-demo-caption">900ms, bouncy</span>
                            <div className="transition-demo-stage">
                                <Transition duration={900} easing="cubic-bezier(0.34, 1.56, 0.64, 1)" show={isShown} type="scale">
                                    <Panel>bouncy</Panel>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Staggered list</h3>
                    <p>
                        A per-item <code>delay</code> turns a list into a cascade.
                    </p>
                    <div className="component-group">
                        <ToggleSwitch checked={isStaggered} offLabel="Hidden" onChange={setIsStaggered} />
                        <Button onClick={() => setItems(current => [...current, current.length + 1])} size="small" variant="default">
                            Add an item
                        </Button>
                    </div>
                    <ul className="transition-demo-list">
                        {items.map((item, index) => (
                            <Transition as="li" delay={index * 80} key={item} show={isStaggered} type="slide-right">
                                <Panel>Item {item}</Panel>
                            </Transition>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="page-section">
                <h2>appear</h2>

                <div className="showcase-group">
                    <h3>Animating on first mount</h3>
                    <p>
                        By default a Transition that starts open is simply open, with no animation on load. <code>appear</code> plays the enter animation on the
                        first render too — reload the page to see the difference.
                    </p>
                    <div className="transition-demo-grid">
                        <div className="transition-demo-cell">
                            <span className="transition-demo-caption">without appear</span>
                            <div className="transition-demo-stage">
                                <Transition duration={800} show type="slide-up">
                                    <Panel>instant</Panel>
                                </Transition>
                            </div>
                        </div>
                        <div className="transition-demo-cell">
                            <span className="transition-demo-caption">with appear</span>
                            <div className="transition-demo-stage">
                                <Transition appear duration={800} show type="slide-up">
                                    <Panel>animated in</Panel>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
