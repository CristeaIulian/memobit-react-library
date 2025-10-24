import React from 'react';
import { Button, Card, Dropdown, DropdownOption, formatMoney } from '../../src';
import { useBreakpoint } from '../../src';
import '../../src/styles/theming/dark.scss';
import './App.scss';

import { Popover } from '../../src/components/Popover';
import { usePopover } from '../../src/components/Popover/hooks/Popover.hook';

function App() {
    const { currentBreakpoint, isMobile, isTablet, isDesktop, isLargeDesktop } = useBreakpoint();

    const formatClinicOptions = [
        {
            value: 'option-1',
            label: '1st clinic',
        },
        {
            value: 'option-2',
            label: '2nd clinic',
        },
        {
            value: 'option-3',
            label: '3rd clinic',
        },
    ];

    // const selectedClinic = formatClinicOptions[1];
    const selectedClinic = 'option-2--temp';

    const handleClinicSelect = (newOption: DropdownOption | DropdownOption[] | null) => {
        console.log('handleClinicSelect', newOption);
    };

    const handleClinicSearchChange = (search: string) => {
        console.log('handleClinicSearchChange', search);
    };

    const clinicSearch = '2nd';
    const isDisabled = false;

    const popover = usePopover();

    return (
        <div className="playground">
            <header className="playground__header">
                <h1>Component Library Playground</h1>
                <p>Test and preview components before building</p>
            </header>

            <main className="playground__content">
                {/* Breakpoint Info */}
                <section className="playground__section">
                    <h2>useBreakpoint Hook</h2>
                    <div className="info-grid">
                        <div className="info-card">
                            <strong>Current:</strong> {currentBreakpoint}
                        </div>
                        <div className="info-card">
                            <strong>Mobile:</strong> {isMobile ? 'Yes' : 'No'}
                        </div>
                        <div className="info-card">
                            <strong>Tablet:</strong> {isTablet ? 'Yes' : 'No'}
                        </div>
                        <div className="info-card">
                            <strong>Desktop:</strong> {isDesktop ? 'Yes' : 'No'}
                        </div>
                        <div className="info-card">
                            <strong>Format Money:</strong> {formatMoney(23)}
                        </div>
                    </div>
                </section>

                {/* Button Components */}
                <section className="playground__section">
                    <h2>Button Component</h2>
                    <div className="component-showcase">
                        <div className="showcase-group">
                            <h3>Default Buttons</h3>
                            <div className="button-group">
                                <Button>Default Button</Button>
                                <Button disabled>Disabled</Button>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Button Sizes</h3>
                            <div className="button-group">
                                <Button size="small">Small</Button>
                                <Button size="medium">Medium</Button>
                                <Button size="large">Large</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dropdown Components */}
                <section className="playground__section">
                    <h2>Dropdown Component</h2>
                    <div className="component-showcase">
                        <div className="showcase-group">
                            <h3>Default Buttons</h3>
                            <div className="button-group" style={{ width: '60%' }}>
                                <Dropdown
                                    name="test-dd"
                                    disabled={isDisabled}
                                    options={formatClinicOptions}
                                    value={selectedClinic}
                                    onChange={handleClinicSelect}
                                    placeholder="Caută sau selectează clinica..."
                                    searchable
                                    searchValue={clinicSearch}
                                    onSearchChange={handleClinicSearchChange}
                                    allowCustomValue
                                    className="add-results-modal__clinic-dropdown"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popover Components */}
                <section className="playground__section">
                    <h2>Popover Component</h2>
                    <div className="showcase-group">
                        <h3>Warn</h3>
                        <div className="button-group">
                            <Button onClick={e => popover.toggle('warn', e)}>Click me</Button>
                            <Popover visible={popover.isVisible('warn')} anchorEl={popover.getAnchorEl('warn')} onClose={() => popover.hide('warn')}>
                                <strong style={{ color: 'orange' }}>Warn</strong>, my content goes here
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Good</h3>
                        <div className="button-group">
                            <Button onClick={e => popover.toggle('good', e)}>Click me</Button>
                            <Popover visible={popover.isVisible('good')} anchorEl={popover.getAnchorEl('good')} onClose={() => popover.hide('good')}>
                                <strong style={{ color: 'green' }}>Good</strong>, my content goes here
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Alert</h3>
                        <div className="button-group">
                            <Button onClick={e => popover.toggle('alert', e)}>Click me</Button>
                            <Popover visible={popover.isVisible('alert')} anchorEl={popover.getAnchorEl('alert')} onClose={() => popover.hide('alert')}>
                                <strong style={{ color: 'red' }}>Alert</strong>, my content goes here
                            </Popover>
                        </div>
                    </div>
                </section>

                {/* Card Components */}
                <section className="playground__section" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <h2>Card Component</h2>
                    <div className="showcase-group">
                        <h3>Warn</h3>
                        <div className="button-group">
                            <Card title="some title">Content here</Card>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Card Collapsable 1</h3>
                        <div className="button-group">
                            <Card title="some title as well" isCollapsible className="medium-card">
                                Content here
                            </Card>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Card Collapsable 2</h3>
                        <div className="button-group">
                            <Card isCollapsed isCollapsible>
                                Content here
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;
