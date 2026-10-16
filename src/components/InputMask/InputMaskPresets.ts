import './InputMask.scss';

// ── Preset masks ──────────────────────────────────────────────────────────────

export const InputMaskPresets = {
    creditCard: '9999 9999 9999 9999',
    iban: 'aa99 9999 9999 9999 9999 99',
    cvv: '999',
    expiry: '99/99',
    phone: '+99 (999) 999-9999',
    ssn: '999-99-9999',
    ipv4: '999.999.999.999',
    serialNumber: '***-***-***-***',
    date: '99/99/9999',
    time: '99:99',
    uuid: '********-****-****-****-************',
} as const;
