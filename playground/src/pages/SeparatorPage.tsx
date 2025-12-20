import React from 'react';
import { Separator } from '../../../src';

export const SeparatorPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Separator Component</h1>
            <p>A visual divider component to separate content sections with support for labels and different styles.</p>

            <section className="page-section">
                <h2>Basic Horizontal Separators</h2>
                <div className="showcase-group">
                    <h3>Default (Solid)</h3>
                    <div className="component-group">
                        <p>Content above separator</p>
                        <Separator />
                        <p>Content below separator</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Dashed</h3>
                    <div className="component-group">
                        <p>Content above separator</p>
                        <Separator style="dashed" />
                        <p>Content below separator</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Dotted</h3>
                    <div className="component-group">
                        <p>Content above separator</p>
                        <Separator style="dotted" />
                        <p>Content below separator</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Thickness Variations</h2>
                <div className="showcase-group">
                    <h3>Thin (1px)</h3>
                    <div className="component-group">
                        <Separator thickness={1} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Medium (2px)</h3>
                    <div className="component-group">
                        <Separator thickness={2} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Thick (4px)</h3>
                    <div className="component-group">
                        <Separator thickness={4} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Spacing Variations</h2>
                <div className="showcase-group">
                    <h3>Tight (8px)</h3>
                    <div className="component-group">
                        <p>Content above</p>
                        <Separator spacing={8} />
                        <p>Content below</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Default (16px)</h3>
                    <div className="component-group">
                        <p>Content above</p>
                        <Separator spacing={16} />
                        <p>Content below</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Loose (32px)</h3>
                    <div className="component-group">
                        <p>Content above</p>
                        <Separator spacing={32} />
                        <p>Content below</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>With Labels</h2>
                <div className="showcase-group">
                    <h3>Center Aligned (Default)</h3>
                    <div className="component-group">
                        <p>Section 1 content here</p>
                        <Separator label="OR" />
                        <p>Section 2 content here</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Left Aligned</h3>
                    <div className="component-group">
                        <p>Introduction paragraph</p>
                        <Separator label="Chapter 1" labelAlign="left" />
                        <p>Chapter content starts here</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Right Aligned</h3>
                    <div className="component-group">
                        <p>Main content here</p>
                        <Separator label="End of Section" labelAlign="right" />
                        <p>Next section begins</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>With Dashed Style</h3>
                    <div className="component-group">
                        <p>Login with social media</p>
                        <Separator label="OR" style="dashed" />
                        <p>Login with email</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>With Custom Thickness</h3>
                    <div className="component-group">
                        <p>Important notice above</p>
                        <Separator label="ATTENTION" thickness={2} />
                        <p>Important notice below</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Vertical Separators</h2>
                <div className="showcase-group">
                    <h3>Basic Vertical</h3>
                    <div className="component-group">
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', height: '100px' }}>
                            <div>Left content</div>
                            <Separator orientation="vertical" />
                            <div>Right content</div>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Vertical with Different Styles</h3>
                    <div className="component-group">
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', height: '80px' }}>
                            <div>Item 1</div>
                            <Separator orientation="vertical" />
                            <div>Item 2</div>
                            <Separator orientation="vertical" style="dashed" />
                            <div>Item 3</div>
                            <Separator orientation="vertical" style="dotted" />
                            <div>Item 4</div>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Vertical with Custom Thickness</h3>
                    <div className="component-group">
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', height: '60px' }}>
                            <div>Section A</div>
                            <Separator orientation="vertical" thickness={3} />
                            <div>Section B</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Real-World Examples</h2>
                <div className="showcase-group">
                    <h3>Login Form</h3>
                    <div className="component-group" style={{ maxWidth: '400px' }}>
                        <button style={{ width: '100%', padding: '12px' }}>
                            Continue with Google
                        </button>
                        <button style={{ width: '100%', padding: '12px' }}>
                            Continue with Facebook
                        </button>
                        <Separator label="OR" spacing={24} />
                        <input
                            type="email"
                            placeholder="Email"
                            style={{ width: '100%', padding: '12px', marginBottom: '8px' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={{ width: '100%', padding: '12px' }}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Article Sections</h3>
                    <div className="component-group">
                        <h4>Introduction</h4>
                        <p>This is the introduction paragraph with some content explaining the topic.</p>
                        <Separator label="Chapter 1: Getting Started" labelAlign="left" thickness={2} />
                        <p>Here we begin the first chapter with important information...</p>
                        <Separator label="Chapter 2: Advanced Topics" labelAlign="left" thickness={2} />
                        <p>Moving on to more advanced concepts and techniques...</p>
                        <Separator label="Conclusion" labelAlign="left" thickness={2} />
                        <p>Final thoughts and summary of the article.</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Toolbar with Vertical Separators</h3>
                    <div className="component-group">
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: 'var(--card-background-color)', borderRadius: '8px' }}>
                            <button style={{ padding: '8px 12px' }}>Bold</button>
                            <button style={{ padding: '8px 12px' }}>Italic</button>
                            <button style={{ padding: '8px 12px' }}>Underline</button>
                            <Separator orientation="vertical" spacing={8} />
                            <button style={{ padding: '8px 12px' }}>Align Left</button>
                            <button style={{ padding: '8px 12px' }}>Align Center</button>
                            <button style={{ padding: '8px 12px' }}>Align Right</button>
                            <Separator orientation="vertical" spacing={8} />
                            <button style={{ padding: '8px 12px' }}>Link</button>
                            <button style={{ padding: '8px 12px' }}>Image</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
