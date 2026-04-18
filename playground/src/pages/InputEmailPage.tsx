import React, { useState } from 'react';

import { InputEmail } from '../../../src';

export const InputEmailPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [emailWithValue, setEmailWithValue] = useState<string>('user@example.com');
    const [validatedEmail, setValidatedEmail] = useState<string>('');
    const [isValidatedEmailValid, setIsValidatedEmailValid] = useState(true);
    const [onChangeEmail, setOnChangeEmail] = useState<string>('');
    const [customErrorEmail, setCustomErrorEmail] = useState<string>('');
    const [successEmail, setSuccessEmail] = useState<string>('valid@example.com');

    return (
        <div className="component-page">
            <h1>Input Email Component</h1>
            <p>
                An email input component with built-in validation, visual feedback, and
                customizable error messages.
            </p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Default Email Input</h3>
                    <div className="component-group">
                        <InputEmail
                            value={email}
                            onChange={setEmail}
                            placeholder="Enter your email..."
                        />
                    </div>
                    <p>Current value: {email || '(empty)'}</p>
                </div>

                <div className="showcase-group">
                    <h3>With Initial Value</h3>
                    <div className="component-group">
                        <InputEmail
                            value={emailWithValue}
                            onChange={setEmailWithValue}
                            placeholder="Enter your email..."
                        />
                    </div>
                    <p>Current value: {emailWithValue}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Validation Features</h2>
                <div className="showcase-group">
                    <h3>With Validation (on blur)</h3>
                    <p>Validates when you leave the input field</p>
                    <div className="component-group">
                        <InputEmail
                            value={validatedEmail}
                            onChange={setValidatedEmail}
                            placeholder="email@example.com"
                            showValidation={true}
                            validateOn="blur"
                            onValidate={setIsValidatedEmailValid}
                        />
                    </div>
                    <p>
                        Status:{' '}
                        <span
                            style={{
                                color: isValidatedEmailValid ? 'green' : 'red',
                                fontWeight: 'bold',
                            }}
                        >
                            {isValidatedEmailValid ? '✓ Valid' : '✗ Invalid'}
                        </span>
                    </p>
                </div>

                <div className="showcase-group">
                    <h3>With Validation (on change)</h3>
                    <p>Validates as you type</p>
                    <div className="component-group">
                        <InputEmail
                            value={onChangeEmail}
                            onChange={setOnChangeEmail}
                            placeholder="email@example.com"
                            showValidation={true}
                            validateOn="change"
                        />
                    </div>
                    <p>Current value: {onChangeEmail || '(empty)'}</p>
                </div>

                <div className="showcase-group">
                    <h3>Custom Error Message</h3>
                    <div className="component-group">
                        <InputEmail
                            value={customErrorEmail}
                            onChange={setCustomErrorEmail}
                            placeholder="work@company.com"
                            showValidation={true}
                            validateOn="both"
                            errorMessage="Oops! That doesn't look like a valid email address."
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Pre-filled Invalid Email</h3>
                    <p>Try fixing this invalid email to see the green border</p>
                    <div className="component-group">
                        <InputEmail
                            value="invalid-email"
                            onChange={() => {}}
                            showValidation={true}
                            validateOn="blur"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Validation States (Manual)</h2>
                <div className="showcase-group">
                    <h3>Success State</h3>
                    <p>Using the success prop for manual validation feedback</p>
                    <div className="component-group">
                        <InputEmail
                            label="Email address"
                            value={successEmail}
                            onChange={setSuccessEmail}
                            success="Email is available and verified"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>States</h2>
                <div className="showcase-group">
                    <h3>Disabled</h3>
                    <div className="component-group">
                        <InputEmail
                            value="disabled@example.com"
                            onChange={() => {}}
                            disabled
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Read Only</h3>
                    <div className="component-group">
                        <InputEmail
                            value="readonly@example.com"
                            onChange={() => {}}
                            readOnly
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Required with Validation</h3>
                    <div className="component-group">
                        <InputEmail
                            value={email}
                            onChange={setEmail}
                            placeholder="Required email..."
                            required
                            showValidation={true}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Real-World Example</h2>
                <div className="showcase-group">
                    <h3>Registration Form</h3>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            maxWidth: '400px',
                        }}
                    >
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>
                                Primary Email *
                            </label>
                            <InputEmail
                                value={email}
                                onChange={setEmail}
                                placeholder="you@example.com"
                                showValidation={true}
                                validateOn="blur"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>
                                Secondary Email (Optional)
                            </label>
                            <InputEmail
                                value=""
                                onChange={() => {}}
                                placeholder="backup@example.com"
                                showValidation={true}
                                validateOn="blur"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>
                                Recovery Email *
                            </label>
                            <InputEmail
                                value=""
                                onChange={() => {}}
                                placeholder="recovery@example.com"
                                showValidation={true}
                                validateOn="blur"
                                required
                                errorMessage="Recovery email is required for account security"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Validation Examples</h2>
                <div className="showcase-group">
                    <h3>Try These:</h3>
                    <ul>
                        <li>✓ Valid: user@example.com</li>
                        <li>✓ Valid: test.user@subdomain.example.com</li>
                        <li>✓ Valid: name+tag@example.co.uk</li>
                        <li>✗ Invalid: userexample.com (missing @)</li>
                        <li>✗ Invalid: user@example (missing domain extension)</li>
                        <li>✗ Invalid: @example.com (missing username)</li>
                        <li>✗ Invalid: user @example.com (space in username)</li>
                    </ul>
                </div>
            </section>
        </div>
    );
};
