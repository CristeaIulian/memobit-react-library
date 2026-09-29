import React, { useState } from 'react';

import { Button, InputPIN } from '../../../src';

const CORRECT_CODE = '123456';

export const InputPINPage: React.FC = () => {
    const [code, setCode] = useState('');
    const [pin, setPin] = useState('');
    const [grouped, setGrouped] = useState('');
    const [alphanumeric, setAlphanumeric] = useState('');
    const [short, setShort] = useState('');
    const [verified, setVerified] = useState<'idle' | 'ok' | 'bad'>('idle');
    const [completions, setCompletions] = useState(0);

    const handleVerify = (value: string) => {
        setCompletions(current => current + 1);
        setVerified(value === CORRECT_CODE ? 'ok' : 'bad');
    };

    return (
        <div className="input-pin-page">
            <h1>Input PIN</h1>
            <p>
                Segmented code entry. Typing advances, Backspace goes back, the arrow keys move between cells, and pasting a whole code fills the cells from
                wherever the caret sits.
            </p>

            <section className="page-section">
                <h2>Basic</h2>

                <div className="showcase-group">
                    <h3>Six digits</h3>
                    <div className="component-group">
                        <InputPIN label="Verification code" onChange={setCode} value={code} />
                    </div>
                    <p>Value: {code || '(empty)'}</p>
                </div>

                <div className="showcase-group">
                    <h3>Four digits</h3>
                    <div className="component-group">
                        <InputPIN label="Door code" length={4} onChange={setShort} value={short} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Masked</h2>

                <div className="showcase-group">
                    <h3>A PIN rather than a one-time code</h3>
                    <div className="component-group">
                        <InputPIN label="PIN" length={4} onChange={setPin} secret value={pin} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Grouping</h2>

                <div className="showcase-group">
                    <h3>Printed in threes</h3>
                    <p>
                        <code>groupSize</code> adds a gap after every N cells, the way codes are printed in emails.
                    </p>
                    <div className="component-group">
                        <InputPIN groupSize={3} label="Code" onChange={setGrouped} value={grouped} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Eight cells in pairs</h3>
                    <div className="component-group">
                        <InputPIN groupSize={2} label="Serial" length={8} onChange={setGrouped} value={grouped} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Alphanumeric</h2>

                <div className="showcase-group">
                    <h3>Letters and digits</h3>
                    <div className="component-group">
                        <InputPIN label="Invite code" length={5} onChange={setAlphanumeric} type="alphanumeric" value={alphanumeric} />
                    </div>
                    <p>Value: {alphanumeric || '(empty)'}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Validation states</h2>

                <div className="showcase-group">
                    <h3>Error and success</h3>
                    <div className="component-group">
                        <InputPIN error="That code has expired" label="With an error" length={4} onChange={() => undefined} value="1234" />
                    </div>
                    <div className="component-group">
                        <InputPIN label="With a success" length={4} onChange={() => undefined} success="Code accepted" value="4321" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>onComplete</h2>

                <div className="showcase-group">
                    <h3>Verify as soon as the last cell is filled</h3>
                    <p>
                        Type <code>{CORRECT_CODE}</code> to pass. <code>onComplete</code> fires once per finished code, not on every render.
                    </p>
                    <div className="component-group">
                        <InputPIN
                            error={verified === 'bad' ? 'Wrong code — try 123456' : undefined}
                            label="Enter the code"
                            onChange={value => {
                                setCode(value);
                                if (value.length < CORRECT_CODE.length) setVerified('idle');
                            }}
                            onComplete={handleVerify}
                            success={verified === 'ok' ? 'Verified' : undefined}
                            value={code}
                        />
                    </div>
                    <p>onComplete fired {completions} time(s)</p>
                    <Button
                        onClick={() => {
                            setCode('');
                            setVerified('idle');
                        }}
                        variant="default"
                    >
                        Reset
                    </Button>
                </div>
            </section>

            <section className="page-section">
                <h2>Disabled</h2>

                <div className="showcase-group">
                    <div className="component-group">
                        <InputPIN disabled label="Locked" length={4} onChange={() => undefined} value="12" />
                    </div>
                </div>
            </section>
        </div>
    );
};
