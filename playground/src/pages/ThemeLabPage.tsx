import React, { useState } from 'react';

import {
    Accordion,
    AppHeader,
    AvatarInitials,
    Badge,
    Breadcrumb,
    BulkActionBar,
    Button,
    Calendar,
    Card,
    Checkbox,
    Chip,
    CollapsibleSection,
    DataView,
    Drawer,
    Dropdown,
    EmptyState,
    FileDropzone,
    FloatButton,
    Icon,
    InputDate,
    InputEmail,
    InputFile,
    InputMask,
    InputMaskPresets,
    InputNumber,
    InputPassword,
    InputPhone,
    InputText,
    InputTime,
    InputUrl,
    JourneyWizard,
    List,
    Loading,
    MenuHamburger,
    MiniStatsCard,
    Modal,
    NavBar,
    NotificationPanel,
    Pagination,
    Popover,
    ProgressBar,
    Radio,
    Rating,
    ScrollToTop,
    Search,
    Separator,
    SignalStrength,
    Skeleton,
    Slider,
    SplitPanel,
    Stats,
    SuggestionsList,
    Textarea,
    Toast,
    ToggleButtons,
    ToggleSwitch,
    Toolbar,
    Tooltip,
    Tree,
    usePopover,
    type DataViewColumn,
    type DropdownOption,
    type JourneyStep,
    type MenuHamburgerItem,
    type NotificationPanelItem,
    type TreeNode,
} from '../../../src';

import './ThemeLabPage.scss';

interface ReportRow {
    id: number;
    name: string;
    owner: string;
    status: string;
    progress: number;
    updated: string;
}

const STATUS_OPTIONS: DropdownOption[] = [
    { label: 'Draft', value: 'draft' },
    { label: 'In Review', value: 'review' },
    { label: 'Published', value: 'published' },
];

const REPORT_ROWS: ReportRow[] = [
    { id: 1, name: 'Spring Campaign', owner: 'Iulia', status: 'Published', progress: 92, updated: '2026-05-12' },
    { id: 2, name: 'Kitchen Inventory', owner: 'Alex', status: 'In Review', progress: 64, updated: '2026-05-10' },
    { id: 3, name: 'Design Tokens', owner: 'Mara', status: 'Draft', progress: 38, updated: '2026-05-08' },
];

const REPORT_COLUMNS: DataViewColumn<ReportRow>[] = [
    {
        key: 'name',
        header: 'Name',
        accessor: row => row.name,
        sortAccessor: row => row.name,
        sortable: true,
        minWidth: 180,
    },
    {
        key: 'owner',
        header: 'Owner',
        accessor: row => row.owner,
        sortAccessor: row => row.owner,
        sortable: true,
        minWidth: 120,
    },
    {
        key: 'status',
        header: 'Status',
        accessor: row => <Badge variant={row.status === 'Published' ? 'success' : row.status === 'In Review' ? 'warning' : 'default'}>{row.status}</Badge>,
        sortAccessor: row => row.status,
        sortable: true,
        minWidth: 130,
    },
    {
        key: 'progress',
        header: 'Progress',
        accessor: row => <ProgressBar value={row.progress} state={row.progress > 80 ? 'success' : 'info'} thin labelPosition="after" showPercentage />,
        sortAccessor: row => row.progress,
        sortable: true,
        minWidth: 180,
    },
];

const TREE_NODES: TreeNode[] = [
    {
        id: 'workspace',
        label: 'Workspace',
        icon: <Icon name="folder" />,
        defaultExpanded: true,
        badge: 3,
        children: [
            { id: 'theme', label: 'Theme Tokens', icon: <Icon name="theme-picker" />, variant: 'info' },
            { id: 'components', label: 'Components', icon: <Icon name="layers" />, variant: 'success', badge: 58 },
            { id: 'playground', label: 'Playground', icon: <Icon name="dashboard" />, variant: 'warning' },
        ],
    },
];

const SUGGESTIONS = [
    { name: 'Accent contrast', value: 4.7, unit: '' },
    { name: 'Card spacing', value: 16, unit: 'px' },
    { name: 'Sidebar density', value: 'Comfortable', unit: '' },
    { name: 'Heading scale', value: 1.25, unit: 'x' },
];

export const ThemeLabPage: React.FC = () => {
    const popover = usePopover();
    const [activeNav, setActiveNav] = useState('overview');
    const [toolbarSearch, setToolbarSearch] = useState('');
    const [standaloneSearch, setStandaloneSearch] = useState('theme');
    const [sortValue, setSortValue] = useState('updated-desc');
    const [statusValue, setStatusValue] = useState<string | null>('review');
    const [textValue, setTextValue] = useState('Theme tuning notes');
    const [emailValue, setEmailValue] = useState('iulia@example.com');
    const [dateValue, setDateValue] = useState('2026-05-14');
    const [numberValue, setNumberValue] = useState<number | undefined>(12);
    const [passwordValue, setPasswordValue] = useState('demo-password');
    const [phoneValue, setPhoneValue] = useState('+1 (555) 123-4567');
    const [phoneDigits, setPhoneDigits] = useState('15551234567');
    const [timeValue, setTimeValue] = useState('09:30');
    const [urlValue, setUrlValue] = useState('https://memobit.com');
    const [textareaValue, setTextareaValue] = useState('Adjust the accent contrast and sidebar density after reviewing this mixed page.');
    const [maskValue, setMaskValue] = useState('');
    const [checkboxValue, setCheckboxValue] = useState(true);
    const [radioValue, setRadioValue] = useState('compact');
    const [toggleValue, setToggleValue] = useState(true);
    const [toggleButtonsValue, setToggleButtonsValue] = useState('preview');
    const [sliderValue, setSliderValue] = useState(68);
    const [ratingValue, setRatingValue] = useState(8);
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [toastType, setToastType] = useState<'info' | 'success' | 'warning' | 'danger' | null>(null);
    const [wizardVisible, setWizardVisible] = useState(true);
    const [splitItem, setSplitItem] = useState<ReportRow | null>(REPORT_ROWS[0]);
    const [scrollBox, setScrollBox] = useState<HTMLElement | null>(null);

    const navItems = [
        { id: 'overview', label: 'Overview', isActive: activeNav === 'overview', icon: 'dashboard' as const, onClick: () => setActiveNav('overview') },
        { id: 'tokens', label: 'Tokens', isActive: activeNav === 'tokens', icon: 'theme-picker' as const, onClick: () => setActiveNav('tokens') },
        { id: 'preview', label: 'Preview', isActive: activeNav === 'preview', icon: 'search' as const, onClick: () => setActiveNav('preview') },
    ];

    const menuItems: MenuHamburgerItem[] = [
        { label: 'Duplicate', icon: 'clipboard', isActive: false, onClick: () => setToastType('info') },
        { label: 'Save snapshot', icon: 'save', isActive: false, onClick: () => setToastType('success') },
        { label: 'Reset tweaks', icon: 'clear', isActive: false, separator: true, onClick: () => setToastType('warning') },
    ];

    const notifications: NotificationPanelItem[] = [
        { id: 'n1', severity: 'warning', message: 'Primary button contrast is close to the minimum threshold.' },
        { id: 'n2', severity: 'critical', message: 'One tooltip variant still uses outdated spacing tokens.' },
    ];

    const wizardSteps: JourneyStep[] = [
        {
            id: 'surface',
            title: 'Surface density',
            subtitle: 'Start with the spacing and card rhythm.',
            content: <Slider value={sliderValue} onChange={setSliderValue} showValueAtTheRight />,
        },
        {
            id: 'states',
            title: 'Interaction states',
            subtitle: 'Confirm the active preview mode.',
            content: (
                <ToggleButtons
                    state={toggleButtonsValue}
                    onToggleChange={setToggleButtonsValue}
                    states={[
                        { key: 'preview', label: 'Preview', icon: 'search' },
                        { key: 'edit', label: 'Edit', icon: 'edit' },
                        { key: 'review', label: 'Review', icon: 'checkmark' },
                    ]}
                />
            ),
        },
        {
            id: 'ready',
            title: 'Ready to review',
            subtitle: 'Save this configuration as a checkpoint.',
            content: <Stats items={[{ label: 'Search', value: toolbarSearch || 'theme' }, { label: 'Mode', value: toggleButtonsValue }, { label: 'Spacing', value: `${sliderValue}%` }]} />,
        },
    ];

    return (
        <div className="theme-lab-page component-page">
            {toastType && <Toast message="Theme lab action triggered" type={toastType} timeout={2200} onClose={() => setToastType(null)} />}

            <div className="theme-lab-page__hero">
                <h1>Theme Lab</h1>
                <p>One page with most components visible together, intended for fast theme tuning and cross-component visual checks.</p>
            </div>

            <section className="page-section">
                <h2>Summary</h2>
                <Stats
                    items={[
                        { label: 'Components on Page', value: '50+' },
                        { label: 'Theme', value: 'Luna' },
                        { label: 'Preview Mode', value: toggleButtonsValue },
                        { label: 'Phone Digits', value: phoneDigits },
                    ]}
                />
                <Separator label="Mini Stats" />
                <div className="theme-lab-page__mini-cards">
                    <MiniStatsCard label="Contrast Passes" value="18" trend={4.3} trendVariant="success" variant="success" />
                    <MiniStatsCard label="Warnings" value="2" trend={-1.2} trendVariant="success" variant="warning" />
                    <MiniStatsCard label="Open Reviews" value="7" variant="info" footer={<span className="theme-lab-page__muted">Updated live</span>} />
                </div>
            </section>

            <section className="page-section">
                <h2>Navigation and Identity</h2>
                <div className="theme-lab-page__toolbar-preview">
                    <Toolbar
                        menuItems={menuItems}
                        notifications={{ items: notifications, panelTitle: 'Theme Alerts' }}
                        search={{ value: toolbarSearch, onChange: setToolbarSearch, placeholder: 'Search tokens or pages...' }}
                        sort={{
                            label: 'Sort',
                            options: [
                                { label: 'Updated desc', value: 'updated-desc' },
                                { label: 'Updated asc', value: 'updated-asc' },
                                { label: 'Name asc', value: 'name-asc' },
                            ],
                            value: sortValue,
                            onChange: value => setSortValue(value || 'updated-desc'),
                        }}
                    />
                </div>

                <div className="theme-lab-page__grid">
                    <Card title="Headers and Trails" icon="dashboard">
                        <div className="theme-lab-page__stack">
                            <AppHeader appName="Theme Lab" heading="Mixed Component Preview" icon="theme-picker" />
                            <Breadcrumb
                                items={[
                                    { label: 'Playground', href: '#' },
                                    { label: 'Testing', href: '#' },
                                    { label: 'Theme Lab' },
                                ]}
                            />
                            <NavBar items={navItems} logo={<strong>Memobit</strong>} actions={<AvatarInitials name="Iulia Marin" size="small" />} />
                        </div>
                    </Card>

                    <Card title="Quick Actions" icon="settings">
                        <div className="theme-lab-page__stack">
                            <div className="theme-lab-page__inline">
                                <AvatarInitials name="Iulia Marin" />
                                <Badge variant="info">Preview</Badge>
                                <Chip selected onClick={() => setToastType('info')}>Selected chip</Chip>
                                <SignalStrength value={82} />
                                <Icon name="information" />
                            </div>
                            <div className="theme-lab-page__inline">
                                <MenuHamburger items={menuItems} />
                                <NotificationPanel items={notifications} panelTitle="Standalone Alerts" />
                                <Tooltip title="Standalone tooltip sample">
                                    <Button variant="plain">Hover me</Button>
                                </Tooltip>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <section className="page-section">
                <h2>Inputs and Selection</h2>
                <div className="theme-lab-page__grid theme-lab-page__grid--wide">
                    <Card title="Form Controls" icon="edit">
                        <div className="theme-lab-page__inputs">
                            <InputText label="Text" value={textValue} onChange={setTextValue} />
                            <InputEmail label="Email" value={emailValue} onChange={setEmailValue} />
                            <InputDate label="Date" value={dateValue} onChange={value => setDateValue(value ?? '')} />
                            <InputNumber label="Number" value={numberValue} onChange={setNumberValue} min={0} max={100} />
                            <InputPassword label="Password" value={passwordValue} onChange={setPasswordValue} />
                            <InputTime label="Time" value={timeValue} onChange={value => setTimeValue(value ?? '')} />
                            <InputUrl label="URL" value={urlValue} onChange={setUrlValue} />
                            <InputMask label="Masked Token" mask={InputMaskPresets.creditCard} onChange={raw => setMaskValue(raw)} />
                            <InputPhone
                                label="Phone"
                                value={phoneValue}
                                onChange={(formatted, digits) => {
                                    setPhoneValue(formatted);
                                    setPhoneDigits(digits);
                                }}
                            />
                            <Dropdown
                                name="theme-status"
                                label="Status"
                                options={STATUS_OPTIONS}
                                value={statusValue}
                                searchable={false}
                                usePortal={false}
                                onChange={option => setStatusValue(option && !Array.isArray(option) ? String(option.value) : null)}
                            />
                            <InputFile label="Input File" onChange={() => undefined} />
                            <Search label="Search" value={standaloneSearch} onChange={setStandaloneSearch} />
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <Textarea label="Notes" value={textareaValue} onChange={setTextareaValue} rows={4} />
                        </div>
                    </Card>

                    <Card title="Choices and Sliders" icon="checkmark">
                        <div className="theme-lab-page__stack">
                            <div className="theme-lab-page__inline">
                                <Checkbox checked={checkboxValue} onChange={setCheckboxValue} label="Enable elevated accents" />
                                <Radio checked={radioValue === 'compact'} name="density" value="compact" label="Compact" onChange={value => setRadioValue(String(value))} />
                                <Radio checked={radioValue === 'comfortable'} name="density" value="comfortable" label="Comfortable" onChange={value => setRadioValue(String(value))} />
                            </div>
                            <div className="theme-lab-page__inline">
                                <ToggleSwitch checked={toggleValue} onChange={setToggleValue} variant="success" />
                                <Rating rating={ratingValue} maxRate={10} selectable onSelect={setRatingValue} />
                            </div>
                            <Slider value={sliderValue} onChange={setSliderValue} showValueAtTheRight />
                            <ToggleButtons
                                state={toggleButtonsValue}
                                onToggleChange={setToggleButtonsValue}
                                states={[
                                    { key: 'preview', label: 'Preview', icon: 'search' },
                                    { key: 'edit', label: 'Edit', icon: 'edit' },
                                    { key: 'review', label: 'Review', icon: 'checkmark' },
                                ]}
                            />
                            <Calendar value={new Date(dateValue)} onChange={() => undefined} showToday={false} />
                            <FileDropzone label="Drop assets here" accept="image/*" onFiles={() => undefined} />
                        </div>
                    </Card>
                </div>
            </section>

            <section className="page-section">
                <h2>Data, Content and Feedback</h2>
                <div className="theme-lab-page__grid theme-lab-page__grid--wide">
                    <Card title="Data View and Bulk Actions" icon="list">
                        <div className="theme-lab-page__stack">
                            <BulkActionBar
                                selectionCount={3}
                                label="3 previews selected"
                                position="top"
                                actions={[
                                    { key: 'publish', label: 'Publish', icon: 'checkmark', variant: 'success', onClick: async () => setToastType('success') },
                                    { key: 'archive', label: 'Archive', icon: 'archive', variant: 'warning', onClick: async () => setToastType('warning') },
                                ]}
                                onClear={() => setToastType('info')}
                            />
                            <DataView
                                columns={REPORT_COLUMNS}
                                data={REPORT_ROWS}
                                rowKey={row => row.id}
                                initialPageSize={5}
                                pageSizeOptions={[5, 10]}
                                itemNoun="reports"
                                actions={row => <Button variant="plain" onClick={() => setSplitItem(row)}>Inspect</Button>}
                            />
                        </div>
                    </Card>

                    <Card title="Lists, Trees and Suggestions" icon="folder">
                        <div className="theme-lab-page__stack">
                            <Accordion
                                allowMultiple
                                defaultExpanded={['palette']}
                                items={[
                                    { id: 'palette', title: 'Palette', content: 'Accent, muted, danger, warning and info tokens line up cleanly here.' },
                                    { id: 'spacing', title: 'Spacing', content: 'This page helps compare compact vs. relaxed spacing across controls.' },
                                ]}
                            />
                            <CollapsibleSection title="Selectable List" icon="layers" withCard>
                                <List
                                    selectable
                                    defaultSelectedId="components"
                                    items={[
                                        { id: 'tokens', label: 'Theme tokens' },
                                        { id: 'components', label: 'Component previews' },
                                        { id: 'states', label: 'Interactive states' },
                                    ]}
                                />
                            </CollapsibleSection>
                            <div className="theme-lab-page__tree-box">
                                <Tree nodes={TREE_NODES} selectable />
                            </div>
                            <div className="theme-lab-page__suggestions-box">
                                <SuggestionsList data={SUGGESTIONS} label="theme" title="Theme Suggestions" enableSearch />
                            </div>
                        </div>
                    </Card>

                    <Card title="Feedback States" icon="information">
                        <div className="theme-lab-page__stack">
                            <ProgressBar value={74} state="info" label="Theme review" labelPosition="after" />
                            <div className="theme-lab-page__inline">
                                <Loading />
                                <Skeleton width={120} height={18} />
                                <Skeleton variant="circular" width={44} height={44} />
                            </div>
                            <Pagination currentPage={2} totalPages={8} totalItems={64} onPageChange={() => undefined} showPagesNumbers />
                            <EmptyState
                                icon="search"
                                title="Nothing filtered out yet"
                                description="Use the controls above to stress-test empty states under your current theme."
                                primary={{ text: 'Create Sample', onClick: () => setToastType('info'), icon: 'plus', variant: 'info' }}
                            />
                        </div>
                    </Card>
                </div>
            </section>

            <section className="page-section">
                <h2>Overlays and Layout</h2>
                <div className="theme-lab-page__grid theme-lab-page__grid--wide">
                    <Card title="Popover, Modal and Drawer" icon="information">
                        <div className="theme-lab-page__stack">
                            <div className="theme-lab-page__inline">
                                <Button onClick={e => popover.toggle('theme-details', e)}>Open Popover</Button>
                                <Popover visible={popover.isVisible('theme-details')} anchorEl={popover.getAnchorEl('theme-details')} onClose={() => popover.hide('theme-details')}>
                                    <strong>Theme detail</strong>
                                    <p style={{ margin: '8px 0 0' }}>Popover surfaces subtle tone and spacing differences quickly.</p>
                                </Popover>
                                <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                                <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
                                <Button variant="warning" onClick={() => setToastType('warning')}>Show Toast</Button>
                            </div>

                            <Modal
                                isOpen={modalOpen}
                                onClose={() => setModalOpen(false)}
                                title="Theme Confirmation"
                                primary={{ text: 'Apply', onClick: () => setModalOpen(false), variant: 'success' }}
                                secondary={{ text: 'Cancel', onClick: () => setModalOpen(false), variant: 'default' }}
                            >
                                <div style={{ padding: '16px' }}>
                                    <p>Use this modal to compare overlay, surface, border, and button styling in one glance.</p>
                                </div>
                            </Modal>

                            <Drawer
                                isOpen={drawerOpen}
                                onClose={() => setDrawerOpen(false)}
                                position="right"
                                title="Theme Tokens"
                                width="420px"
                                primary={{ text: 'Save', onClick: () => setDrawerOpen(false), variant: 'info' }}
                                secondary={{ text: 'Close', onClick: () => setDrawerOpen(false), variant: 'default' }}
                            >
                                <div className="theme-lab-page__stack">
                                    <InputText label="Accent token" value="var(--body-accent-color)" onChange={() => undefined} />
                                    <InputNumber label="Base spacing" value={16} onChange={() => undefined} />
                                </div>
                            </Drawer>
                        </div>
                    </Card>

                    <Card title="Journey Wizard" icon="next">
                        <div className="theme-lab-page__stack">
                            {!wizardVisible && <Button onClick={() => setWizardVisible(true)}>Restart Wizard</Button>}
                            <JourneyWizard
                                isOpen={wizardVisible}
                                onClose={() => setWizardVisible(false)}
                                onComplete={() => {
                                    setWizardVisible(false);
                                    setToastType('success');
                                }}
                                steps={wizardSteps}
                                presentation="inline"
                            />
                        </div>
                    </Card>

                    <Card title="Split Panel" icon="menu-hamburger">
                        <div className="theme-lab-page__split-box">
                            <SplitPanel
                                isPanelOpen={splitItem !== null}
                                onPanelClose={() => setSplitItem(null)}
                                panelTitle={splitItem?.name}
                                defaultLeftPercent={42}
                                panel={
                                    splitItem ? (
                                        <div className="theme-lab-page__stack">
                                            <Badge variant="info">{splitItem.status}</Badge>
                                            <ProgressBar value={splitItem.progress} state="success" labelPosition="after" />
                                            <p className="theme-lab-page__muted">Updated {splitItem.updated}</p>
                                        </div>
                                    ) : null
                                }
                            >
                                <div style={{ padding: '16px' }}>
                                    <List
                                        selectable
                                        defaultSelectedId={REPORT_ROWS[0].id}
                                        items={REPORT_ROWS.map(row => ({
                                            id: row.id,
                                            label: (
                                                <button
                                                    type="button"
                                                    style={{ all: 'unset', cursor: 'pointer', display: 'flex', width: '100%', justifyContent: 'space-between', gap: '12px' }}
                                                    onClick={() => setSplitItem(row)}
                                                >
                                                    <span>{row.name}</span>
                                                    <Badge variant="default" size="small">{row.owner}</Badge>
                                                </button>
                                            ),
                                        }))}
                                    />
                                </div>
                            </SplitPanel>
                        </div>
                    </Card>

                    <Card title="Scroll, Floating and Fixed UI" icon="arrow-up">
                        <div className="theme-lab-page__stack">
                            <div className="theme-lab-page__scroll-box" ref={setScrollBox}>
                                <div className="theme-lab-page__scroll-content">
                                    {Array.from({ length: 10 }, (_, index) => (
                                        <p key={index} style={{ margin: 0 }}>
                                            Scroll sample block {index + 1}. Use this container to inspect nested scrolling, borders, and background surfaces.
                                        </p>
                                    ))}
                                </div>
                                <ScrollToTop scrollContainer={scrollBox} scrollThreshold={80} />
                            </div>
                            <div className="theme-lab-page__float-preview">
                                <p style={{ margin: 0 }}>The floating action button stays visible here for quick accent and elevation checks.</p>
                                <FloatButton
                                    actions={[
                                        { label: 'Save', icon: 'save', onClick: () => setToastType('success') },
                                        { label: 'Add note', icon: 'plus', onClick: () => setToastType('info') },
                                    ]}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
};
