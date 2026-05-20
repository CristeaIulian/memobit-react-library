import React, { useState } from 'react';

import { Checkbox, Button } from '../../../src';

interface Preferences {
    notifications: boolean;
    newsletter: boolean;
    updates: boolean;
    marketing: boolean;
}

export const CheckboxPage: React.FC = () => {
    const [isChecked, setChecked] = useState<boolean>(false);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [subscribeNewsletter, setSubscribeNewsletter] = useState<boolean>(true);

    const [preferences, setPreferences] = useState<Preferences>({
        notifications: true,
        newsletter: false,
        updates: true,
        marketing: false,
    });

    const [features, setFeatures] = useState({
        darkMode: false,
        autoSave: true,
        analytics: false,
        betaFeatures: false,
    });

    const [selectedItems, setSelectedItems] = useState<string[]>(['item1']);

    const allItemsSelected = selectedItems.length === 3;
    const someItemsSelected = selectedItems.length > 0 && selectedItems.length < 3;

    const toggleItem = (item: string) => {
        setSelectedItems(prev => (prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]));
    };

    const toggleAll = () => {
        if (allItemsSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(['item1', 'item2', 'item3']);
        }
    };

    const updatePreference = (key: keyof Preferences, value: boolean) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="checkbox-page">
            <h1>Checkbox Component</h1>
            <p>A checkbox component for selection inputs.</p>

            <section className="page-section">
                <h2>Basic Examples</h2>

                <div className="showcase-group">
                    <h3>Single Checkbox</h3>
                    <div className="component-group">
                        <Checkbox checked={isChecked} onChange={setChecked} label="Accept terms and conditions" />
                        <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--body-color-muted)' }}>Status: {isChecked ? 'Checked' : 'Unchecked'}</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Multiple Checkboxes</h3>
                    <div className="component-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Checkbox
                            checked={preferences.notifications}
                            onChange={value => updatePreference('notifications', value)}
                            label="Email notifications"
                        />
                        <Checkbox checked={preferences.newsletter} onChange={value => updatePreference('newsletter', value)} label="Weekly newsletter" />
                        <Checkbox checked={preferences.updates} onChange={value => updatePreference('updates', value)} label="Product updates" />
                        <Checkbox checked={preferences.marketing} onChange={value => updatePreference('marketing', value)} label="Marketing communications" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Horizontal Layout</h3>
                    <div className="component-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <Checkbox checked={features.darkMode} onChange={value => setFeatures({ ...features, darkMode: value })} label="Dark Mode" />
                        <Checkbox checked={features.autoSave} onChange={value => setFeatures({ ...features, autoSave: value })} label="Auto Save" />
                        <Checkbox checked={features.analytics} onChange={value => setFeatures({ ...features, analytics: value })} label="Analytics" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>With Icons</h3>
                    <div className="component-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Checkbox checked={features.darkMode} onChange={value => setFeatures({ ...features, darkMode: value })} icon="moon" label="Dark mode" />
                        <Checkbox checked={features.autoSave} onChange={value => setFeatures({ ...features, autoSave: value })} icon="save" label="Auto-save" />
                        <Checkbox
                            checked={features.analytics}
                            onChange={value => setFeatures({ ...features, analytics: value })}
                            icon="chart"
                            label="Send analytics"
                        />
                        <Checkbox
                            checked={features.betaFeatures}
                            onChange={value => setFeatures({ ...features, betaFeatures: value })}
                            icon="laboratory"
                            label="Beta features"
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Checkbox Without Label</h3>
                    <div className="component-group" style={{ display: 'flex', gap: '12px' }}>
                        <Checkbox checked={isChecked} onChange={setChecked} />
                        <Checkbox checked={true} onChange={() => {}} />
                        <Checkbox checked={false} onChange={() => {}} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>States</h2>

                <div className="showcase-group">
                    <h3>Disabled State</h3>
                    <div className="component-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Checkbox checked={false} label="Disabled unchecked" disabled />
                        <Checkbox checked={true} label="Disabled checked" disabled />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Indeterminate State</h3>
                    <div className="component-group">
                        <Checkbox checked={false} indeterminate label="Some nested options selected" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Real-World Examples</h2>

                <div className="showcase-group">
                    <h3>Form Agreement</h3>
                    <div
                        className="component-group"
                        style={{
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}
                    >
                        <h4 style={{ marginTop: 0, marginBottom: '12px' }}>Complete Registration</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Checkbox checked={termsAccepted} onChange={setTermsAccepted} label="I accept the terms and conditions" />
                            <Checkbox checked={subscribeNewsletter} onChange={setSubscribeNewsletter} label="Subscribe to newsletter (optional)" />
                        </div>
                        <Button variant="success" disabled={!termsAccepted} style={{ marginTop: '16px' }} onClick={() => alert('Registration submitted!')}>
                            Register
                        </Button>
                        <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--body-color-muted)' }}>
                            Note: Submit button is disabled until terms are accepted.
                        </p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Select All / None</h3>
                    <div
                        className="component-group"
                        style={{
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}
                    >
                        <h4 style={{ marginTop: 0, marginBottom: '12px' }}>Export Items</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div
                                style={{
                                    paddingBottom: '8px',
                                    borderBottom: '1px solid var(--border-color)',
                                    marginBottom: '4px',
                                }}
                            >
                                <Checkbox
                                    checked={allItemsSelected}
                                    onChange={toggleAll}
                                    label={allItemsSelected ? 'Deselect All' : someItemsSelected ? 'Select All' : 'Select All'}
                                />
                                {someItemsSelected && !allItemsSelected && (
                                    <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--body-color-muted)' }}>
                                        ({selectedItems.length} selected)
                                    </span>
                                )}
                            </div>
                            <div style={{ marginLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Checkbox checked={selectedItems.includes('item1')} onChange={() => toggleItem('item1')} label="Export Documents" />
                                <Checkbox checked={selectedItems.includes('item2')} onChange={() => toggleItem('item2')} label="Export Images" />
                                <Checkbox checked={selectedItems.includes('item3')} onChange={() => toggleItem('item3')} label="Export Videos" />
                            </div>
                        </div>
                        <div>
                            <Button
                                variant="info"
                                disabled={selectedItems.length === 0}
                                style={{ marginTop: '16px' }}
                                onClick={() => alert(`Exporting: ${selectedItems.join(', ')}`)}
                            >
                                Export Selected ({selectedItems.length})
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Settings Panel</h3>
                    <div
                        className="component-group"
                        style={{
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}
                    >
                        <h4 style={{ marginTop: 0, marginBottom: '12px' }}>Application Settings</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <h5 style={{ marginTop: 0, marginBottom: '8px', fontSize: '14px' }}>Appearance</h5>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '12px' }}>
                                    <Checkbox
                                        checked={features.darkMode}
                                        onChange={value => setFeatures({ ...features, darkMode: value })}
                                        label="Enable dark mode"
                                    />
                                </div>
                            </div>
                            <div>
                                <h5 style={{ marginTop: 0, marginBottom: '8px', fontSize: '14px' }}>Editor</h5>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '12px' }}>
                                    <Checkbox
                                        checked={features.autoSave}
                                        onChange={value => setFeatures({ ...features, autoSave: value })}
                                        label="Auto-save changes"
                                    />
                                </div>
                            </div>
                            <div>
                                <h5 style={{ marginTop: 0, marginBottom: '8px', fontSize: '14px' }}>Advanced</h5>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '12px' }}>
                                    <Checkbox
                                        checked={features.analytics}
                                        onChange={value => setFeatures({ ...features, analytics: value })}
                                        label="Send usage analytics"
                                    />
                                    <Checkbox
                                        checked={features.betaFeatures}
                                        onChange={value => setFeatures({ ...features, betaFeatures: value })}
                                        label="Enable beta features"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '12px',
                                backgroundColor: 'var(--card-background-accent-color)',
                                borderRadius: '4px',
                                fontSize: '12px',
                            }}
                        >
                            <strong>Active Settings:</strong>
                            <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                                {features.darkMode && <li>Dark Mode</li>}
                                {features.autoSave && <li>Auto Save</li>}
                                {features.analytics && <li>Analytics</li>}
                                {features.betaFeatures && <li>Beta Features</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
