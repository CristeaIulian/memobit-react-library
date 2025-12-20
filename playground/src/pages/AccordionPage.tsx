import React, { useState } from 'react';
import { Accordion, AccordionItemData } from '../../../src';

export const AccordionPage: React.FC = () => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const faqItems: AccordionItemData[] = [
        {
            id: 'faq-1',
            title: 'What is an accordion component?',
            content:
                'An accordion is a vertically stacked list of items that can be expanded or collapsed to reveal or hide content. It is commonly used for FAQs, menus, and organizing content.',
        },
        {
            id: 'faq-2',
            title: 'How do I use the accordion?',
            content:
                'Simply click on any section header to expand or collapse its content. You can configure whether multiple sections can be open at once or only one at a time.',
        },
        {
            id: 'faq-3',
            title: 'Can I customize the styling?',
            content:
                'Yes! The accordion component uses CSS variables for theming, so you can easily customize colors, spacing, and other visual properties to match your design.',
        },
        {
            id: 'faq-4',
            title: 'Is it accessible?',
            content:
                'The accordion follows accessibility best practices, including proper ARIA attributes and keyboard navigation support.',
        },
    ];

    const productFeatures: AccordionItemData[] = [
        {
            id: 'feature-1',
            title: '🚀 Performance',
            content: (
                <div>
                    <p>
                        Our product is optimized for speed and efficiency, ensuring smooth performance even with large datasets.
                    </p>
                    <ul>
                        <li>Lightning-fast load times</li>
                        <li>Optimized rendering</li>
                        <li>Efficient memory usage</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'feature-2',
            title: '🔒 Security',
            content: (
                <div>
                    <p>Security is our top priority. We implement industry-standard security measures to protect your data.</p>
                    <ul>
                        <li>End-to-end encryption</li>
                        <li>Regular security audits</li>
                        <li>Two-factor authentication</li>
                        <li>GDPR compliant</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'feature-3',
            title: '🎨 Customization',
            content: (
                <div>
                    <p>Fully customizable to match your brand and requirements.</p>
                    <ul>
                        <li>Theme support</li>
                        <li>Custom styling</li>
                        <li>Flexible layouts</li>
                    </ul>
                </div>
            ),
        },
    ];

    const documentationItems: AccordionItemData[] = [
        {
            id: 'doc-1',
            title: 'Getting Started',
            content: (
                <div>
                    <p>Follow these steps to get started:</p>
                    <ol>
                        <li>Install the package using npm or yarn</li>
                        <li>Import the component into your project</li>
                        <li>Configure the items and props</li>
                        <li>Customize styling as needed</li>
                    </ol>
                </div>
            ),
        },
        {
            id: 'doc-2',
            title: 'API Reference',
            content: (
                <div>
                    <p>
                        <strong>Props:</strong>
                    </p>
                    <ul>
                        <li>
                            <code>items</code> - Array of accordion items
                        </li>
                        <li>
                            <code>allowMultiple</code> - Allow multiple sections to be open
                        </li>
                        <li>
                            <code>defaultExpanded</code> - IDs of initially expanded items
                        </li>
                        <li>
                            <code>onChange</code> - Callback when items are toggled
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'doc-3',
            title: 'Examples',
            content: 'Check out the examples on this page to see different use cases and configurations.',
        },
        {
            id: 'doc-4',
            title: 'Troubleshooting',
            content: (
                <div>
                    <p>Common issues and solutions:</p>
                    <ul>
                        <li>
                            <strong>Content not expanding?</strong> Check that your items array is properly formatted.
                        </li>
                        <li>
                            <strong>Styling issues?</strong> Ensure CSS is imported correctly.
                        </li>
                        <li>
                            <strong>Multiple sections opening?</strong> Set allowMultiple prop to control this behavior.
                        </li>
                    </ul>
                </div>
            ),
        },
    ];

    const disabledItems: AccordionItemData[] = [
        {
            id: 'item-1',
            title: 'Active Item',
            content: 'This item is active and can be toggled.',
        },
        {
            id: 'item-2',
            title: 'Disabled Item',
            content: 'This content cannot be accessed.',
            disabled: true,
        },
        {
            id: 'item-3',
            title: 'Another Active Item',
            content: 'This item is also active and can be toggled.',
        },
    ];

    return (
        <div className="component-page">
            <h1>Accordion Component</h1>
            <p>
                A collapsible content component for organizing information in expandable sections.
            </p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Single Expand (Default)</h3>
                    <p>Only one section can be open at a time</p>
                    <div className="component-group">
                        <Accordion items={faqItems} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Multiple Expand</h3>
                    <p>Multiple sections can be open simultaneously</p>
                    <div className="component-group">
                        <Accordion items={faqItems} allowMultiple />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Default Expanded</h2>
                <div className="showcase-group">
                    <h3>With Initial Expanded Items</h3>
                    <p>First and third items are expanded by default</p>
                    <div className="component-group">
                        <Accordion
                            items={faqItems}
                            allowMultiple
                            defaultExpanded={['faq-1', 'faq-3']}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Rich Content</h2>
                <div className="showcase-group">
                    <h3>With Icons, Lists, and Formatted Content</h3>
                    <div className="component-group">
                        <Accordion items={productFeatures} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Controlled Mode</h2>
                <div className="showcase-group">
                    <h3>With onChange Callback</h3>
                    <p>Currently expanded: {expandedIds.length > 0 ? expandedIds.join(', ') : 'None'}</p>
                    <div className="component-group">
                        <Accordion
                            items={documentationItems}
                            allowMultiple
                            onChange={setExpandedIds}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Disabled Items</h2>
                <div className="showcase-group">
                    <h3>With Disabled Section</h3>
                    <p>The second item is disabled and cannot be toggled</p>
                    <div className="component-group">
                        <Accordion items={disabledItems} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Real-World Examples</h2>
                <div className="showcase-group">
                    <h3>FAQ Section</h3>
                    <div className="component-group">
                        <h4 style={{ marginBottom: '16px' }}>Frequently Asked Questions</h4>
                        <Accordion items={faqItems} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Product Features</h3>
                    <div className="component-group">
                        <h4 style={{ marginBottom: '16px' }}>What Makes Us Different</h4>
                        <Accordion items={productFeatures} defaultExpanded={['feature-1']} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Documentation Navigation</h3>
                    <div className="component-group">
                        <Accordion items={documentationItems} allowMultiple />
                    </div>
                </div>
            </section>
        </div>
    );
};
