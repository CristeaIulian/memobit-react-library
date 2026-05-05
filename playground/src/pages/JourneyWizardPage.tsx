import React, { useState } from 'react';

import { JourneyWizard, Button, InputText, Textarea, ToggleSwitch, Rating, Chip } from '../../../src';

export const JourneyWizardPage: React.FC = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isValidatedOpen, setValidatedOpen] = useState(false);
    const [isInlineOpen, setInlineOpen] = useState(false);

    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [notifications, setNotifications] = useState(false);

    const [tripName, setTripName] = useState('');
    const [tripRating, setTripRating] = useState(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const tags = ['Beach', 'Mountains', 'City', 'Road trip', 'Cultural', 'Adventure'];

    const toggleTag = (tag: string) =>
        setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));

    const drawerSteps = [
        {
            id: 'name',
            title: 'Name your project',
            subtitle: 'Give your project a clear, descriptive name.',
            content: (
                <InputText
                    label="Project name"
                    value={projectName}
                    onChange={setProjectName}
                    placeholder="e.g. Q3 Budget Review"
                />
            ),
        },
        {
            id: 'details',
            title: 'Add a description',
            subtitle: 'Briefly describe what this project is about.',
            content: (
                <Textarea
                    label="Description"
                    value={projectDesc}
                    onChange={setProjectDesc}
                    placeholder="What is the goal of this project?"
                    rows={5}
                />
            ),
        },
        {
            id: 'settings',
            title: 'Configure notifications',
            subtitle: 'Choose how you want to be notified about project activity.',
            content: (
                <ToggleSwitch
                    label="Enable notifications"
                    checked={notifications}
                    onChange={setNotifications}
                />
            ),
        },
    ];

    const modalSteps = [
        {
            id: 'destination',
            title: 'Where did you go?',
            subtitle: 'Start by naming the trip.',
            content: (
                <InputText
                    label="Trip name"
                    value={tripName}
                    onChange={setTripName}
                    placeholder="e.g. Portugal summer 2025"
                />
            ),
        },
        {
            id: 'tags',
            title: 'What kind of trip was it?',
            subtitle: 'Select all that apply.',
            content: (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-8)' }}>
                    {tags.map(tag => (
                        <Chip key={tag} selected={selectedTags.includes(tag)} onClick={() => toggleTag(tag)}>
                            {tag}
                        </Chip>
                    ))}
                </div>
            ),
        },
        {
            id: 'rating',
            title: 'How was it?',
            subtitle: 'Rate your overall experience.',
            content: <Rating rating={tripRating} maxRate={10} onChange={setTripRating} useHalf />,
        },
    ];

    const [validName, setValidName] = useState('');

    const validatedSteps = [
        {
            id: 'required',
            title: 'Required field',
            subtitle: 'You must fill in the name before proceeding.',
            canProceed: validName.trim().length > 0,
            content: (
                <InputText
                    label="Full name"
                    value={validName}
                    onChange={setValidName}
                    placeholder="Type your name to unlock Next"
                />
            ),
        },
        {
            id: 'confirm',
            title: 'Confirmation',
            subtitle: 'Review your name and save.',
            content: (
                <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--body-color)' }}>
                    Hi, <strong>{validName}</strong>! Ready to go.
                </p>
            ),
        },
    ];

    const inlineSteps = [
        {
            id: 'step1',
            title: 'Welcome',
            subtitle: 'This wizard is rendered inline — no drawer or modal needed.',
            content: <p style={{ color: 'var(--body-color-muted)' }}>Inline wizards embed directly in the page layout, useful for guided onboarding flows inside a card or panel.</p>,
        },
        {
            id: 'step2',
            title: 'Step two',
            subtitle: 'Navigate forward and back with the controls below.',
            content: <p style={{ color: 'var(--body-color-muted)' }}>Progress dots at the top reflect the current position. The counter shows step N of total.</p>,
        },
        {
            id: 'step3',
            title: 'Done',
            subtitle: 'Hit Save to complete the inline flow.',
            content: <p style={{ color: 'var(--body-color-muted)' }}>On the last step, Next becomes a Save button. Clicking it calls <code>onComplete</code>.</p>,
        },
    ];

    return (
        <div className="journey-wizard-page">
            <h1>Journey Wizard</h1>
            <p>A multi-step wizard that supports drawer, modal, and inline presentations.</p>

            <section className="page-section">
                <h2>Drawer (default)</h2>

                <div className="showcase-group">
                    <h3>Project setup — 3 steps, right-side drawer</h3>
                    <div className="component-group">
                        <Button onClick={() => setDrawerOpen(true)}>Open Project Wizard</Button>
                        <JourneyWizard
                            isOpen={isDrawerOpen}
                            onClose={() => setDrawerOpen(false)}
                            onComplete={() => setDrawerOpen(false)}
                            title="New Project"
                            steps={drawerSteps}
                            presentation="drawer"
                            width="440px"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Modal</h2>

                <div className="showcase-group">
                    <h3>Trip log — 3 steps inside a large modal</h3>
                    <div className="component-group">
                        <Button onClick={() => setModalOpen(true)}>Log a Trip</Button>
                        <JourneyWizard
                            isOpen={isModalOpen}
                            onClose={() => setModalOpen(false)}
                            onComplete={() => setModalOpen(false)}
                            title="Log New Trip"
                            steps={modalSteps}
                            presentation="modal"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>canProceed validation</h2>

                <div className="showcase-group">
                    <h3>Next is disabled until the required field is filled</h3>
                    <div className="component-group">
                        <Button onClick={() => setValidatedOpen(true)}>Open Validated Wizard</Button>
                        <JourneyWizard
                            isOpen={isValidatedOpen}
                            onClose={() => setValidatedOpen(false)}
                            onComplete={() => setValidatedOpen(false)}
                            title="Validated Steps"
                            steps={validatedSteps}
                            presentation="drawer"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Inline</h2>

                <div className="showcase-group">
                    <h3>Wizard embedded directly in the page</h3>
                    <div className="component-group">
                        {!isInlineOpen && (
                            <Button onClick={() => setInlineOpen(true)}>Start Inline Wizard</Button>
                        )}
                        <JourneyWizard
                            isOpen={isInlineOpen}
                            onClose={() => setInlineOpen(false)}
                            onComplete={() => setInlineOpen(false)}
                            steps={inlineSteps}
                            presentation="inline"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
