import React, { FC, useState } from 'react';

import { Banner, Button } from '../../../src';

export const BannerPage: FC = () => {
    const [showDismissedBanner, setShowDismissedBanner] = useState(true);

    return (
        <div className="banner-page">
            <h1>Banner Component</h1>
            <p>A page-level banner for important contextual messages with optional actions and dismissal.</p>

            <section className="page-section">
                <h2>Banner Examples</h2>

                <div className="showcase-group">
                    <h3>Default Banner</h3>
                    <div className="component-group">
                        <Banner
                            title="Workspace ready"
                            description="Your project settings were loaded and the current environment is available."
                            action={{
                                text: 'View settings',
                                variant: 'ghost',
                                onClick: () => alert('Opening settings'),
                            }}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Variants</h3>
                    <div className="component-group">
                        <Banner
                            variant="default"
                            title="Default announcement"
                            description="A neutral banner for informational copy that should not imply status."
                            showDismiss={false}
                        />
                        <Banner
                            variant="success"
                            title="Backup complete"
                            description="The latest snapshot finished successfully and is ready to restore from."
                            action={{
                                text: 'Review',
                                onClick: () => alert('Review backup'),
                            }}
                        />
                        <Banner variant="info" title="New report available" description="A fresh weekly summary has been generated for this workspace." />
                        <Banner
                            variant="warning"
                            title="Storage is almost full"
                            description="You have used 86% of your storage. Clean up old exports to keep sync running smoothly."
                        />
                        <Banner
                            variant="danger"
                            title="Payment failed"
                            description="Update your billing details to avoid an interruption at the end of the billing period."
                            action={{
                                text: 'Update billing',
                                onClick: () => alert('Update billing'),
                            }}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Dismissible State</h3>
                    <div className="component-group">
                        {showDismissedBanner ? (
                            <Banner
                                variant="info"
                                title="Dismiss me"
                                description="This sample calls onDismiss and then hides itself using the banner's built-in dismissal."
                                onDismiss={() => setShowDismissedBanner(false)}
                            />
                        ) : (
                            <Button size="small" variant="info" onClick={() => setShowDismissedBanner(true)}>
                                Restore banner
                            </Button>
                        )}
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Primary and Secondary Actions</h3>
                    <div className="component-group">
                        <Banner
                            title="Invite your team"
                            description="Add collaborators now or keep setting up the workspace first."
                            dismissLabel="Hide invitation banner"
                            action={{
                                text: 'Invite people',
                                icon: 'users',
                                onClick: () => alert('Invite people'),
                            }}
                            secondaryAction={{
                                text: 'Later',
                                variant: 'plain',
                                onClick: () => alert('Maybe later'),
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
