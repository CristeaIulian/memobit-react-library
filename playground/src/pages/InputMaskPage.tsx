import React, { useRef, useState } from 'react';

import { InputMask, InputMaskPresets, InputMaskHandle, Button } from '../../../src';
import { bank } from '../../../src/icons/bank';
import { clipboard } from '../../../src/icons/clipboard';
import { creditCard } from '../../../src/icons/credit-card';
import { earth } from '../../../src/icons/earth';
import { key } from '../../../src/icons/key';
import { phone } from '../../../src/icons/phone';
import { security } from '../../../src/icons/security';

// ── Copy-to-clipboard suffix button ───────────────────────────────────────────
const CopyButton: React.FC<{ getValue: () => string }> = ({ getValue }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const text = getValue();
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for HTTP / non-secure contexts
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // copy not available
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            title="Copy to clipboard"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                background: copied ? 'rgba(52,211,153,0.15)' : 'var(--card-background-accent-color)',
                color: copied ? 'var(--button-success-border-color)' : 'var(--body-color-muted)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                flexShrink: 0,
            }}
        >
            {clipboard}
        </button>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────

export const InputMaskPage: React.FC = () => {
    const [cardValue, setCardValue] = useState('');
    const [ibanRaw, setIbanRaw] = useState('');
    const [phoneValue, setPhoneValue] = useState('');
    const [cvvValue, setCvvValue] = useState('');
    const [expiryValue, setExpiryValue] = useState('');
    const [serialComplete, setSerialComplete] = useState(false);
    const [customMask, setCustomMask] = useState('99-aaa-****');
    const [customValue, setCustomValue] = useState('');

    const ibanRef = useRef<InputMaskHandle>(null);

    return (
        <div className="component-page">
            <h1>InputMask Component</h1>
            <p>Formatted input for structured data — credit cards, IBANs, phone numbers, serial numbers, and any custom pattern.</p>

            {/* ── Payment fields ──────────────────────────────────────── */}
            <section className="page-section">
                <h2>Payment Card</h2>
                <p className="section-description">
                    Credit card number, expiry, and CVV using built-in presets. The input border turns green when all slots are filled (<code>onComplete</code>
                    ).
                </p>
                <div className="showcase-group">
                    <div className="component-group" style={{ flexDirection: 'column', gap: 'var(--spacing-16)', maxWidth: 360 }}>
                        <InputMask
                            label="Card number"
                            mask={InputMaskPresets.creditCard}
                            icon={creditCard}
                            placeholder="1234 5678 9012 3456"
                            hint="16-digit card number"
                            autoComplete="cc-number"
                            onChange={(_raw, masked) => setCardValue(masked)}
                        />
                        <div className="component-group" style={{ gap: 'var(--spacing-12)' }}>
                            <InputMask
                                label="Expiry"
                                mask={InputMaskPresets.expiry}
                                placeholder="MM/YY"
                                autoComplete="cc-exp"
                                onChange={(_, m) => setExpiryValue(m)}
                            />
                            <InputMask
                                label="CVV"
                                mask={InputMaskPresets.cvv}
                                icon={security}
                                placeholder="•••"
                                hint="3 digits"
                                autoComplete="off"
                                onChange={(_, m) => setCvvValue(m)}
                            />
                        </div>
                        {(cardValue || expiryValue || cvvValue) && (
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--body-color-muted)', fontFamily: 'monospace' }}>
                                {cardValue || '—'} &nbsp;|&nbsp; {expiryValue || '—'} &nbsp;|&nbsp; {cvvValue || '—'}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* ── IBAN ────────────────────────────────────────────────── */}
            <section className="page-section">
                <h2>IBAN</h2>
                <p className="section-description">
                    Alphanumeric mask (<code>aa99 9999…</code>) with a copy-to-clipboard suffix and a ref-based clear button.
                </p>
                <div className="showcase-group">
                    <div className="component-group" style={{ flexDirection: 'column', gap: 'var(--spacing-16)', maxWidth: 460 }}>
                        <InputMask
                            ref={ibanRef}
                            label="IBAN"
                            mask={InputMaskPresets.iban}
                            icon={bank}
                            hint="International Bank Account Number"
                            size="lg"
                            suffix={<CopyButton getValue={() => ibanRaw} />}
                            onChange={raw => {
                                setIbanRaw(raw);
                            }}
                        />
                        <div className="component-group">
                            <Button type="button" className="btn btn--default" onClick={() => ibanRef.current?.clear()}>
                                Clear
                            </Button>
                            <Button type="button" className="btn btn--default" onClick={() => ibanRef.current?.focus()}>
                                Focus
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Phone ───────────────────────────────────────────────── */}
            <section className="page-section">
                <h2>Phone Number</h2>
                <p className="section-description">
                    International format with country code. Uses a small size and shows a validation error state when partially filled.
                </p>
                <div className="showcase-group">
                    <div style={{ maxWidth: 300 }}>
                        <InputMask
                            label="Phone"
                            mask={InputMaskPresets.phone}
                            icon={phone}
                            size="sm"
                            hint="Include country code"
                            variant={phoneValue.length > 0 && phoneValue.length < 11 ? 'danger' : phoneValue.length === 11 ? 'success' : 'default'}
                            error={phoneValue.length > 0 && phoneValue.length < 11 ? 'Incomplete phone number' : undefined}
                            onChange={raw => setPhoneValue(raw)}
                        />
                    </div>
                </div>
            </section>

            {/* ── Serial number ───────────────────────────────────────── */}
            <section className="page-section">
                <h2>Serial Number</h2>
                <p className="section-description">
                    Alphanumeric groups (<code>***-***-***-***</code>). The <code>onComplete</code> callback fires when all 12 characters are entered, toggling
                    the success state.
                </p>
                <div className="showcase-group">
                    <div style={{ maxWidth: 340 }}>
                        <InputMask
                            label="Serial number"
                            mask={InputMaskPresets.serialNumber}
                            icon={key}
                            variant={serialComplete ? 'success' : 'default'}
                            hint={serialComplete ? '✓ Valid serial number' : 'Format: XXX-XXX-XXX-XXX'}
                            onChange={raw => {
                                if (raw.length < 12) setSerialComplete(false);
                            }}
                            onComplete={() => setSerialComplete(true)}
                        />
                    </div>
                </div>
            </section>

            {/* ── IP address ──────────────────────────────────────────── */}
            <section className="page-section">
                <h2>IPv4 Address</h2>
                <p className="section-description">
                    Digit-only mask with dot separators. Demonstrates <code>readOnly</code> — useful for displaying structured data without interaction.
                </p>
                <div className="showcase-group">
                    <div className="component-group" style={{ flexDirection: 'column', gap: 'var(--spacing-12)', maxWidth: 260 }}>
                        <InputMask label="IP address" mask={InputMaskPresets.ipv4} icon={earth} />
                        <InputMask label="Read-only" mask={InputMaskPresets.ipv4} icon={earth} value="192168001001" readOnly hint="Not editable" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Field Styling Options</h2>
                <div className="showcase-group">
                    <div className="component-group" style={{ flexDirection: 'column', gap: 'var(--spacing-16)', maxWidth: 360 }}>
                        <InputMask
                            label="Membership code"
                            name="membershipCode"
                            mask="aaa-999"
                            maskChar="•"
                            mono={false}
                            highlighted
                            hint="Uses a custom mask character and proportional text."
                            onChange={() => undefined}
                        />
                    </div>
                </div>
            </section>

            {/* ── Custom mask playground ──────────────────────────────── */}
            <section className="page-section">
                <h2>Custom Mask Playground</h2>
                <p className="section-description">
                    Edit the mask pattern and see the component react live. Tokens: <code>9</code> = digit, <code>a</code> = letter, <code>*</code> =
                    alphanumeric. Everything else is a literal separator.
                </p>
                <div className="showcase-group">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)', maxWidth: 400 }}>
                        <div>
                            <label
                                htmlFor="mask-pattern"
                                style={{
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: 'var(--body-color)',
                                    display: 'block',
                                    marginBottom: 'var(--spacing-4)',
                                }}
                            >
                                Mask pattern
                            </label>
                            <input
                                id="mask-pattern"
                                type="text"
                                value={customMask}
                                onChange={e => {
                                    setCustomMask(e.target.value);
                                    setCustomValue('');
                                }}
                                style={{
                                    width: '100%',
                                    height: 36,
                                    padding: '0 var(--spacing-12)',
                                    border: '1px solid var(--form-control-border-color)',
                                    borderRadius: 'var(--radius)',
                                    background: 'var(--form-control-background-color)',
                                    color: 'var(--form-control-color)',
                                    fontFamily: 'monospace',
                                    fontSize: 'var(--font-size-sm)',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <InputMask label="Result" mask={customMask || '_'} hint={`Pattern: "${customMask}"`} onChange={raw => setCustomValue(raw)} />
                        {customValue && (
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--body-color-muted)', fontFamily: 'monospace' }}>
                                Raw: <strong style={{ color: 'var(--body-accent-color)' }}>{customValue}</strong>
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Disabled ────────────────────────────────────────────── */}
            <section className="page-section">
                <h2>Disabled State</h2>
                <div className="showcase-group">
                    <div style={{ maxWidth: 340 }}>
                        <InputMask
                            label="Card number (disabled)"
                            mask={InputMaskPresets.creditCard}
                            icon={creditCard}
                            disabled
                            hint="This field is not editable"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
