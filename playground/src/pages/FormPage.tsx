import React, { FormEvent, useState } from 'react';

import {
    Button,
    Dropdown,
    DropdownOption,
    InputDate,
    InputEmail,
    InputFile,
    InputMask,
    InputMaskPresets,
    InputNumber,
    InputPassword,
    InputPhone,
    InputSearch,
    InputText,
    InputTextarea,
    InputTime,
    InputUrl,
} from '../../../src';

import './FormPage.scss';

const roleOptions: DropdownOption[] = [
    { value: 'admin', label: 'Admin', details: 'Full workspace access' },
    { value: 'editor', label: 'Editor', details: 'Can manage content' },
    { value: 'viewer', label: 'Viewer', details: 'Read-only access' },
];

const productCategoryOptions: DropdownOption[] = [
    { value: 'hardware', label: 'Hardware' },
    { value: 'software', label: 'Software' },
    { value: 'accessory', label: 'Accessory' },
    { value: 'consumable', label: 'Consumable' },
];

const requestTagOptions: DropdownOption[] = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'budget-approved', label: 'Budget approved' },
    { value: 'replacement', label: 'Replacement' },
    { value: 'new-project', label: 'New project' },
];

export const FormPage: React.FC = () => {
    const [clientSearch, setClientSearch] = useState('acme');
    const [role, setRole] = useState<string>('editor');
    const [fullName, setFullName] = useState('Mara Popescu');
    const [email, setEmail] = useState('mara@example.com');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneDigits, setPhoneDigits] = useState('');
    const [startDate, setStartDate] = useState('2026-05-04');
    const [startTime, setStartTime] = useState('09:30');
    const [profileUrl, setProfileUrl] = useState('https://example.com/team/mara');
    const [employeeId, setEmployeeId] = useState('');
    const [bio, setBio] = useState('Frontend engineer joining the design systems squad.');
    const [resumeName, setResumeName] = useState('');
    const [inviteSubmitted, setInviteSubmitted] = useState(false);

    const [productSearch, setProductSearch] = useState('');
    const [category, setCategory] = useState<string>('hardware');
    const [requestTags, setRequestTags] = useState<string[]>(['budget-approved']);
    const [sku, setSku] = useState('MB-1024');
    const [quantity, setQuantity] = useState<number | undefined>(12);
    const [deliveryDate, setDeliveryDate] = useState('2026-05-18');
    const [deliveryTime, setDeliveryTime] = useState('14:00');
    const [referenceUrl, setReferenceUrl] = useState('');
    const [requestNotes, setRequestNotes] = useState('Need the compact variant with blue labeling.');
    const [attachmentName, setAttachmentName] = useState('');
    const [requestSubmitted, setRequestSubmitted] = useState(false);

    const handleInviteSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setInviteSubmitted(true);
    };

    const handleRequestSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRequestSubmitted(true);
    };

    const handleRoleChange = (option: DropdownOption | DropdownOption[] | null) => {
        setRole(!Array.isArray(option) && option ? option.value.toString() : '');
    };

    const handleCategoryChange = (option: DropdownOption | DropdownOption[] | null) => {
        setCategory(!Array.isArray(option) && option ? option.value.toString() : '');
    };

    const handleTagsChange = (option: DropdownOption | DropdownOption[] | null) => {
        setRequestTags(Array.isArray(option) ? option.map(item => item.value.toString()) : []);
    };

    return (
        <div className="form-page">
            <h1>Forms</h1>
            <p className="form-page__intro">Two complete form examples using the input family together in production-shaped layouts.</p>

            <section className="page-section">
                <h2>Account Intake</h2>
                <form className="form-example" onSubmit={handleInviteSubmit}>
                    <div className="form-field--wide">
                        <InputSearch id="client-search" label="Client lookup" value={clientSearch} onChange={setClientSearch} placeholder="Search clients..." />
                    </div>

                    <div className="form-grid">
                        <Dropdown
                            id="account-role"
                            name="role"
                            label="Role"
                            options={roleOptions}
                            value={role}
                            onChange={handleRoleChange}
                            placeholder="Select a role"
                            success={role ? 'Role selected' : undefined}
                        />
                        <InputText id="full-name" label="Full name" required value={fullName} onChange={setFullName} placeholder="Enter full name" />
                        <InputEmail
                            id="work-email"
                            label="Work email"
                            required
                            value={email}
                            onChange={setEmail}
                            showValidation
                            validateOn="both"
                            success={email.includes('@') ? 'Email format looks good' : undefined}
                        />
                        <InputPassword
                            id="temporary-password"
                            label="Temporary password"
                            required
                            value={password}
                            onChange={setPassword}
                            placeholder="Create a temporary password"
                            error={password && password.length < 8 ? 'Use at least 8 characters' : undefined}
                        />
                        <InputPhone
                            id="mobile-phone"
                            label="Mobile phone"
                            value={phone}
                            onChange={(formatted, digits) => {
                                setPhone(formatted);
                                setPhoneDigits(digits);
                            }}
                            error={phoneDigits.length > 0 && phoneDigits.length < 11 ? 'Enter the full number' : undefined}
                        />
                    </div>

                    <div className="form-grid form-grid--compact">
                        <InputDate id="start-date" label="Start date" value={startDate} onChange={value => setStartDate(value ?? '')} required />
                        <InputTime id="start-time" label="Start time" value={startTime} onChange={value => setStartTime(value ?? '')} />
                        <InputMask
                            id="employee-id"
                            label="Employee ID"
                            mask="aa-9999"
                            value={employeeId}
                            onChange={raw => setEmployeeId(raw)}
                            hint="Format: AA-0000"
                        />
                    </div>

                    <div className="form-grid">
                        <InputUrl id="profile-url" label="Profile URL" value={profileUrl} onChange={setProfileUrl} />
                        <InputFile
                            id="resume"
                            label="Resume"
                            accept=".pdf,.doc,.docx"
                            onChange={files => setResumeName(files?.[0]?.name ?? '')}
                            success={resumeName ? `${resumeName} selected` : undefined}
                        />
                    </div>

                    <InputTextarea id="bio" label="Internal bio" value={bio} onChange={setBio} rows={4} maxLength={240} placeholder="Add a short internal note" />

                    <div className="form-actions">
                        <Button type="submit" variant="success">
                            Create invite
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setInviteSubmitted(false)}>
                            Clear status
                        </Button>
                    </div>

                    {inviteSubmitted && (
                        <div className="form-summary">
                            <span>
                                <strong>Invite ready:</strong> {fullName || 'Unnamed user'} as {role || 'no role'} for {clientSearch || 'no client selected'}.
                            </span>
                            <span>
                                Start window: {startDate || 'No date'} at {startTime || 'No time'}.
                            </span>
                        </div>
                    )}
                </form>
            </section>

            <section className="page-section">
                <h2>Product Request</h2>
                <form className="form-example" onSubmit={handleRequestSubmit}>
                    <div className="form-grid">
                        <InputSearch id="product-search" label="Product search" value={productSearch} onChange={setProductSearch} placeholder="Find products..." />
                        <Dropdown
                            id="product-category"
                            name="category"
                            label="Category"
                            options={productCategoryOptions}
                            value={category}
                            onChange={handleCategoryChange}
                            placeholder="Select category"
                        />
                        <InputText id="sku" label="SKU" required value={sku} onChange={setSku} highlighted />
                    </div>

                    <div className="form-grid form-grid--compact">
                        <InputNumber
                            id="quantity"
                            label="Quantity"
                            min={1}
                            max={500}
                            step={1}
                            value={quantity}
                            onChange={setQuantity}
                            required
                            success={quantity && quantity > 0 ? 'Quantity accepted' : undefined}
                        />
                        <InputDate
                            id="delivery-date"
                            label="Delivery date"
                            value={deliveryDate}
                            onChange={value => setDeliveryDate(value ?? '')}
                            min="2026-04-23"
                        />
                        <InputTime
                            id="delivery-time"
                            label="Delivery time"
                            value={deliveryTime}
                            onChange={value => setDeliveryTime(value ?? '')}
                            min="08:00"
                            max="18:00"
                        />
                        <InputMask id="asset-tag" label="Asset tag" mask={InputMaskPresets.serialNumber} hint="Optional serialized item" />
                    </div>

                    <Dropdown
                        id="request-tags"
                        name="requestTags"
                        label="Request tags"
                        options={requestTagOptions}
                        value={requestTags}
                        multiple
                        selectedCountDisplay="floating"
                        onChange={handleTagsChange}
                        placeholder="Select tags"
                    />

                    <div className="form-grid">
                        <InputUrl
                            id="reference-url"
                            label="Reference URL"
                            value={referenceUrl}
                            onChange={setReferenceUrl}
                            placeholder="https://supplier.example/item"
                        />
                        <InputFile
                            id="request-attachment"
                            label="Attachment"
                            accept="image/*,.pdf"
                            onChange={files => setAttachmentName(files?.[0]?.name ?? '')}
                            success={attachmentName ? `${attachmentName} selected` : undefined}
                        />
                    </div>

                    <InputTextarea
                        id="request-notes"
                        label="Request notes"
                        required
                        value={requestNotes}
                        onChange={setRequestNotes}
                        rows={5}
                        error={!requestNotes ? 'Notes are required for purchasing' : undefined}
                    />

                    <div className="form-actions">
                        <Button type="submit" variant="default">
                            Submit request
                        </Button>
                        <Button type="button" variant="plain" onClick={() => setRequestSubmitted(false)}>
                            Dismiss status
                        </Button>
                    </div>

                    {requestSubmitted && (
                        <div className="form-summary">
                            <span>
                                <strong>Request queued:</strong> {quantity ?? 0} {category || 'uncategorized'} unit(s) for{' '}
                                {sku || productSearch || 'selected product'}.
                            </span>
                            <span>
                                Target delivery: {deliveryDate || 'No date'} at {deliveryTime || 'No time'}.
                            </span>
                        </div>
                    )}
                </form>
            </section>
        </div>
    );
};
