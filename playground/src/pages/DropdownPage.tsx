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
                            searchable
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
                            searchable
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
                            searchable
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
                            searchable
                            searchValue={clinicSearch}
                            onSearchChange={handleClinicSearchChange}
                            allowCustomValue
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
                            usePortal
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
