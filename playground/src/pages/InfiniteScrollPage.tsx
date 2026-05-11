import React, { useCallback, useState } from 'react';

import { Icon, InfiniteScroll, ScrollInfo, Tooltip } from '../../../src';

// ─── Fake data generator ──────────────────────────────────────────────────────

const generateItems = (start: number, count: number) =>
    Array.from({ length: count }, (_, i) => ({
        id: start + i,
        title: `Item #${start + i + 1}`,
        desc: `This is the description for item ${start + i + 1}.`,
    }));

const TOTAL_ITEMS = 120;
const PAGE_SIZE = 20;

const fakeLoadMore = (currentCount: number): Promise<{ id: number; title: string; desc: string }[]> =>
    new Promise(resolve => {
        setTimeout(() => {
            const next = generateItems(currentCount, Math.min(PAGE_SIZE, TOTAL_ITEMS - currentCount));
            resolve(next);
        }, 1000);
    });

// ─── Page ─────────────────────────────────────────────────────────────────────

export const InfiniteScrollPage: React.FC = () => {
    // ── Basic list demo ───────────────────────────────────────────────────────
    const [items, setItems] = useState(() => generateItems(0, PAGE_SIZE));
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [scrollInfo, setScrollInfo] = useState<ScrollInfo | null>(null);

    const loadMore = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        const next = await fakeLoadMore(items.length);
        setItems(prev => [...prev, ...next]);
        if (items.length + next.length >= TOTAL_ITEMS) setHasMore(false);
        setIsLoading(false);
    }, [isLoading, items.length]);

    // ── Card grid demo ────────────────────────────────────────────────────────
    const [cards, setCards] = useState(() => generateItems(0, PAGE_SIZE));
    const [cardsLoading, setCardsLoading] = useState(false);
    const [cardsHasMore, setCardsHasMore] = useState(true);

    const loadMoreCards = useCallback(async () => {
        if (cardsLoading) return;
        setCardsLoading(true);
        const next = await fakeLoadMore(cards.length);
        setCards(prev => [...prev, ...next]);
        if (cards.length + next.length >= TOTAL_ITEMS) setCardsHasMore(false);
        setCardsLoading(false);
    }, [cardsLoading, cards.length]);

    return (
        <div className="infinite-scroll-page">
            <h1>Infinite Scroll Component</h1>
            <p>
                A behaviour wrapper that observes a sentinel element via <code>IntersectionObserver</code> and calls <code>onLoadMore</code> when the user
                scrolls to the bottom. Exposes live scroll position info via <code>onScrollChange</code>.
            </p>

            {/* ── Basic list + scroll info ── */}
            <section className="page-section">
                <h2>Basic List with Scroll Info</h2>
                <p className="section-description">
                    Scroll the list to trigger loading more items. The panel on the right reflects live scroll position data emitted by{' '}
                    <code>onScrollChange</code>.
                </p>

                <div className="showcase-group" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    {/* List */}
                    <div style={{ flex: 1 }}>
                        <InfiniteScroll
                            height="400px"
                            hasMore={hasMore}
                            isLoading={isLoading}
                            onLoadMore={loadMore}
                            onScrollChange={setScrollInfo}
                            endMessage={<span><Icon name="checkmark" /> All {TOTAL_ITEMS} items loaded.</span>}
                        >
                            {items.map(item => (
                                <div key={item.id} className="infinite-scroll-demo-item">
                                    <strong>{item.title}</strong>
                                    <span>{item.desc}</span>
                                </div>
                            ))}
                        </InfiniteScroll>
                    </div>

                    {/* Scroll info panel */}
                    <div className="infinite-scroll-info-panel">
                        <h4>ScrollInfo</h4>
                        {scrollInfo ? (
                            <table>
                                <tbody>
                                    <tr>
                                        <td>scrollTop</td>
                                        <td>{scrollInfo.scrollTop.toFixed(0)}px</td>
                                    </tr>
                                    <tr>
                                        <td>scrollHeight</td>
                                        <td>{scrollInfo.scrollHeight}px</td>
                                    </tr>
                                    <tr>
                                        <td>clientHeight</td>
                                        <td>{scrollInfo.clientHeight}px</td>
                                    </tr>
                                    <tr>
                                        <td>scrollPercent</td>
                                        <td>{scrollInfo.scrollPercent}%</td>
                                    </tr>
                                    <tr>
                                        <td>isAtTop</td>
                                        <td>{scrollInfo.isAtTop ? <Icon name="checkmark" /> : '—'}</td>
                                    </tr>
                                    <tr>
                                        <td>isAtBottom</td>
                                        <td>{scrollInfo.isAtBottom ? <Icon name="checkmark" /> : '—'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p>Start scrolling...</p>
                        )}
                        <Tooltip title={`${scrollInfo?.scrollPercent ?? 0}% scrolled`}>
                            <div className="infinite-scroll-progress-bar">
                                <div className="infinite-scroll-progress-bar__fill" style={{ height: `${scrollInfo?.scrollPercent ?? 0}%` }} />
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </section>

            {/* ── Card grid ── */}
            <section className="page-section">
                <h2>Card Grid</h2>
                <p className="section-description">The same wrapper used with a CSS grid layout instead of a list.</p>

                <InfiniteScroll
                    height="420px"
                    hasMore={cardsHasMore}
                    isLoading={cardsLoading}
                    onLoadMore={loadMoreCards}
                    endMessage={<span><Icon name="checkmark" /> All {TOTAL_ITEMS} cards loaded.</span>}
                >
                    <div className="infinite-scroll-card-grid">
                        {cards.map(card => (
                            <div key={card.id} className="infinite-scroll-demo-card">
                                <strong>{card.title}</strong>
                                <span>{card.desc}</span>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </section>

            {/* ── Props reference ── */}
            <section className="page-section">
                <h2>Usage</h2>
                <pre style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                    {`const [items, setItems] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
    setIsLoading(true);
    const next = await fetchNextPage();
    setItems(prev => [...prev, ...next]);
    if (next.length === 0) setHasMore(false);
    setIsLoading(false);
};

<InfiniteScroll
    height="500px"                          // container height
    hasMore={hasMore}                       // whether more data exists
    isLoading={isLoading}                   // shows built-in spinner
    onLoadMore={loadMore}                   // called when sentinel is visible
    onScrollChange={info => console.log(info)} // live scroll position info
    rootMargin="100px"                      // trigger 100px before bottom
    endMessage={<span>All done!</span>}     // shown when hasMore is false
>
    {items.map(item => <MyItem key={item.id} {...item} />)}
</InfiniteScroll>`}
                </pre>
            </section>
        </div>
    );
};
