import React, { useState } from 'react';

import { Timeline, TimelineItem, TimelineOrientation, TimelineSize } from '../../../src';

// ── Sample data sets ──────────────────────────────────────────────────────────

const activityFeedItems: TimelineItem[] = [
    {
        id: 1,
        title: 'Pull request merged',
        description: 'feat: add dark-mode support to Dashboard (#284)',
        timestamp: 'Just now',
        variant: 'success',
        badge: 'Merged',
        active: true,
    },
    {
        id: 2,
        title: 'Review requested',
        description: 'João Silva requested your review on PR #284.',
        timestamp: '14 min ago',
        variant: 'info',
        badge: 'Review',
    },
    {
        id: 3,
        title: 'Pipeline failed',
        description: 'Build #1042 failed on step "lint". 3 errors reported.',
        timestamp: '1 h ago',
        variant: 'danger',
        badge: 'Failed',
    },
    {
        id: 4,
        title: 'Deployment to staging',
        description: 'v2.4.1-rc3 deployed to staging environment.',
        timestamp: '3 h ago',
        variant: 'warning',
        badge: 'Staging',
    },
    {
        id: 5,
        title: 'Issue closed',
        description: 'Issue #199 "Tooltip z-index bug" was closed as resolved.',
        timestamp: 'Yesterday',
        variant: 'default',
    },
];

const changelogItems: TimelineItem[] = [
    {
        id: 'v3',
        title: 'v3.0.0 — Major release',
        description: 'Full TypeScript rewrite, new design system, breaking API changes.',
        timestamp: 'Apr 2025',
        variant: 'info',
        badge: 'Latest',
        active: true,
    },
    {
        id: 'v2.5',
        title: 'v2.5.0 — Feature update',
        description: 'Introduced Timeline, Rating, and Slider components.',
        timestamp: 'Jan 2025',
        variant: 'success',
    },
    {
        id: 'v2.0',
        title: 'v2.0.0 — Redesign',
        description: 'Arctic Blue theme, SCSS token system, accessibility audit.',
        timestamp: 'Sep 2024',
        variant: 'success',
    },
    {
        id: 'v1.2',
        title: 'v1.2.1 — Patch',
        description: 'Fixed modal focus-trap edge cases and date-picker SSR crash.',
        timestamp: 'Jun 2024',
        variant: 'default',
    },
    {
        id: 'v1.0',
        title: 'v1.0.0 — Initial release',
        description: 'Core components: Button, Dropdown, Modal, Table.',
        timestamp: 'Feb 2024',
        variant: 'default',
        muted: true,
    },
];

const onboardingSteps: TimelineItem[] = [
    {
        id: 'step-1',
        title: 'Create account',
        description: 'Sign up with your email and set a secure password.',
        timestamp: 'Completed',
        variant: 'success',
        badge: 'Done',
    },
    {
        id: 'step-2',
        title: 'Verify email',
        description: 'Click the link sent to your inbox to verify your address.',
        timestamp: 'Completed',
        variant: 'success',
        badge: 'Done',
    },
    {
        id: 'step-3',
        title: 'Set up workspace',
        description: 'Name your workspace and invite your first teammates.',
        timestamp: 'In progress',
        variant: 'info',
        badge: 'Active',
        active: true,
    },
    {
        id: 'step-4',
        title: 'Configure integrations',
        description: 'Connect Slack, GitHub, or Jira to streamline your workflow.',
        variant: 'default',
        muted: true,
    },
    {
        id: 'step-5',
        title: 'Launch 🎉',
        description: "You're all set. Start building with your team.",
        variant: 'default',
        muted: true,
    },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export const TimelinePage: React.FC = () => {
    const [orientation, setOrientation] = useState<TimelineOrientation>('vertical');
    const [size, setSize] = useState<TimelineSize>('md');

    return (
        <div className="component-page">
            <h1>Timeline Component</h1>
            <p>Vertical or horizontal sequence of events — useful for activity feeds, history logs, and changelogs.</p>

            {/* ── Activity feed ──────────────────────────────────────── */}
            <section className="page-section">
                <h2>Activity Feed</h2>
                <p className="section-description">
                    Displays a live stream of events with variant-coloured nodes and status badges. The most recent item is marked <code>active</code>.
                </p>
                <div className="showcase-group">
                    <Timeline items={activityFeedItems} />
                </div>
            </section>

            {/* ── Changelog ──────────────────────────────────────────── */}
            <section className="page-section">
                <h2>Changelog / Release History</h2>
                <p className="section-description">
                    Uses <code>muted</code> on older entries to visually de-emphasise historical records.
                </p>
                <div className="showcase-group">
                    <Timeline items={changelogItems} size="lg" />
                </div>
            </section>

            {/* ── Onboarding stepper ─────────────────────────────────── */}
            <section className="page-section">
                <h2>Onboarding Stepper — Horizontal</h2>
                <p className="section-description">
                    Switch <code>orientation</code> to <code>"horizontal"</code> for stepped progress flows. Incomplete steps are automatically muted.
                </p>
                <div className="showcase-group">
                    <Timeline items={onboardingSteps} orientation="horizontal" />
                </div>
            </section>

            {/* ── Interactive playground ─────────────────────────────── */}
            <section className="page-section">
                <h2>Playground</h2>
                <p className="section-description">
                    Adjust <code>orientation</code> and <code>size</code> to preview all combinations.
                </p>

                <div className="component-group" style={{ marginBottom: 'var(--spacing-20)' }}>
                    <label>
                        Orientation&nbsp;
                        <select value={orientation} onChange={e => setOrientation(e.target.value as TimelineOrientation)}>
                            <option value="vertical">Vertical</option>
                            <option value="horizontal">Horizontal</option>
                        </select>
                    </label>
                    <label>
                        Size&nbsp;
                        <select value={size} onChange={e => setSize(e.target.value as TimelineSize)}>
                            <option value="sm">Small</option>
                            <option value="md">Medium</option>
                            <option value="lg">Large</option>
                        </select>
                    </label>
                </div>

                <div className="showcase-group">
                    <Timeline items={activityFeedItems.slice(0, 4)} orientation={orientation} size={size} />
                </div>
            </section>

            {/* ── No connector ───────────────────────────────────────── */}
            <section className="page-section">
                <h2>Without Connector Line</h2>
                <p className="section-description">
                    Set <code>connected=&#123;false&#125;</code> to hide the vertical connector, creating a looser, card-like feel.
                </p>
                <div className="showcase-group">
                    <Timeline items={changelogItems.slice(0, 3)} connected={false} size="sm" />
                </div>
            </section>

            <section className="page-section">
                <h2>Without Mount Animation</h2>
                <p className="section-description">
                    Set <code>animated=&#123;false&#125;</code> when the timeline should render without staggered entrance motion.
                </p>
                <div className="showcase-group">
                    <Timeline items={activityFeedItems.slice(0, 3)} animated={false} />
                </div>
            </section>
        </div>
    );
};
