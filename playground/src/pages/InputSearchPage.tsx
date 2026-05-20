import React, { useState } from 'react';
import { InputSearch } from '../../../src';

export const InputSearchPage: React.FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [searchValue3, setSearchValue3] = useState('');
    const [eventSearchValue, setEventSearchValue] = useState('');
    const [lastEvent, setLastEvent] = useState('No event yet');

    return (
        <div className="component-page">
            <h1>InputSearch Component</h1>
            <p>A search input component built on top of InputText with a search icon.</p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Default Search</h3>
                    <div className="component-group">
                        <InputSearch value={searchValue} onChange={setSearchValue} placeholder="Search..." />
                        <p style={{ marginTop: '12px' }}>Current value: {searchValue || '(empty)'}</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Placeholder</h2>
                <div className="showcase-group">
                    <h3>Different Placeholder Text</h3>
                    <div className="component-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <InputSearch value={searchValue2} onChange={setSearchValue2} placeholder="Search for products..." />
                        <InputSearch value={searchValue3} onChange={setSearchValue3} placeholder="Find users..." />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>States</h2>
                <div className="showcase-group">
                    <h3>Different States</h3>
                    <div className="component-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Normal</label>
                            <InputSearch placeholder="Search..." />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Disabled</label>
                            <InputSearch placeholder="Search..." disabled value="Disabled search" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Read-only</label>
                            <InputSearch placeholder="Search..." readOnly value="Read-only search" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Auto-focused</label>
                            <InputSearch placeholder="Search..." autoFocus />
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>With AutoComplete</h2>
                <div className="showcase-group">
                    <h3>AutoComplete On/Off</h3>
                    <div className="component-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>AutoComplete On</label>
                            <InputSearch placeholder="Search..." autoComplete="on" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>AutoComplete Off (default)</label>
                            <InputSearch placeholder="Search..." autoComplete="off" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Use Cases</h2>
                <div className="showcase-group">
                    <h3>Common Use Cases</h3>
                    <div className="component-group" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>Product Search</h4>
                            <InputSearch placeholder="Search for products by name or SKU..." />
                        </div>

                        <div>
                            <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>User Search</h4>
                            <InputSearch placeholder="Search users by name or email..." />
                        </div>

                        <div>
                            <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>Document Search</h4>
                            <InputSearch placeholder="Search documents..." />
                        </div>

                        <div>
                            <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>Table Filter</h4>
                            <InputSearch placeholder="Filter table results..." />
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Event Handlers</h2>
                <div className="showcase-group">
                    <h3>With Event Handlers</h3>
                    <div className="component-group">
                        <InputSearch
                            value={eventSearchValue}
                            onChange={setEventSearchValue}
                            placeholder="Type and press Enter..."
                            required
                            onBlur={() => setLastEvent('blur')}
                            onClick={() => setLastEvent('click')}
                            onKeyDown={e => {
                                setLastEvent(`key down: ${e.key}`);
                                if (e.key === 'Enter') {
                                    alert(`Search submitted: ${(e.target as HTMLInputElement).value}`);
                                }
                            }}
                            onKeyUp={event => setLastEvent(`key up: ${event.key}`)}
                        />
                        <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--body-color-muted)' }}>Press Enter to trigger search</p>
                        <p>Last event: {lastEvent}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
