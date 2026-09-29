import React, { useEffect, useState } from 'react';

import { Button, Card, RollingNumber } from '../../../src';

export const RollingNumberPage: React.FC = () => {
    const [count, setCount] = useState(1234);
    const [money, setMoney] = useState(48250.75);
    const [score, setScore] = useState(0);
    const [live, setLive] = useState(9840);
    const [isTicking, setIsTicking] = useState(false);

    // A live feed is the case this component exists for, so one is wired up here.
    useEffect(() => {
        if (!isTicking) return;

        const timer = setInterval(() => setLive(current => current + Math.floor(Math.random() * 400) - 120), 900);

        return () => clearInterval(timer);
    }, [isTicking]);

    return (
        <div className="rolling-number-page">
            <h1>Rolling Number</h1>
            <p>
                An odometer readout: each digit column slides to its new value, the units place leading and the rest following. Separators and affixes stay put.
                Mounting is silent — only a genuine change animates.
            </p>

            <section className="page-section">
                <h2>Basic</h2>

                <div className="showcase-group">
                    <h3>Change the value</h3>
                    <div className="component-group">
                        <RollingNumber value={count} />
                    </div>
                    <div className="component-group">
                        <Button onClick={() => setCount(current => current + 1)} variant="default">
                            +1
                        </Button>
                        <Button onClick={() => setCount(current => current + 111)} variant="default">
                            +111
                        </Button>
                        <Button onClick={() => setCount(current => current + 8766)} variant="default">
                            +8766
                        </Button>
                        <Button onClick={() => setCount(current => Math.max(0, current - 999))} variant="default">
                            −999
                        </Button>
                        <Button onClick={() => setCount(Math.floor(Math.random() * 1000000))} variant="info">
                            Random
                        </Button>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Sizes</h2>

                <div className="showcase-group">
                    <h3>From sm to xxxl</h3>
                    <div className="component-group">
                        <RollingNumber size="sm" value={count} />
                        <RollingNumber size="md" value={count} />
                        <RollingNumber size="lg" value={count} />
                        <RollingNumber size="xl" value={count} />
                        <RollingNumber size="xxl" value={count} />
                        <RollingNumber size="xxxl" value={count} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Variants</h2>

                <div className="showcase-group">
                    <h3>Fixed colours</h3>
                    <div className="component-group">
                        <RollingNumber value={count} variant="default" />
                        <RollingNumber value={count} variant="accent" />
                        <RollingNumber value={count} variant="info" />
                        <RollingNumber value={count} variant="success" />
                        <RollingNumber value={count} variant="warning" />
                        <RollingNumber value={count} variant="danger" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Coloured by direction</h3>
                    <p>
                        <code>colorByDirection</code> turns the readout green when the value rose and red when it fell — a stock ticker in one prop.
                    </p>
                    <div className="component-group">
                        <RollingNumber colorByDirection decimals={2} value={money} />
                    </div>
                    <div className="component-group">
                        <Button onClick={() => setMoney(current => current + 1275.4)} variant="success">
                            Up
                        </Button>
                        <Button onClick={() => setMoney(current => current - 842.15)} variant="danger">
                            Down
                        </Button>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Formatting</h2>

                <div className="showcase-group">
                    <h3>Decimals, separators, affixes</h3>
                    <div className="component-group">
                        <RollingNumber prefix="$" size="lg" value={money} decimals={2} />
                        <RollingNumber decimals={1} size="lg" suffix=" km" value={count / 10} />
                        <RollingNumber decimalSeparator="," groupSeparator="." size="lg" value={money} decimals={2} />
                        <RollingNumber groupSeparator="" size="lg" value={count} />
                        <RollingNumber size="lg" suffix="%" value={87} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Negative values</h3>
                    <div className="component-group">
                        <RollingNumber colorByDirection decimals={2} size="lg" value={money - 60000} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Timing</h2>

                <div className="showcase-group">
                    <h3>Duration and stagger</h3>
                    <p>Stagger is the delay added per digit, so a larger value makes the columns land one at a time.</p>
                    <div className="component-group">
                        <RollingNumber duration={200} stagger={0} value={count} />
                        <RollingNumber duration={600} stagger={40} value={count} />
                        <RollingNumber duration={1200} stagger={120} value={count} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>In context</h2>

                <div className="showcase-group">
                    <h3>Live counter</h3>
                    <div className="component-group">
                        <Card title="Requests / min">
                            <RollingNumber size="xxl" value={live} variant="accent" />
                        </Card>
                        <Card title="Errors / min">
                            <RollingNumber colorByDirection size="xxl" value={Math.max(0, Math.round(live / 120))} />
                        </Card>
                    </div>
                    <div className="component-group">
                        <Button onClick={() => setIsTicking(current => !current)} variant={isTicking ? 'danger' : 'success'}>
                            {isTicking ? 'Stop' : 'Start'} the feed
                        </Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Score counting up from zero</h3>
                    <div className="component-group">
                        <RollingNumber duration={900} size="xxxl" value={score} variant="success" />
                    </div>
                    <div className="component-group">
                        <Button onClick={() => setScore(Math.floor(Math.random() * 100000))} variant="success">
                            Reveal a score
                        </Button>
                        <Button onClick={() => setScore(0)} variant="default">
                            Reset
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
