import { FC, useState } from 'react';

import { Icon, type IconName, IconPicker } from '../../../src';

const SWATCHES = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#2dd4bf', '#60a5fa', '#a78bfa', '#f472b6'];

const WEATHER_ICONS: IconName[] = ['fog', 'storm'];

export const IconPickerPage: FC = () => {
    const [icon, setIcon] = useState<IconName | undefined>('alarm');
    const [colour, setColour] = useState(SWATCHES[5]);
    const [restricted, setRestricted] = useState<IconName | undefined>();

    return (
        <div className="component-page">
            <h1>Icon Picker Component</h1>
            <p>
                Search and pick one of the library&apos;s icons. The counterpart to <code>EmojiPicker</code>, and usually the better of the two for labelling a
                user&apos;s own records: an icon inherits <code>currentColor</code>, so it can carry the colour the record already has, and it is drawn at the
                same weight as the rest of the interface instead of arriving as a platform-coloured bitmap that renders differently on every device. Emoji still
                win on sheer vocabulary, so offering both is reasonable.
            </p>

            <section className="page-section">
                <h2>Interactive</h2>
                <p>
                    Search matches the icon name with separators flattened, so <code>credit card</code> finds <code>credit-card</code>. Pass <code>color</code>{' '}
                    and the swatches preview the icon exactly as it will render.
                </p>

                <div className="showcase-group">
                    <div className="component-group">
                        <div style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-12)' }}>
                            <span>Tint:</span>
                            {SWATCHES.map(swatch => (
                                <button
                                    key={swatch}
                                    onClick={() => setColour(swatch)}
                                    style={{
                                        background: swatch,
                                        border: colour === swatch ? '2px solid var(--body-color-accent)' : '2px solid transparent',
                                        borderRadius: 'var(--radius-full)',
                                        cursor: 'pointer',
                                        height: 'var(--spacing-24)',
                                        width: 'var(--spacing-24)',
                                    }}
                                    title={swatch}
                                    type="button"
                                />
                            ))}
                        </div>

                        <IconPicker color={colour} onChange={setIcon} value={icon} />

                        <div style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-8)' }}>
                            Selected:
                            {icon ? (
                                <>
                                    <span style={{ color: colour, display: 'inline-flex' }}>
                                        <Icon name={icon} size="lg" />
                                    </span>
                                    <code>{icon}</code>
                                </>
                            ) : (
                                <em>nothing</em>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>A restricted set</h2>
                <p>
                    Pass <code>icons</code> to narrow the choice — useful where only a themed subset makes sense and the full list would be noise.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <IconPicker emptyLabel="Nothing in this set matches" icons={WEATHER_ICONS} onChange={setRestricted} value={restricted} />
                        <div>Selected: {restricted ? <code>{restricted}</code> : <em>nothing</em>}</div>
                    </div>
                </div>
            </section>
        </div>
    );
};
