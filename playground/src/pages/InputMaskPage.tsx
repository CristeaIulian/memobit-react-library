import React, { useRef, useState } from 'react';

import { InputMask, InputMaskPresets, InputMaskHandle, Button } from '../../../src';

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const Icon = {
    CreditCard: () => (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 3h16v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7zm3 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1H3zm2 0a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1H5z" />
        </svg>
    ),
    Bank: () => (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M8 .95 14.61 4h.89a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 4h.89L8 .95zM3.761 7h1.381l.545 5H4.306L3.761 7zm3.245 0h1.988l.545 5H6.46l.545-5zm3.888 0h1.381L11.73 12h-1.381l.545-5zM1 13h14v1.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V13z" />
        </svg>
    ),
    Phone: () => (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" />
        </svg>
    ),
    Shield: () => (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524z" />
        </svg>
    ),
    Copy: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>
    ),
    Key: () => (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
            <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
    ),
    Globe: () => (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
        </svg>
    ),
};

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
            <Icon.Copy />
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
                            icon={<Icon.CreditCard />}
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
                                icon={<Icon.Shield />}
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
                            icon={<Icon.Bank />}
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
                            icon={<Icon.Phone />}
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
                            icon={<Icon.Key />}
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
                        <InputMask label="IP address" mask={InputMaskPresets.ipv4} icon={<Icon.Globe />} />
                        <InputMask label="Read-only" mask={InputMaskPresets.ipv4} icon={<Icon.Globe />} value="192168001001" readOnly hint="Not editable" />
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
                            icon={<Icon.CreditCard />}
                            disabled
                            hint="This field is not editable"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
