import React from 'react';

import { Dropdown, DropdownOption } from '../../../src';

export const DropdownPage: React.FC = () => {
    const formatClinicOptions = [
        { value: 'option-1', label: '1st clinic' },
        { value: 'option-2', label: '2nd clinic', details: 'some details as well' },
        { value: 'option-3', label: '3rd clinic' },
    ];

    const dropdownLongTextOptions = [
        { value: 'option-1', label: 'This is a long text' },
        { value: 'option-2', label: 'This is another long text' },
        { value: 'option-3', label: 'And here is the 3rd long text' },
    ];

    const largeListOptions = [
        { value: 'country-1', label: 'United States', details: 'North America' },
        { value: 'country-2', label: 'United Kingdom', details: 'Europe' },
        { value: 'country-3', label: 'Canada', details: 'North America' },
        { value: 'country-4', label: 'Australia', details: 'Oceania' },
        { value: 'country-5', label: 'Germany', details: 'Europe' },
        { value: 'country-6', label: 'France', details: 'Europe' },
        { value: 'country-7', label: 'Japan', details: 'Asia' },
        { value: 'country-8', label: 'Brazil', details: 'South America' },
        { value: 'country-9', label: 'India', details: 'Asia' },
        { value: 'country-10', label: 'Mexico', details: 'North America' },
        { value: 'country-11', label: 'Italy', details: 'Europe' },
        { value: 'country-12', label: 'Spain', details: 'Europe' },
        { value: 'country-13', label: 'South Korea', details: 'Asia' },
        { value: 'country-14', label: 'Netherlands', details: 'Europe' },
        { value: 'country-15', label: 'Switzerland', details: 'Europe' },
    ];

    const selectedClinic = 'option-2--temp';
    const clinicSearch = '2nd';

    const handleClinicSelect = (newOption: DropdownOption | DropdownOption[] | null) => {
        console.log('handleClinicSelect', newOption);
    };

    const handleClinicSearchChange = (search: string) => {
        console.log('handleClinicSearchChange', search);
    };

    return (
        <div className="dropdown-page">
            <h1>Dropdown Component</h1>
            <p>A flexible dropdown component with search, multi-select, and custom value support.</p>

            <section className="page-section">
                <h2>Basic Dropdown</h2>

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
                            searchValue={clinicSearch}
                            onSearchChange={handleClinicSearchChange}
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
                            searchValue={clinicSearch}
                            onSearchChange={handleClinicSearchChange}
                            allowCustomValue
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
                            searchValue={clinicSearch}
                            onSearchChange={handleClinicSearchChange}
                            allowCustomValue
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
                            searchValue={clinicSearch}
                            onSearchChange={handleClinicSearchChange}
                            allowCustomValue
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Validation States</h3>
                    <p style={{ fontSize: '14px', color: 'var(--body-color-muted)', marginBottom: '12px' }}>
                        Dropdowns support error and success validation messages.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="component-group" style={{ width: '60%' }}>
                            <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Error State</h4>
                            <Dropdown
                                name="error-dropdown"
                                label="Clinic Selection"
                                options={formatClinicOptions}
                                onChange={handleClinicSelect}
                                placeholder="Select a clinic..."
                                error="Please select a valid clinic"
                            />
                        </div>

                        <div className="component-group" style={{ width: '60%' }}>
                            <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Success State</h4>
                            <Dropdown
                                name="success-dropdown"
                                label="Clinic Selection"
                                options={formatClinicOptions}
                                value="option-2"
                                onChange={handleClinicSelect}
                                placeholder="Select a clinic..."
                                success="Clinic selected successfully"
                            />
                        </div>
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
                            searchValue={clinicSearch}
                            onSearchChange={handleClinicSearchChange}
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
                            searchValue={clinicSearch}
                            onSearchChange={handleClinicSearchChange}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Dropdown with Large List (15 items)</h3>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Dropdown
                            name="country-dropdown"
                            label="Select Country"
                            options={largeListOptions}
                            onChange={newOption => console.log('handleCountrySelect', newOption)}
                            placeholder="Search or select a country..."
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Field Styling and Value Display</h3>
                    <div className="component-group" style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <Dropdown
                            name="highlighted-dropdown"
                            label="Highlighted country"
                            options={largeListOptions}
                            value="country-7"
                            onChange={newOption => console.log('handleHighlightedSelect', newOption)}
                            placeholder="Search or select a country..."
                            highlighted
                            autofocus
                        />
                        <Dropdown
                            name="plain-value-dropdown"
                            label="Selected value without chip"
                            options={largeListOptions}
                            value="country-4"
                            onChange={newOption => console.log('handlePlainValueSelect', newOption)}
                            placeholder="Search or select a country..."
                            valueAsChip={false}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Large List with Multi-Select</h3>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Dropdown
                            name="countries-multi-dropdown"
                            label="Select Countries"
                            options={largeListOptions}
                            multiple
                            onChange={newOptions => console.log('handleCountriesSelect', newOptions)}
                            placeholder="Search or select countries..."
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Selected Count Display Options (Multi-Select)</h3>
                    <p style={{ fontSize: '14px', color: 'var(--body-color-muted)', marginBottom: '12px' }}>
                        The selectedCountDisplay prop controls how the selection count is shown, preventing height changes in forms.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div className="component-group" style={{ width: '60%' }}>
                            <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Inline (Default) - Shows inside placeholder</h4>
                            <Dropdown
                                name="inline-count"
                                label="Countries (Inline)"
                                options={largeListOptions}
                                multiple
                                selectedCountDisplay="inline"
                                onChange={newOptions => console.log('inline', newOptions)}
                                placeholder="Select countries..."
                            />
                        </div>

                        <div className="component-group" style={{ width: '60%' }}>
                            <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Floating - Shows below input (maintains height)</h4>
                            <Dropdown
                                name="floating-count"
                                label="Countries (Floating)"
                                options={largeListOptions}
                                multiple
                                selectedCountDisplay="floating"
                                onChange={newOptions => console.log('floating', newOptions)}
                                placeholder="Select countries..."
                            />
                        </div>

                        <div className="component-group" style={{ width: '60%' }}>
                            <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>None - Hides count completely</h4>
                            <Dropdown
                                name="none-count"
                                label="Countries (No Count)"
                                options={largeListOptions}
                                multiple
                                selectedCountDisplay="none"
                                onChange={newOptions => console.log('none', newOptions)}
                                placeholder="Select countries..."
                            />
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Dropdown Near Bottom (Auto Opens Upward)</h3>
                    <p style={{ fontSize: '14px', color: 'var(--body-color-muted)', marginBottom: '12px' }}>
                        This dropdown is positioned near the bottom of the page. It should automatically open upward to stay visible.
                    </p>
                    <div className="component-group" style={{ width: '60%' }}>
                        <Dropdown
                            name="bottom-dropdown"
                            label="Select Country (Opens Upward)"
                            options={largeListOptions}
                            onChange={newOption => console.log('handleBottomSelect', newOption)}
                            placeholder="Search or select a country..."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
