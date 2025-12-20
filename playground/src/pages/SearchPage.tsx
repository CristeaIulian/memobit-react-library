import React, { useState } from 'react';
import { Search } from '../../../src';

export const SearchPage: React.FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [searchValue3, setSearchValue3] = useState('');

    return (
        <div className="component-page">
            <h1>Search Component</h1>
            <p>A search input component built on top of InputText with a search icon.</p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Default Search</h3>
                    <div className="component-group">
                        <Search
                            value={searchValue}
                            onChange={setSearchValue}
                            placeholder="Search..."
                        />
                        <p style={{ marginTop: '12px' }}>Current value: {searchValue || '(empty)'}</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Placeholder</h2>
                <div className="showcase-group">
                    <h3>Different Placeholder Text</h3>
                    <div className="component-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Search
                            value={searchValue2}
                            onChange={setSearchValue2}
                            placeholder="Search for products..."
                        />
                        <Search
                            value={searchValue3}
                            onChange={setSearchValue3}
                            placeholder="Find users..."
                        />
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
                            <Search placeholder="Search..." />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Disabled</label>
                            <Search placeholder="Search..." disabled value="Disabled search" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Read-only</label>
                            <Search placeholder="Search..." readOnly value="Read-only search" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Auto-focused</label>
                            <Search placeholder="Search..." autoFocus />
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
                            <Search placeholder="Search..." autoComplete="on" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>AutoComplete Off (default)</label>
                            <Search placeholder="Search..." autoComplete="off" />
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
                            <Search placeholder="Search for products by name or SKU..." />
                        </div>

                        <div>
                            <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>User Search</h4>
                            <Search placeholder="Search users by name or email..." />
                        </div>

                        <div>
                            <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>Document Search</h4>
                            <Search placeholder="Search documents..." />
                        </div>

                        <div>
                            <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>Table Filter</h4>
                            <Search placeholder="Filter table results..." />
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Event Handlers</h2>
                <div className="showcase-group">
                    <h3>With Event Handlers</h3>
                    <div className="component-group">
                        <Search
                            placeholder="Type and press Enter..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    alert(`Search submitted: ${(e.target as HTMLInputElement).value}`);
                                }
                            }}
                        />
                        <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--body-color-muted)' }}>
                            Press Enter to trigger search
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
