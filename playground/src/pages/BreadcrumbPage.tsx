import React from 'react';

import { Breadcrumb } from '../../../src';

export const BreadcrumbPage: React.FC = () => {
    const handleHomeClick = () => {
        console.log('Home clicked');
    };

    const handleCategoryClick = () => {
        console.log('Category clicked');
    };

    return (
        <div className="breadcrumb-page">
            <h1>Breadcrumb Component</h1>
            <p>A breadcrumb navigation component for showing the current page location within the site hierarchy.</p>

            <section className="page-section">
                <h2>Basic Breadcrumb</h2>

                <div className="showcase-group">
                    <h3>Simple Breadcrumb</h3>
                    <div className="component-group">
                        <Breadcrumb
                            items={[
                                { label: 'Home', href: '/' },
                                { label: 'Products', href: '/products' },
                                { label: 'Electronics', href: '/products/electronics' },
                                { label: 'Laptops' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Breadcrumb with Click Handlers</h3>
                    <div className="component-group">
                        <Breadcrumb
                            items={[
                                { label: 'Home', onClick: handleHomeClick },
                                { label: 'Category', onClick: handleCategoryClick },
                                { label: 'Subcategory', onClick: () => console.log('Subcategory clicked') },
                                { label: 'Current Page' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Custom Separator (›)</h3>
                    <div className="component-group">
                        <Breadcrumb
                            separator="›"
                            items={[
                                { label: 'Dashboard', href: '/dashboard' },
                                { label: 'Settings', href: '/dashboard/settings' },
                                { label: 'Profile' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Custom Separator (→)</h3>
                    <div className="component-group">
                        <Breadcrumb
                            separator="→"
                            items={[
                                { label: 'Level 1', href: '#' },
                                { label: 'Level 2', href: '#' },
                                { label: 'Level 3', href: '#' },
                                { label: 'Current' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Long Breadcrumb Path</h3>
                    <div className="component-group">
                        <Breadcrumb
                            items={[
                                { label: 'Home', href: '/' },
                                { label: 'Documentation', href: '/docs' },
                                { label: 'Components', href: '/docs/components' },
                                { label: 'Navigation', href: '/docs/components/navigation' },
                                { label: 'Breadcrumb', href: '/docs/components/navigation/breadcrumb' },
                                { label: 'Examples' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Two Items Only</h3>
                    <div className="component-group">
                        <Breadcrumb
                            items={[
                                { label: 'Home', href: '/' },
                                { label: 'About Us' },
                            ]}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
