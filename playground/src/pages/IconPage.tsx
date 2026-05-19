import React from 'react';

import { Icon, type IconName, type IconSize, type IconVariant } from '../../../src';

import './IconPage.scss';

const sizes: { value: IconSize; px: string }[] = [
    { value: 'sm', px: '~14px' },
    { value: 'md', px: '~16px' },
    { value: 'lg', px: '~20px' },
    { value: 'xl', px: '~24px' },
    { value: 'xxl', px: '~32px' },
    { value: 'xxxl', px: '~48px — empty states' },
];

const variants: { value: IconVariant; token: string }[] = [
    { value: 'default', token: 'inherited' },
    { value: 'muted', token: '--body-color-muted' },
    { value: 'accent', token: '--body-accent-color' },
    { value: 'info', token: '--button-info-background-color' },
    { value: 'success', token: '--button-success-background-color' },
    { value: 'warning', token: '--button-warning-background-color' },
    { value: 'danger', token: '--body-danger-color' },
];

const previewIcon: IconName = 'romania-flag';

export const IconPage: React.FC = () => (
    <div className="icon-page">
        <header className="icon-page__header">
            <h1>Icon</h1>
            <p>
                Renders library SVG icons with controlled <code>size</code>, <code>variant</code>, and animations. Icons use <code>fill="currentColor"</code> so
                they inherit theme colors automatically.
            </p>
        </header>

        <section className="page-section">
            <h2>Sizes</h2>
            <div className="icon-page__row">
                {sizes.map(({ value, px }) => (
                    <article key={value} className="icon-page__tile">
                        <div className="icon-page__preview">
                            <Icon name={previewIcon} size={value} />
                        </div>
                        <strong className="icon-page__name">{value}</strong>
                        <span className="icon-page__meta">{px}</span>
                    </article>
                ))}
            </div>
        </section>

        <section className="page-section">
            <h2>Variants</h2>
            <div className="icon-page__row">
                {variants.map(({ value, token }) => (
                    <article key={value} className="icon-page__tile">
                        <div className="icon-page__preview">
                            <Icon name={previewIcon} size="xl" variant={value} />
                        </div>
                        <strong className="icon-page__name">{value}</strong>
                        <span className="icon-page__meta">{token}</span>
                    </article>
                ))}
            </div>
        </section>

        <section className="page-section">
            <h2>Animations</h2>
            <div className="icon-page__row">
                <article className="icon-page__tile">
                    <div className="icon-page__preview">
                        <Icon name={previewIcon} size="xl" spin />
                    </div>
                    <strong className="icon-page__name">spin</strong>
                    <code className="icon-page__code">spin</code>
                </article>
                <article className="icon-page__tile">
                    <div className="icon-page__preview">
                        <Icon name="save" size="xl" fade />
                    </div>
                    <strong className="icon-page__name">fade</strong>
                    <code className="icon-page__code">fade</code>
                </article>
                <article className="icon-page__tile">
                    <div className="icon-page__preview">
                        <Icon name="heart" size="xl" pulse variant="danger" />
                    </div>
                    <strong className="icon-page__name">pulse</strong>
                    <code className="icon-page__code">pulse</code>
                </article>
                <article className="icon-page__tile icon-page__tile--hover-hint">
                    <div className="icon-page__preview">
                        <Icon name={previewIcon} size="xl" spinOnHover />
                    </div>
                    <strong className="icon-page__name">spinOnHover</strong>
                    <code className="icon-page__code">spinOnHover</code>
                </article>
                <article className="icon-page__tile icon-page__tile--hover-hint">
                    <div className="icon-page__preview">
                        <Icon name="save" size="xl" fadeOnHover />
                    </div>
                    <strong className="icon-page__name">fadeOnHover</strong>
                    <code className="icon-page__code">fadeOnHover</code>
                </article>
                <article className="icon-page__tile icon-page__tile--hover-hint">
                    <div className="icon-page__preview">
                        <Icon name="heart" size="xl" pulseOnHover variant="danger" />
                    </div>
                    <strong className="icon-page__name">pulseOnHover</strong>
                    <code className="icon-page__code">pulseOnHover</code>
                </article>
                <article className="icon-page__tile">
                    <div className="icon-page__preview">
                        <Icon name={previewIcon} size="xl" spin variant="accent" />
                    </div>
                    <strong className="icon-page__name">spin + accent</strong>
                    <code className="icon-page__code">spin variant="accent"</code>
                </article>
                <article className="icon-page__tile icon-page__tile--hover-hint">
                    <div className="icon-page__preview">
                        <Icon name="logout" size="xl" spinOnHover variant="danger" />
                    </div>
                    <strong className="icon-page__name">spinOnHover + danger</strong>
                    <code className="icon-page__code">spinOnHover variant="danger"</code>
                </article>
            </div>
        </section>

        <section className="page-section">
            <h2>Usage</h2>
            <pre className="icon-page__usage">{`import { Icon } from '@memobit/libs';

<Icon name="save" />
<Icon name="romania-flag" size="lg" variant="accent" />
<Icon name="romania-flag" size="xxxl" />      // empty states
<Icon name="romania-flag" spin />             // permanent spin
<Icon name="romania-flag" spinOnHover />      // spin on hover only
<Icon name="save" fade />                     // permanent fade
<Icon name="heart" pulse variant="danger" />  // permanent pulse`}</pre>
        </section>
    </div>
);
