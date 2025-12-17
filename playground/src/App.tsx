import React, { type MouseEvent, useCallback, useState } from 'react';

import { Header } from './Header';

import {
    BMIHorizontalBarIndicator,
    Button,
    Card,
    ChatBot,
    Checkbox,
    CollapsibleSection,
    ConfirmDialog,
    ContextMenu,
    Dropdown,
    DropdownOption,
    FloatButton,
    formatMoney,
    InformationTooltip,
    InputFile,
    InputNumber,
    InputText,
    MenuHamburger,
    MenuHamburgerItem,
    Modal,
    Pagination,
    Popover,
    ProgressBar,
    Radio,
    Rating,
    Slider,
    SuggestionsList,
    Textarea,
    ThemeModal,
    ThemeProvider,
    TipsOfTheDay,
    Toast,
    ToggleButtons,
    ToggleSwitch,
    usePopover,
} from '../../src';
import { useBreakpoint } from '../../src';

import '../../src/styles/variables.scss';
import '../../src/styles/effects.scss';
import '../../src/styles/theming/luna.scss';
import '../../src/styles/theming/mintone.scss';
import '../../src/styles/theming/light-blue.scss';
import '../../src/styles/theming/dashdarkx.scss';
import '../../src/styles/theming/tailwind-vue-dark.scss';
import '../../src/styles/theming/azure-night.scss';

import './App.scss';

function App() {
    const { currentBreakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();

    const formatClinicOptions = [
        {
            value: 'option-1',
            label: '1st clinic',
        },
        {
            value: 'option-2',
            label: '2nd clinic',
            details: 'some details as well',
        },
        {
            value: 'option-3',
            label: '3rd clinic',
        },
    ];

    const dropdownLongTextOptions = [
        {
            value: 'option-1',
            label: 'This is a long text',
        },
        {
            value: 'option-2',
            label: 'This is another long text',
        },
        {
            value: 'option-3',
            label: 'And here is the 3rd long text',
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

    const [isChecked, setChecked] = useState<boolean>(false);
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [isConfirmDialogOpen2, setConfirmDialogOpen2] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isModalOpen2, setModalOpen2] = useState<boolean>(false);
    const [toastState, setToastState] = useState<string | null>(null);
    const [radioValue, setRadioValue] = useState<number>(1);
    const [textField, setTextField] = useState<string>('This is a text field');
    const [textareaField, setTextareaField] = useState<string>('This is a textarea field');
    const [numberField, setNumberField] = useState<number>(30);
    const [sliderValue1, setSliderValue1] = useState<number>(50);
    const [sliderValue2, setSliderValue2] = useState<number>(7);
    const [isThemeModalOpen, setThemeModalOpen] = useState<boolean>(false);
    const [toggleState2, setToggleState2] = useState<string>('option1');
    const [toggleState4, setToggleState4] = useState<string>('view1');
    const [toggleSwitch1, setToggleSwitch1] = useState<boolean>(false);
    const [toggleSwitch2, setToggleSwitch2] = useState<boolean>(true);
    const [toggleSwitch3, setToggleSwitch3] = useState<boolean>(false);
    const [toggleSwitch4, setToggleSwitch4] = useState<boolean>(true);
    const [toggleSwitch5, setToggleSwitch5] = useState<boolean>(false);
    const [toggleSwitch6, setToggleSwitch6] = useState<boolean>(true);
    const [toggleSwitch7, setToggleSwitch7] = useState<boolean>(false);
    const [contextMenuTarget, setContextMenuTarget] = useState<EventTarget | null>(null);
    const [contextMenuTarget2, setContextMenuTarget2] = useState<EventTarget | null>(null);
    const [showFloatButton1, setShowFloatButton1] = useState<boolean>(false);
    const [showFloatButton2, setShowFloatButton2] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCollapsed2, setIsCollapsed2] = useState(false);
    const [isCollapsed3, setIsCollapsed3] = useState(false);
    const [isCollapsed4, setIsCollapsed4] = useState(false);
    const [isCollapsed5, setIsCollapsed5] = useState(false);
    const [isCollapsed6, setIsCollapsed6] = useState(false);
    const [isCollapsed7, setIsCollapsed7] = useState(false);

    const popover = usePopover();

    const hamburgerMenuItems: MenuHamburgerItem[] = [
        {
            label: 'Notes',
            icon: '📚',
            onClick: () => {},
            isActive: false,
        },
        {
            label: 'Stats',
            icon: '📊',
            onClick: () => {},
            isActive: false,
        },
        {
            label: 'Theme',
            icon: '🎨',
            onClick: () => {},
            isActive: false,
        },
        {
            label: 'Logout',
            icon: '🛣',
            onClick: () => {},
            isActive: false,
        },
    ];

    const handleContextMenuActionsButton = (event: MouseEvent<HTMLButtonElement>): void => {
        setContextMenuTarget(event.target);
    };

    const closeMenu = () => {
        setContextMenuTarget(null);
    };

    const handleContextMenuActionsButton2 = (event: MouseEvent<HTMLButtonElement>): void => {
        setContextMenuTarget2(event.target);
    };

    const closeMenu2 = () => {
        setContextMenuTarget2(null);
    };

    const onActionsEdit = useCallback(() => {
        alert('Edit clicked');
        closeMenu();
    }, []);

    const onActionsDelete = useCallback(() => {
        alert('Delete clicked');
        closeMenu();
    }, []);

    return (
        <ThemeProvider>
            <div className="playground">
                <Header />

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

                    {/* BMI Horizontal Component */}
                    <section className="playground__section">
                        <h2>BMI Horizontal Component</h2>
                        <div className="component-showcase">
                            <div className="showcase-group">
                                <h3>Default BMI</h3>
                                <div className="component-group">
                                    <BMIHorizontalBarIndicator height={180} weight={80} showIndicator showLabels />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Button Components */}
                    <section className="playground__section">
                        <h2>Button Component</h2>
                        <div className="component-showcase">
                            <div className="showcase-group">
                                <h3>Default Buttons</h3>
                                <div className="component-group">
                                    <Button>Default Button</Button>
                                    <Button disabled>Disabled</Button>
                                </div>
                            </div>

                            <div className="showcase-group">
                                <h3>Button Sizes</h3>
                                <div className="component-group">
                                    <Button size="small">Small</Button>
                                    <Button size="medium">Medium</Button>
                                    <Button size="large">Large</Button>
                                </div>
                            </div>
                            <div className="showcase-group">
                                <h3>Button Style</h3>
                                <div className="component-group">
                                    <Button variant="plain">Plain</Button>
                                    <Button variant="default">Default</Button>
                                    <Button variant="warning">Warning</Button>
                                    <Button variant="danger">Danger</Button>
                                    <Button variant="info">Info</Button>
                                    <Button variant="success">Success</Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Card Components */}
                    <section className="playground__section" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <h2>Card Component</h2>
                        <div className="showcase-group">
                            <h3>Simple card</h3>
                            <div className="component-group">
                                <Card title="some title">Content here</Card>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Card Collapsable 1</h3>
                            <div className="component-group">
                                <Card title="some title as well" isCollapsible className="medium-card">
                                    Content here
                                </Card>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Card Collapsable 2</h3>
                            <div className="component-group">
                                <Card isCollapsed isCollapsible>
                                    Content here
                                </Card>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Card Active</h3>
                            <div className="component-group">
                                <Card isHighlighted>Content here</Card>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Card with note-container-effect</h3>
                            <div className="component-group">
                                <Card title="some title">Content here</Card>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Card with infuse-effect</h3>
                            <div className="component-group">
                                <Card title="some title">Content here</Card>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Card with up-lift-effect</h3>
                            <div className="component-group">
                                <Card title="some title">Content here</Card>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Card with collapsible footer</h3>
                            <div className="component-group">
                                <Card title="some title" isCollapsible footerContent={<span>Here is some footer content</span>}>
                                    Content here
                                </Card>
                            </div>
                        </div>
                        <div className="showcase-group">
                            <h3>Card with always visible footer</h3>
                            <div className="component-group">
                                <Card title="some title" isCollapsible footerContent={<span>Here is some footer content</span>} isFooterCollapsible={false}>
                                    Content here
                                </Card>
                            </div>
                        </div>
                        <div className="showcase-group">
                            <h3>Card with collapsible area</h3>
                            <div className="component-group">
                                <Card title="some title" isCollapsible footerContent={<span>Here is some footer content</span>} isFooterCollapsible={false}>
                                    always visible content
                                    <CollapsibleSection label="Details" isCollapsed={isCollapsed} onToggle={setIsCollapsed}>
                                        <p>Fully controlled</p>
                                    </CollapsibleSection>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Collapsible Section Component */}
                    <section className="playground__section">
                        <h2>Collapsible Section Component</h2>
                        <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                            <h3>Self Controllable</h3>
                            <div className="component-group">
                                <CollapsibleSection label="Details" isCollapsed={isCollapsed2} onToggle={setIsCollapsed2}>
                                    <p>Inner content</p>
                                </CollapsibleSection>
                            </div>
                        </div>

                        <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                            <h3 style={{ margin: 0 }}>Parent Controlled</h3>
                            <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                                <Button onClick={() => setIsCollapsed3(!isCollapsed3)}>Toggle</Button>
                                <CollapsibleSection isCollapsed={isCollapsed3} onToggle={setIsCollapsed3}>
                                    <p>Inner content</p>
                                </CollapsibleSection>
                            </div>
                        </div>

                        <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                            <h3>Space between icon & label</h3>
                            <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                                <CollapsibleSection label="Details" isCollapsed={isCollapsed4} onToggle={setIsCollapsed4} collapsibleToggleSpaceBetween>
                                    <p>Inner content</p>
                                </CollapsibleSection>
                            </div>
                        </div>

                        <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                            <h3>Swap icon & label</h3>
                            <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                                <CollapsibleSection
                                    label="Details"
                                    isCollapsed={isCollapsed5}
                                    onToggle={setIsCollapsed5}
                                    collapsibleToggleSpaceBetween
                                    collapsibleToggleSwap
                                >
                                    <p>Inner content</p>
                                </CollapsibleSection>
                            </div>
                        </div>

                        <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                            <h3>Toggle with details</h3>
                            <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                                <CollapsibleSection label="Details" isCollapsed={isCollapsed6} onToggle={setIsCollapsed6} rightDetails="7 props">
                                    <p>Inner content</p>
                                </CollapsibleSection>
                            </div>
                        </div>

                        <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                            <h3>Toggle with details and toggle swap</h3>
                            <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                                <CollapsibleSection
                                    label="Details"
                                    isCollapsed={isCollapsed7}
                                    onToggle={setIsCollapsed7}
                                    rightDetails="7 props"
                                    collapsibleToggleSwap
                                >
                                    <p>Inner content</p>
                                </CollapsibleSection>
                            </div>
                        </div>
                    </section>

                    {/* Selection Components */}
                    <section className="playground__section">
                        <h2>Selection Components</h2>
                        <div className="showcase-group">
                            <h3>Checkbox</h3>
                            <div className="component-group">
                                <Checkbox checked={isChecked} onChange={() => setChecked(!isChecked)} label="Checkbox label" />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Radio</h3>
                            <div className="component-group">
                                <Radio checked={radioValue === 1} onChange={() => setRadioValue(1)} label="Radio 1" />
                                <Radio checked={radioValue === 2} onChange={() => setRadioValue(2)} label="Radio 2" />
                            </div>
                        </div>
                    </section>

                    {/* ConfirmDialog Component */}
                    <section className="playground__section">
                        <h2>ConfirmDialog Component</h2>
                        <div className="showcase-group">
                            <h3>ConfirmDialog</h3>
                            <div className="component-group">
                                <ConfirmDialog
                                    message="this is the message"
                                    isOpen={isConfirmDialogOpen}
                                    onPrimaryButtonClick={() => setConfirmDialogOpen(false)}
                                    onSecondaryButtonClick={() => setConfirmDialogOpen(false)}
                                    title="this is the title"
                                />
                                <Button onClick={() => setConfirmDialogOpen(true)}>Show Confirm Dialog</Button>
                            </div>
                        </div>
                        <div className="showcase-group">
                            <h3>ConfirmDialog with custom button props</h3>
                            <div className="component-group">
                                <ConfirmDialog
                                    message="this is the message"
                                    isOpen={isConfirmDialogOpen2}
                                    primaryButtonLabel="Ok"
                                    primaryButtonPrefixIcon="👌"
                                    primaryButtonVariant="warning"
                                    secondaryButtonLabel="Abort"
                                    secondaryButtonPrefixIcon="🚫"
                                    secondaryButtonVariant="info"
                                    onPrimaryButtonClick={() => setConfirmDialogOpen2(false)}
                                    onSecondaryButtonClick={() => setConfirmDialogOpen2(false)}
                                    title="this is the title"
                                />
                                <Button onClick={() => setConfirmDialogOpen2(true)}>Show Confirm Dialog</Button>
                            </div>
                        </div>
                    </section>

                    {/* Dropdown Components */}
                    <section className="playground__section">
                        <h2>Dropdown Component</h2>
                        <div className="component-showcase">
                            <div className="showcase-group">
                                <h3>Default Dropdown</h3>
                                <div className="component-group" style={{ width: '60%' }}>
                                    <Dropdown
                                        name="test-dd"
                                        label="some label"
                                        options={formatClinicOptions}
                                        value={selectedClinic}
                                        onChange={handleClinicSelect}
                                        placeholder="Caută sau selectează clinica..."
                                        searchable
                                        searchValue={clinicSearch}
                                        onSearchChange={handleClinicSearchChange}
                                        className="add-results-modal__clinic-dropdown"
                                    />
                                </div>
                            </div>
                            <div className="showcase-group">
                                <h3>Dropdown with create item</h3>
                                <div className="component-group" style={{ width: '60%' }}>
                                    <Dropdown
                                        name="test-dd"
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
                            <div className="showcase-group">
                                <h3>MultiSelect Dropdown</h3>
                                <div className="component-group" style={{ width: '60%' }}>
                                    <Dropdown
                                        name="test-dd"
                                        options={formatClinicOptions}
                                        value={selectedClinic}
                                        multiple
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
                            <div className="showcase-group">
                                <h3>Disabled Dropdown</h3>
                                <div className="component-group" style={{ width: '60%' }}>
                                    <Dropdown
                                        name="test-dd"
                                        disabled
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
                            <div className="showcase-group">
                                <h3>Dropdown with Portal</h3>
                                <div className="component-group" style={{ width: '60%' }}>
                                    <Dropdown
                                        name="test-dd"
                                        label="some label"
                                        options={formatClinicOptions}
                                        value={selectedClinic}
                                        onChange={handleClinicSelect}
                                        placeholder="Caută sau selectează clinica..."
                                        searchable
                                        searchValue={clinicSearch}
                                        onSearchChange={handleClinicSearchChange}
                                        className="add-results-modal__clinic-dropdown"
                                        usePortal
                                    />
                                </div>
                            </div>
                            <div className="showcase-group">
                                <h3>Dropdown with Long text</h3>
                                <div className="component-group" style={{ width: '130px' }}>
                                    <Dropdown
                                        name="test-dd"
                                        label="some label"
                                        options={dropdownLongTextOptions}
                                        onChange={newOption => console.log('handleLongTextSelect', newOption)}
                                        placeholder="Caută sau selectează clinica..."
                                        searchable
                                        searchValue={clinicSearch}
                                        onSearchChange={handleClinicSearchChange}
                                        className="add-results-modal__clinic-dropdown"
                                        usePortal
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* InformationTooltip Components */}
                    <section className="playground__section">
                        <h2>InformationTooltip Component</h2>
                        <div className="showcase-group">
                            <h3>InformationTooltip</h3>
                            <div className="component-group">
                                <InformationTooltip title="This is the info tooltip" direction="right" />
                            </div>
                        </div>
                    </section>

                    {/* ChatBot Components */}
                    <section className="playground__section" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <h2>ChatBot Component</h2>
                        <div className="showcase-group">
                            <h3>ChatBot</h3>
                            <div className="component-group" style={{ width: '500px' }}>
                                <ChatBot />
                            </div>
                        </div>
                    </section>

                    {/* InputFile Components */}
                    <section className="playground__section">
                        <h2>InputFile Component</h2>
                        <div className="showcase-group">
                            <h3>InputFile</h3>
                            <div className="component-group">
                                <InputFile />
                            </div>
                        </div>
                    </section>

                    {/* InputNumber Components */}
                    <section className="playground__section">
                        <h2>InputNumber Component</h2>
                        <div className="showcase-group">
                            <h3>InputNumber</h3>
                            <div className="component-group">
                                <InputNumber value={numberField} onChange={value => setNumberField(value || 0)} />
                            </div>
                        </div>
                    </section>

                    {/* InputPassword Components */}
                    <section className="playground__section">
                        <h2>InputText Component</h2>
                        <div className="showcase-group">
                            <h3>InputText</h3>
                            <div className="component-group">
                                <InputText value={textField} onChange={value => setTextField(value)} />
                            </div>
                        </div>
                    </section>

                    {/* Modal Components */}
                    <section className="playground__section">
                        <h2>Modal Component</h2>
                        <div className="showcase-group">
                            <h3>Modal</h3>
                            <div className="component-group">
                                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Modal Title">
                                    <div style={{ padding: '16px' }}>content</div>
                                </Modal>
                                <Button onClick={() => setModalOpen(true)}>Show Modal</Button>
                            </div>
                        </div>
                        <div className="showcase-group">
                            <h3>Modal with footer</h3>
                            <div className="component-group">
                                <Modal
                                    isOpen={isModalOpen2}
                                    onClose={() => setModalOpen2(false)}
                                    title="Modal Title"
                                    primaryButton={{
                                        text: 'Save',
                                        onClick: () => console.log('success clicked'),
                                        icon: '✓',
                                        variant: 'success',
                                    }}
                                    secondaryButton={{
                                        text: 'Cancel',
                                        onClick: () => setModalOpen2(false),
                                        icon: '❎',
                                        variant: 'danger',
                                    }}
                                >
                                    <div style={{ padding: '16px' }}>content</div>
                                </Modal>
                                <Button onClick={() => setModalOpen2(true)}>Show Modal</Button>
                            </div>
                        </div>
                    </section>

                    {/* Pagination Components */}
                    <section className="playground__section">
                        <h2>Pagination Component</h2>
                        <div className="showcase-group">
                            <h3>Pagination</h3>
                            <div className="component-group">
                                <Pagination currentPage={3} totalPages={4} onPageChange={() => console.log('page changed')} />
                            </div>
                        </div>
                    </section>

                    {/* Popover Components */}
                    <section className="playground__section">
                        <h2>Popover Component</h2>
                        <div className="showcase-group">
                            <h3>Warn</h3>
                            <div className="component-group">
                                <Button onClick={e => popover.toggle('warn', e)}>Click me</Button>
                                <Popover visible={popover.isVisible('warn')} anchorEl={popover.getAnchorEl('warn')} onClose={() => popover.hide('warn')}>
                                    <strong style={{ color: 'orange' }}>Warn</strong>, my content goes here
                                </Popover>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Good</h3>
                            <div className="component-group">
                                <Button onClick={e => popover.toggle('good', e)}>Click me</Button>
                                <Popover visible={popover.isVisible('good')} anchorEl={popover.getAnchorEl('good')} onClose={() => popover.hide('good')}>
                                    <strong style={{ color: 'green' }}>Good</strong>, my content goes here
                                </Popover>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Alert</h3>
                            <div className="component-group">
                                <Button onClick={e => popover.toggle('alert', e)}>Click me</Button>
                                <Popover visible={popover.isVisible('alert')} anchorEl={popover.getAnchorEl('alert')} onClose={() => popover.hide('alert')}>
                                    <strong style={{ color: 'red' }}>Alert</strong>, my content goes here
                                </Popover>
                            </div>
                        </div>
                    </section>

                    {/* ProgressBar Components */}
                    <section className="playground__section">
                        <h2>ProgressBar Component</h2>
                        <div className="showcase-group">
                            <h3>Default</h3>
                            <div style={{ width: '150px' }}>
                                <ProgressBar state="default" value={23} />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Warn</h3>
                            <div style={{ width: '150px' }}>
                                <ProgressBar state="warning" value={54} />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Good</h3>
                            <div style={{ width: '150px' }}>
                                <ProgressBar state="success" value={23} />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Danger</h3>
                            <div style={{ width: '150px' }}>
                                <ProgressBar state="danger" value={66} />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Info</h3>
                            <div style={{ width: '150px' }}>
                                <ProgressBar state="info" value={92} />
                            </div>
                        </div>
                    </section>

                    {/* Rating Components */}
                    <section className="playground__section">
                        <h2>Stars Component</h2>
                        <div className="showcase-group">
                            <h3>Stars</h3>
                            <div className="component-group">
                                <Rating rating={3} maxRate={10} />
                            </div>
                            <div className="component-group">
                                <Rating rating={7} maxRate={10} variant="info" />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Half Stars</h3>
                            <div className="component-group">
                                <Rating rating={7} maxRate={10} useHalf />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Rating as dots</h3>
                            <div className="component-group">
                                <Rating rating={3} maxRate={10} useHalf icon="bullet" variant="success" />
                            </div>
                            <div className="component-group">
                                <Rating rating={7} maxRate={10} icon="bullet" variant="warning" />
                            </div>
                            <div className="component-group">
                                <Rating rating={5} maxRate={10} useHalf icon="bullet" variant="danger" />
                            </div>
                            <div className="component-group">
                                <Rating rating={8} maxRate={10} icon="bullet" variant="info" />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Rating alignment</h3>
                            <div className="component-group">
                                <Rating rating={3} maxRate={10} useHalf align="left" />
                            </div>
                            <div className="component-group">
                                <Rating rating={3} maxRate={10} useHalf align="right" />
                            </div>
                            <div className="component-group">
                                <Rating rating={3} maxRate={10} align="space-between" />
                            </div>
                            <div className="component-group">
                                <Rating rating={5} maxRate={10} useHalf icon="bullet" align="left" />
                            </div>
                            <div className="component-group">
                                <Rating rating={8} maxRate={10} icon="bullet" align="right" />
                            </div>
                            <div className="component-group">
                                <Rating rating={8} maxRate={10} icon="bullet" align="space-between" />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>Selectable</h3>
                            <div className="component-group">
                                <Rating rating={8} maxRate={10} selectable onSelect={value => console.log('Rating clicked', value)} />
                            </div>
                        </div>
                    </section>

                    {/* Slider Components */}
                    <section className="playground__section">
                        <h2>Slider Component</h2>
                        <div className="showcase-group">
                            <h3>Slider (0-100 range)</h3>
                            <div className="component-group" style={{ width: '60%' }}>
                                <Slider value={sliderValue1} onChange={setSliderValue1} min={0} max={100} />
                            </div>
                        </div>
                        <div className="showcase-group">
                            <h3>Slider (1-10 range)</h3>
                            <div className="component-group" style={{ width: '60%' }}>
                                <Slider value={sliderValue2} onChange={setSliderValue2} min={1} max={10} />
                            </div>
                        </div>
                        <div className="showcase-group">
                            <h3>Slider without display</h3>
                            <div className="component-group" style={{ width: '60%' }}>
                                <Slider value={sliderValue1} onChange={setSliderValue1} showValues={false} />
                            </div>
                        </div>
                    </section>

                    {/* SuggestionsList Components */}
                    <section className="playground__section">
                        <h2>SuggestionsList Component</h2>
                        <div className="showcase-group">
                            <h3>SuggestionsList</h3>
                            <div className="component-group">
                                <SuggestionsList
                                    label="Label here"
                                    title="Title here"
                                    tooltip="Tooltip here"
                                    data={[
                                        { value: 2, name: 'first item', unit: 'km' },
                                        { value: 3, name: 'second item', unit: 'km' },
                                    ]}
                                />
                            </div>
                        </div>
                    </section>

                    {/* TipsOfTheDay Components */}
                    <section className="playground__section" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <h2>TipsOfTheDay Component</h2>
                        <div className="showcase-group">
                            <h3>TipsOfTheDay</h3>
                            <div className="component-group">
                                <TipsOfTheDay list={['item 1', 'item 2']} />
                            </div>
                        </div>
                    </section>

                    {/* Toast Components */}
                    <section className="playground__section">
                        <h2>Toast Component</h2>
                        <div className="showcase-group">
                            <h3>Toast</h3>
                            <div className="component-group">
                                {toastState && (
                                    <Toast
                                        message="This is a message"
                                        type={toastState as 'danger' | 'success' | 'warning' | 'info' | undefined}
                                        timeout={2000}
                                        onClose={() => setToastState(null)}
                                    />
                                )}
                                <Button variant="info" onClick={() => setToastState('info')}>
                                    Show info
                                </Button>
                                <Button variant="success" onClick={() => setToastState('success')}>
                                    Show info
                                </Button>
                                <Button variant="warning" onClick={() => setToastState('warning')}>
                                    Show info
                                </Button>
                                <Button variant="danger" onClick={() => setToastState('danger')}>
                                    Show info
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Textarea Components */}
                    <section className="playground__section">
                        <h2>Textarea Component</h2>
                        <div className="showcase-group">
                            <h3>Textarea</h3>
                            <div className="component-group">
                                <Textarea value={textareaField} onChange={value => setTextareaField(value)} />
                            </div>
                        </div>
                    </section>

                    {/* ToggleButtons Components */}
                    <section className="playground__section">
                        <h2>ToggleButtons Component</h2>
                        <div className="showcase-group">
                            <h3>2 Buttons Toggle</h3>
                            <div className="component-group">
                                <ToggleButtons
                                    state={toggleState2}
                                    onToggleChange={setToggleState2}
                                    states={[
                                        { key: 'option1', label: 'List View', icon: '☰' },
                                        { key: 'option2', label: 'Grid View', icon: '▦' },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>4 Buttons Toggle</h3>
                            <div className="component-group">
                                <ToggleButtons
                                    state={toggleState4}
                                    onToggleChange={setToggleState4}
                                    states={[
                                        { key: 'view1', label: 'Day', icon: '☀' },
                                        { key: 'view2', label: 'Week', icon: '📅' },
                                        { key: 'view3', label: 'Month', icon: '📆' },
                                        { key: 'view4', label: 'Year', icon: '🗓' },
                                    ]}
                                />
                            </div>
                        </div>
                    </section>

                    {/* MenuHamburger Components */}
                    <section className="playground__section">
                        <h2>MenuHamburger Component</h2>
                        <div className="showcase-group">
                            <h3>MenuHamburger Simple</h3>
                            <div className="component-group">
                                <MenuHamburger items={hamburgerMenuItems} />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>MenuHamburger Custom (IsCompact / Mobile)</h3>
                            <div className="component-group">
                                <MenuHamburger items={hamburgerMenuItems} isCompact showLabel={false} />
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>MenuHamburger Custom</h3>
                            <div className="component-group">
                                <MenuHamburger items={hamburgerMenuItems} icon="🍓" label="Fruits" />
                            </div>
                        </div>
                    </section>

                    {/* ContextMenu Components */}
                    <section className="playground__section">
                        <h2>ContextMenu Component</h2>
                        <div className="showcase-group">
                            <h3>ContextMenu</h3>
                            <div className="component-group">
                                {contextMenuTarget && (
                                    <ContextMenu target={contextMenuTarget} onClose={closeMenu}>
                                        <>
                                            <Button onClick={onActionsEdit} prefixIcon="✏️">
                                                Edit
                                            </Button>
                                            <Button onClick={onActionsDelete} prefixIcon="🗑️">
                                                Delete
                                            </Button>
                                        </>
                                    </ContextMenu>
                                )}

                                <Button onClick={handleContextMenuActionsButton}>Context menu Opener</Button>
                            </div>
                        </div>

                        <div className="showcase-group">
                            <h3>ContextMenu right align</h3>
                            <div className="component-group" style={{ display: 'flex', alignItems: 'end' }}>
                                {contextMenuTarget2 && (
                                    <ContextMenu target={contextMenuTarget2} onClose={closeMenu2}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Button onClick={onActionsEdit} prefixIcon="✏️">
                                                This is the first item and a bit long
                                            </Button>
                                            <Button onClick={onActionsDelete} prefixIcon="🗑️">
                                                This is the second item and a bit long
                                            </Button>
                                        </div>
                                    </ContextMenu>
                                )}

                                <Button onClick={handleContextMenuActionsButton2}>Context menu Opener</Button>
                            </div>
                        </div>
                    </section>

                    {/* ToggleSwitch Components */}
                    <section className="playground__section">
                        <h2>ToggleSwitch Component</h2>
                        <div className="component-showcase">
                            <div className="showcase-group">
                                <h3>Sizes</h3>
                                <div className="component-group">
                                    <ToggleSwitch checked={toggleSwitch1} onChange={setToggleSwitch1} size="small" />
                                    <ToggleSwitch checked={toggleSwitch1} onChange={setToggleSwitch1} size="medium" />
                                    <ToggleSwitch checked={toggleSwitch1} onChange={setToggleSwitch1} size="large" />
                                </div>
                            </div>

                            <div className="showcase-group">
                                <h3>Variants</h3>
                                <div className="component-group">
                                    <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="default" />
                                    <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="success" />
                                    <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="info" />
                                    <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="warning" />
                                    <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="danger" />
                                    <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="plain" />
                                </div>
                            </div>

                            <div className="showcase-group">
                                <h3>Without Labels</h3>
                                <div className="component-group">
                                    <ToggleSwitch checked={toggleSwitch3} onChange={setToggleSwitch3} showLabels={false} variant="danger" />
                                    <ToggleSwitch checked={toggleSwitch3} onChange={setToggleSwitch3} showLabels={false} variant="success" size="small" />
                                    <ToggleSwitch checked={toggleSwitch3} onChange={setToggleSwitch3} showLabels={false} variant="info" size="large" />
                                </div>
                            </div>

                            <div className="showcase-group">
                                <h3>Custom Labels</h3>
                                <div className="component-group">
                                    <ToggleSwitch checked={toggleSwitch4} onChange={setToggleSwitch4} onLabel="Yes" offLabel="No" variant="success" />
                                    <ToggleSwitch checked={toggleSwitch5} onChange={setToggleSwitch5} onLabel="Active" offLabel="Inactive" variant="info" />
                                    <ToggleSwitch checked={toggleSwitch6} onChange={setToggleSwitch6} onLabel="1" offLabel="0" variant="warning" size="small" />
                                </div>
                            </div>

                            <div className="showcase-group">
                                <h3>Disabled State</h3>
                                <div className="component-group">
                                    <ToggleSwitch checked={false} disabled variant="danger" />
                                    <ToggleSwitch checked={true} disabled variant="success" />
                                    <ToggleSwitch checked={toggleSwitch7} onChange={setToggleSwitch7} disabled showLabels={false} />
                                </div>
                            </div>

                            <div className="showcase-group">
                                <h3>Interactive Example</h3>
                                <div className="component-group">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span>Enable Notifications:</span>
                                        <ToggleSwitch checked={toggleSwitch7} onChange={setToggleSwitch7} variant="success" size="medium" />
                                        <span>{toggleSwitch7 ? 'Enabled' : 'Disabled'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ThemeModal Component */}
                    <section className="playground__section">
                        <h2>ThemeModal Component</h2>
                        <div className="showcase-group">
                            <h3>Theme Settings with Effects</h3>
                            <div className="component-group">
                                <Button onClick={() => setThemeModalOpen(true)}>Open Theme Settings</Button>
                                <ThemeModal isOpen={isThemeModalOpen} onClose={() => setThemeModalOpen(false)} />
                            </div>
                        </div>
                    </section>

                    {/* FloatButton Components */}
                    <section className="playground__section">
                        <h2>FloatButton Component</h2>
                        <div className="component-showcase">
                            <div className="showcase-group">
                                <h3>FloatButton Button</h3>
                                <div className="component-group">
                                    <Button onClick={() => setShowFloatButton1(!showFloatButton1)}>{showFloatButton1 ? 'Hide' : 'Show'} Float Button</Button>
                                    <div style={{ display: showFloatButton1 ? 'block' : 'none' }}>
                                        <FloatButton
                                            actions={[
                                                {
                                                    label: 'Add Item',
                                                    icon: '+',
                                                    onClick: () => alert('One Item :: Action triggered'),
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="showcase-group">
                                <h3>Button Sizes</h3>
                                <div className="component-group">
                                    <Button onClick={() => setShowFloatButton2(!showFloatButton2)}>{showFloatButton2 ? 'Hide' : 'Show'} Float Button</Button>
                                    <div style={{ display: showFloatButton2 ? 'block' : 'none' }}>
                                        <FloatButton
                                            actions={[
                                                {
                                                    label: 'Add Item',
                                                    icon: '+',
                                                    onClick: () => alert('Multiple Items :: First item triggered'),
                                                },
                                                {
                                                    label: 'Import Data',
                                                    icon: '📥',
                                                    onClick: () => alert('Multiple Items :: Second item triggered'),
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="showcase-group">
                                <h3>Button Style</h3>
                                <div className="component-group">
                                    <Button variant="plain">Plain</Button>
                                    <Button variant="default">Default</Button>
                                    <Button variant="warning">Warning</Button>
                                    <Button variant="danger">Danger</Button>
                                    <Button variant="info">Info</Button>
                                    <Button variant="success">Success</Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </ThemeProvider>
    );
}

export default App;
