import React, { ReactNode, useEffect, useState } from 'react';

import { Button } from '../Button';
import { Drawer } from '../Drawer';
import { Icon } from '../Icon';
import { Modal } from '../Modal';

import './JourneyWizard.scss';

export type JourneyWizardPresentation = 'drawer' | 'modal' | 'inline';

export interface JourneyStep {
    id: string;
    title: string;
    subtitle?: string;
    content: ReactNode;
    /** Controls whether Next/Save is enabled. Defaults to true if omitted. */
    canProceed?: boolean;
    /** Controls whether Back is enabled. Defaults to true if omitted. */
    canGoBack?: boolean;
}

export interface JourneyWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    steps: JourneyStep[];
    title?: string;
    presentation?: JourneyWizardPresentation;
    /** Used when presentation is 'drawer'. */
    width?: string;
}

export const JourneyWizard: React.FC<JourneyWizardProps> = ({
    isOpen,
    onClose,
    onComplete,
    steps,
    title,
    presentation = 'drawer',
    width = '480px',
}) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
        }
    }, [isOpen]);

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;
    const canProceed = step?.canProceed !== false;
    const canGoBack = step?.canGoBack !== false;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleClose = () => {
        setCurrentStep(0);
        onClose();
    };

    const handleComplete = () => {
        setCurrentStep(0);
        onComplete();
    };

    const dots = (
        <div className="journey-wizard__progress">
            {steps.map((s, i) => (
                <span
                    key={s.id}
                    className={`journey-wizard__dot${
                        i === currentStep
                            ? ' journey-wizard__dot--active'
                            : i < currentStep
                              ? ' journey-wizard__dot--done'
                              : ''
                    }`}
                />
            ))}
        </div>
    );

    const nav = (
        <div className="journey-wizard__nav">
            <div className="journey-wizard__nav-side">
                {!isFirstStep && (
                    <Button variant="ghost" icon="previous" disabled={!canGoBack} onClick={handleBack}>
                        Back
                    </Button>
                )}
            </div>
            <span className="journey-wizard__nav-counter">
                {currentStep + 1} / {steps.length}
            </span>
            <div className="journey-wizard__nav-side journey-wizard__nav-side--right">
                {isLastStep ? (
                    <Button variant="success" icon="save" disabled={!canProceed} onClick={handleComplete}>
                        Save
                    </Button>
                ) : (
                    <Button variant="info" disabled={!canProceed} onClick={handleNext}>
                        Next <Icon name="next" size="sm" />
                    </Button>
                )}
            </div>
        </div>
    );

    if (presentation === 'inline') {
        if (!isOpen) return null;
        return (
            <div className="journey-wizard journey-wizard--inline">
                {dots}
                <div className="journey-wizard__step">
                    <div className="journey-wizard__step-header">
                        <h2 className="journey-wizard__step-title">{step?.title}</h2>
                        {step?.subtitle && <p className="journey-wizard__step-subtitle">{step.subtitle}</p>}
                    </div>
                    <div className="journey-wizard__step-content">{step?.content}</div>
                </div>
                {nav}
            </div>
        );
    }

    if (presentation === 'modal') {
        return (
            <Modal isOpen={isOpen} onClose={handleClose} title={title} size="large" usePortal>
                <div className="journey-wizard journey-wizard--modal">
                    {dots}
                    <div className="journey-wizard__step">
                        <div className="journey-wizard__step-header">
                            <h2 className="journey-wizard__step-title">{step?.title}</h2>
                            {step?.subtitle && <p className="journey-wizard__step-subtitle">{step.subtitle}</p>}
                        </div>
                        <div className="journey-wizard__step-content">{step?.content}</div>
                    </div>
                    {nav}
                </div>
            </Modal>
        );
    }

    return (
        <Drawer isOpen={isOpen} onClose={handleClose} title={title} width={width} position="right" footer={nav}>
            <div className="journey-wizard journey-wizard--drawer">
                {dots}
                <div className="journey-wizard__step">
                    <div className="journey-wizard__step-header">
                        <h2 className="journey-wizard__step-title">{step?.title}</h2>
                        {step?.subtitle && <p className="journey-wizard__step-subtitle">{step.subtitle}</p>}
                    </div>
                    <div className="journey-wizard__step-content">{step?.content}</div>
                </div>
            </div>
        </Drawer>
    );
};
