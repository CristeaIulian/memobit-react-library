import React, { useState } from 'react';

import { Drawer, Button, Chip, InputNumber, Rating, InputText, InputEmail, Textarea } from '../../../src';

const bookDrawerStyles: Record<string, React.CSSProperties> = {
    stack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
    },
    hero: {
        display: 'flex',
        gap: '22px',
        alignItems: 'start',
    },
    cover: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '150px',
        aspectRatio: '3 / 4.3',
        padding: '18px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 252, 240, 0.45)',
        background: 'linear-gradient(145deg, #294c29 0%, #6c9558 100%)',
        color: '#fff8e6',
        boxShadow: '0 20px 32px -24px rgba(31, 24, 17, 0.75)',
    },
    coverRightContent: {
        flex: 1,
    },
    title: {
        margin: 0,
        color: 'var(--body-color-accent)',
        fontFamily: 'var(--font-family-display, var(--font-family, serif))',
        fontSize: '32px',
        fontStyle: 'italic',
        fontWeight: 500,
        lineHeight: 1.1,
    },
    meta: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        margin: '18px 0',
        color: 'var(--body-color-muted)',
        fontSize: '13px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
    },
    progressTrack: {
        height: '7px',
        overflow: 'hidden',
        borderRadius: '999px',
        background: 'var(--card-background-accent-color)',
    },
    progressValue: {
        width: '71%',
        height: '100%',
        background: 'var(--body-accent-color)',
    },
    controlsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
    },
    stateButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minHeight: '46px',
        padding: '0 14px',
        border: '1px solid var(--delimiter-color)',
        borderRadius: '8px',
        background: 'transparent',
        color: 'var(--body-color)',
    },
    sectionTitle: {
        margin: '0 0 12px',
        color: 'var(--body-color-muted)',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
    },
    details: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '18px 80px',
    },
    noteBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        padding: '18px',
        border: '1px solid var(--delimiter-color)',
        borderRadius: '12px',
        background: 'rgba(255, 248, 230, 0.24)',
    },
};

export const DrawerPage: React.FC = () => {
    const [isLeftDrawerOpen, setLeftDrawerOpen] = useState<boolean>(false);
    const [isRightDrawerOpen, setRightDrawerOpen] = useState<boolean>(false);
    const [isLeftDrawerWithTitleOpen, setLeftDrawerWithTitleOpen] = useState<boolean>(false);
    const [isRightDrawerWithTitleOpen, setRightDrawerWithTitleOpen] = useState<boolean>(false);
    const [isWideDrawerOpen, setWideDrawerOpen] = useState<boolean>(false);
    const [isNarrowDrawerOpen, setNarrowDrawerOpen] = useState<boolean>(false);
    const [isNoOverlayDrawerOpen, setNoOverlayDrawerOpen] = useState<boolean>(false);
    const [isFooterDrawerOpen, setFooterDrawerOpen] = useState<boolean>(false);
    const [isIconDrawerOpen, setIconDrawerOpen] = useState<boolean>(false);
    const [isBookDetailDrawerOpen, setBookDetailDrawerOpen] = useState<boolean>(false);
    const [bookPage, setBookPage] = useState<number>(177);
    const [notePage, setNotePage] = useState<number | undefined>(undefined);
    const bookProgress = Math.round((bookPage / 248) * 100);

    return (
        <div className="drawer-page">
            <h1>Drawer Component</h1>
            <p>A drawer component that slides in from the left or right side of the screen.</p>

            <section className="page-section">
                <h2>Basic Drawers</h2>

                <div className="showcase-group">
                    <h3>Left Drawer</h3>
                    <div className="component-group">
                        <Button onClick={() => setLeftDrawerOpen(true)}>Open Left Drawer</Button>
                        <Drawer isOpen={isLeftDrawerOpen} onClose={() => setLeftDrawerOpen(false)} position="left">
                            <h3>Left Drawer Content</h3>
                            <p>This is a drawer that slides in from the left side.</p>
                            <p>You can put any content here.</p>
                            <ul>
                                <li>Navigation links</li>
                                <li>Settings</li>
                                <li>User profile</li>
                                <li>Filters</li>
                            </ul>
                        </Drawer>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Right Drawer</h3>
                    <div className="component-group">
                        <Button onClick={() => setRightDrawerOpen(true)}>Open Right Drawer</Button>
                        <Drawer isOpen={isRightDrawerOpen} onClose={() => setRightDrawerOpen(false)} position="right">
                            <h3>Right Drawer Content</h3>
                            <p>This is a drawer that slides in from the right side.</p>
                            <p>Commonly used for:</p>
                            <ul>
                                <li>Shopping cart</li>
                                <li>Notifications</li>
                                <li>Settings panel</li>
                                <li>Details view</li>
                            </ul>
                        </Drawer>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Drawers with Titles</h2>

                <div className="showcase-group">
                    <h3>Left Drawer with Title</h3>
                    <div className="component-group">
                        <Button onClick={() => setLeftDrawerWithTitleOpen(true)}>Open Left Drawer with Title</Button>
                        <Drawer isOpen={isLeftDrawerWithTitleOpen} onClose={() => setLeftDrawerWithTitleOpen(false)} position="left" title="Navigation Menu">
                            <nav>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ padding: '8px 0' }}>
                                        <a href="#home">Home</a>
                                    </li>
                                    <li style={{ padding: '8px 0' }}>
                                        <a href="#products">Products</a>
                                    </li>
                                    <li style={{ padding: '8px 0' }}>
                                        <a href="#about">About</a>
                                    </li>
                                    <li style={{ padding: '8px 0' }}>
                                        <a href="#contact">Contact</a>
                                    </li>
                                </ul>
                            </nav>
                        </Drawer>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Drawer with Icon and Title</h3>
                    <div className="component-group">
                        <Button onClick={() => setIconDrawerOpen(true)}>Open Drawer with Icon</Button>
                        <Drawer isOpen={isIconDrawerOpen} onClose={() => setIconDrawerOpen(false)} position="left" title="Filters" icon="filters">
                            <p>Drawer with an icon next to the title — no need to add emojis to the label.</p>
                        </Drawer>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Right Drawer with Title</h3>
                    <div className="component-group">
                        <Button onClick={() => setRightDrawerWithTitleOpen(true)}>Open Right Drawer with Title</Button>
                        <Drawer isOpen={isRightDrawerWithTitleOpen} onClose={() => setRightDrawerWithTitleOpen(false)} position="right" title="Settings">
                            <div>
                                <h4>Appearance</h4>
                                <p>Configure your appearance settings.</p>
                                <h4>Notifications</h4>
                                <p>Manage your notification preferences.</p>
                                <h4>Privacy</h4>
                                <p>Control your privacy settings.</p>
                            </div>
                        </Drawer>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Drawer Width</h2>

                <div className="showcase-group">
                    <h3>Wide Drawer (500px)</h3>
                    <div className="component-group">
                        <Button onClick={() => setWideDrawerOpen(true)}>Open Wide Drawer</Button>
                        <Drawer isOpen={isWideDrawerOpen} onClose={() => setWideDrawerOpen(false)} position="right" width="500px" title="Wide Panel">
                            <p>This drawer has a custom width of 500px.</p>
                            <p>Perfect for detailed content or forms.</p>
                            <div style={{ marginTop: '20px' }}>
                                <h4>Example Form</h4>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Name:</label>
                                    <InputText />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Email:</label>
                                    <InputEmail />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Message:</label>
                                    <Textarea />
                                </div>
                            </div>
                        </Drawer>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Narrow Drawer (240px)</h3>
                    <div className="component-group">
                        <Button onClick={() => setNarrowDrawerOpen(true)}>Open Narrow Drawer</Button>
                        <Drawer isOpen={isNarrowDrawerOpen} onClose={() => setNarrowDrawerOpen(false)} position="left" width="240px" title="Quick Links">
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '8px 0' }}>Dashboard</li>
                                <li style={{ padding: '8px 0' }}>Profile</li>
                                <li style={{ padding: '8px 0' }}>Settings</li>
                                <li style={{ padding: '8px 0' }}>Help</li>
                                <li style={{ padding: '8px 0' }}>Logout</li>
                            </ul>
                        </Drawer>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Special Configurations</h2>

                <div className="showcase-group">
                    <h3>Drawer without Overlay</h3>
                    <div className="component-group">
                        <Button onClick={() => setNoOverlayDrawerOpen(true)}>Open Drawer without Overlay</Button>
                        <Drawer
                            isOpen={isNoOverlayDrawerOpen}
                            onClose={() => setNoOverlayDrawerOpen(false)}
                            position="right"
                            showOverlay={false}
                            title="No Overlay"
                        >
                            <p>This drawer doesn't have a backdrop overlay.</p>
                            <p>You can still interact with the page content behind it.</p>
                            <p>Use the close button or press ESC to close.</p>
                        </Drawer>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Drawer Footer</h2>

                <div className="showcase-group">
                    <h3>Fixed footer actions</h3>
                    <div className="component-group">
                        <Button onClick={() => setFooterDrawerOpen(true)}>Open Drawer with Footer</Button>
                        <Drawer
                            isOpen={isFooterDrawerOpen}
                            onClose={() => setFooterDrawerOpen(false)}
                            position="right"
                            title="Edit Settings"
                            width="420px"
                            footer={<span style={{ color: 'var(--body-color-muted)' }}>Unsaved changes</span>}
                            secondary={{
                                text: 'Cancel',
                                icon: 'clear',
                                onClick: () => setFooterDrawerOpen(false),
                                variant: 'default',
                            }}
                            primary={{
                                text: 'Save changes',
                                icon: 'checkmark',
                                onClick: () => setFooterDrawerOpen(false),
                                variant: 'info',
                            }}
                        >
                            <h3>Preferences</h3>
                            <p>The footer remains fixed while this content area scrolls.</p>
                            {Array.from({ length: 10 }, (_, index) => (
                                <div key={index} style={{ marginBottom: '18px' }}>
                                    <h4>Setting group {index + 1}</h4>
                                    <p>Use this space for forms, configuration groups, filters, or other drawer content.</p>
                                </div>
                            ))}
                        </Drawer>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Styled Detail Drawer</h2>

                <div className="showcase-group">
                    <h3>Book detail panel with responsive max width</h3>
                    <div className="component-group">
                        <Button onClick={() => setBookDetailDrawerOpen(true)}>Open Book Detail Drawer</Button>
                        <Drawer
                            isOpen={isBookDetailDrawerOpen}
                            onClose={() => setBookDetailDrawerOpen(false)}
                            position="right"
                            width="calc(100vw - 64px)"
                            maxWidth="820px"
                            margin="20px 32px 20px 0"
                            borderRadius="20px"
                            shadow="var(--modal-surface-box-shadow, var(--modal-box-shadow))"
                            title="BOOK - B02"
                            secondary={{
                                text: 'Cancel',
                                icon: 'clear',
                                onClick: () => setBookDetailDrawerOpen(false),
                                variant: 'default',
                            }}
                            primary={{
                                text: 'Save changes',
                                icon: 'checkmark',
                                onClick: () => setBookDetailDrawerOpen(false),
                                variant: 'info',
                            }}
                            actions={[
                                { id: 'edit', label: 'Edit', icon: 'edit', onClick: () => undefined },
                                { id: 'delete', label: 'Delete', icon: 'delete', onClick: () => undefined },
                            ]}
                        >
                            <div style={bookDrawerStyles.stack}>
                                <section style={{ ...bookDrawerStyles.hero, gridTemplateColumns: 'repeat(auto-fit, minmax(min(270px, 100%), 1fr))' }}>
                                    <div style={bookDrawerStyles.cover}>
                                        <div>
                                            <div style={{ width: '22px', height: '1px', marginBottom: '14px', background: 'rgba(255, 248, 230, 0.65)' }} />
                                            <strong
                                                style={{
                                                    fontFamily: 'var(--font-family-display, var(--font-family, serif))',
                                                    fontSize: '20px',
                                                    fontStyle: 'italic',
                                                    lineHeight: 1.15,
                                                }}
                                            >
                                                A Cartography of Small Weathers
                                            </strong>
                                        </div>
                                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                            Benedikt Harlan
                                            <br />
                                            MMX - 2019
                                        </div>
                                    </div>

                                    <div style={bookDrawerStyles.coverRightContent}>
                                        <h3 style={bookDrawerStyles.title}>A Cartography of Small Weathers</h3>
                                        <p style={{ margin: '12px 0 0', fontSize: '18px' }}>by Benedikt Harlan</p>
                                        <div style={bookDrawerStyles.meta}>
                                            <span>2019</span>
                                            <span>248 pp</span>
                                            <span>English</span>
                                            <span>Owned</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                                            <span
                                                style={{
                                                    padding: '5px 12px',
                                                    border: '1px solid #7ea36a',
                                                    borderRadius: '999px',
                                                    color: '#3f7d4a',
                                                    fontSize: '12px',
                                                    letterSpacing: '0.16em',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                Finished
                                            </span>
                                            <Rating rating={10} maxRate={10} useHalf />
                                            <span>page {bookPage}</span>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h4 style={bookDrawerStyles.sectionTitle}>Progress</h4>
                                    <div style={bookDrawerStyles.progressTrack}>
                                        <div style={{ ...bookDrawerStyles.progressValue, width: `${bookProgress}%` }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: 'var(--body-color-muted)' }}>
                                        <span>{bookPage} / 248 pages</span>
                                        <span>{bookProgress}%</span>
                                    </div>
                                </section>

                                <section>
                                    <h4 style={bookDrawerStyles.sectionTitle}>Set page</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 88px', gap: '14px', alignItems: 'center' }}>
                                        <input
                                            aria-label="Set page"
                                            max="248"
                                            min="0"
                                            type="range"
                                            value={bookPage}
                                            onChange={event => setBookPage(Number(event.target.value))}
                                        />
                                        <InputNumber max={248} min={0} value={bookPage} onChange={value => setBookPage(value ?? 0)} />
                                    </div>
                                </section>

                                <section>
                                    <h4 style={bookDrawerStyles.sectionTitle}>Reading state</h4>
                                    <div style={bookDrawerStyles.controlsGrid}>
                                        {['Reading', 'Finished', 'Want to read', 'Paused', 'Abandoned', 'Re-reading'].map((state, index) => (
                                            <button
                                                key={state}
                                                type="button"
                                                style={{
                                                    ...bookDrawerStyles.stateButton,
                                                    borderColor: state === 'Finished' ? 'var(--body-accent-color)' : 'var(--delimiter-color)',
                                                    background: state === 'Finished' ? 'var(--card-background-accent-color)' : 'transparent',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '999px',
                                                        background: ['#c56f23', '#3f8b52', '#a7773e', '#94866b', '#d08378', '#9d5e24'][index],
                                                    }}
                                                />
                                                {state}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h4 style={bookDrawerStyles.sectionTitle}>Details</h4>
                                    <div style={bookDrawerStyles.details}>
                                        {[
                                            ['Published', '2019'],
                                            ['Language', 'English'],
                                            ['Pages', '248'],
                                            ['Ownership', 'Owned'],
                                            ['Completed', '2024-11-04'],
                                            ['Bookmark', `page ${bookPage}`],
                                        ].map(([label, value]) => (
                                            <div key={label}>
                                                <div style={bookDrawerStyles.sectionTitle}>{label}</div>
                                                <div style={{ fontSize: '18px' }}>{value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h4 style={bookDrawerStyles.sectionTitle}>Categories</h4>
                                    <Chip selected>Poetry</Chip>
                                </section>

                                <section>
                                    <h4 style={bookDrawerStyles.sectionTitle}>Notes and highlights (0)</h4>
                                    <div style={bookDrawerStyles.noteBox}>
                                        <em style={{ color: 'var(--body-color-muted)' }}>Pull a quote or a thought...</em>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center' }}>
                                            <div style={{ width: '88px' }}>
                                                <InputNumber placeholder="page" value={notePage} onChange={setNotePage} />
                                            </div>
                                            <Button icon="plus" variant="warning" onClick={() => undefined}>
                                                Add note
                                            </Button>
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--body-color-muted)' }}>No notes yet - capture a line that stayed with you.</p>
                                </section>
                            </div>
                        </Drawer>
                    </div>
                </div>
            </section>
        </div>
    );
};
