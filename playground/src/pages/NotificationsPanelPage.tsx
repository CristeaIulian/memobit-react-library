import React, { useState } from 'react';

import { Button, NotificationPanel, NotificationPanelItem } from '../../../src';

const criticalItems: NotificationPanelItem[] = [
    { id: '1', severity: 'critical', message: 'Door sensor: Battery 0%' },
    { id: '2', severity: 'critical', message: 'Door sensor: Signal 0%' },
    { id: '3', severity: 'warning', message: 'Entrance Strip Lights: Signal 0%' },
    { id: '4', severity: 'warning', message: 'Tapo C210: Camera privacy mode is ON' },
];

const warningOnlyItems: NotificationPanelItem[] = [
    { id: '1', severity: 'warning', message: 'Living room thermostat: Battery low' },
    { id: '2', severity: 'warning', message: 'Garage door: Last seen 2h ago' },
];

export const NotificationsPanelPage: React.FC = () => {
    const [dynamicItems, setDynamicItems] = useState<NotificationPanelItem[]>(criticalItems);

    return (
        <div className="alert-center-page">
            <h1>Notification Panel Component</h1>
            <p>A button-triggered panel listing items with severity styling, portal-based (no z-index stacking issues), and click-outside / Escape to close.</p>

            <section className="page-section">
                <h2>Examples</h2>

                <div className="showcase-group">
                    <h3>With critical items (button turns red)</h3>
                    <div className="component-group">
                        <NotificationPanel items={criticalItems} buttonLabel="Alerts" panelTitle="Alert Center" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Warnings only</h3>
                    <div className="component-group">
                        <NotificationPanel items={warningOnlyItems} buttonLabel="Alerts" panelTitle="Alert Center" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>No items</h3>
                    <div className="component-group">
                        <NotificationPanel items={[]} buttonLabel="Alerts" panelTitle="Alert Center" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Custom label and title</h3>
                    <div className="component-group">
                        <NotificationPanel
                            items={warningOnlyItems}
                            buttonLabel="Notifications"
                            panelTitle="Notification Center"
                            emptyMessage="You're all caught up."
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Dynamic (add / clear items)</h3>
                    <div className="component-group" style={{ gap: '8px', alignItems: 'center' }}>
                        <NotificationPanel items={dynamicItems} buttonLabel="Alerts" panelTitle="Alert Center" />
                        <Button size="small" onClick={() => setDynamicItems(criticalItems)}>
                            Add items
                        </Button>
                        <Button size="small" onClick={() => setDynamicItems([])}>
                            Clear
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
