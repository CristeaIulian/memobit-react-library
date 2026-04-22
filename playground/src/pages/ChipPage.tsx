import { FC, useState } from 'react';

import { Chip } from '../../../src';

export const ChipPage: FC = () => {
    const [selectedTopics, setSelectedTopics] = useState<string[]>(['fiction', 'science']);

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev => (prev.includes(topic) ? prev.filter(item => item !== topic) : [...prev, topic]));
    };

    return (
        <div className="chip-page">
            <h1>Chip Component</h1>
            <p>A compact chip component for selectable labels, counts, and filter tokens.</p>

            <section className="page-section">
                <h2>Chip Examples</h2>

                <div className="showcase-group">
                    <h3>Variants</h3>
                    <div className="component-group">
                        <Chip variant="plain">Plain</Chip>
                        <Chip variant="default">Default</Chip>
                        <Chip variant="info">Info</Chip>
                        <Chip variant="success">Success</Chip>
                        <Chip variant="warning">Warning</Chip>
                        <Chip variant="danger">Danger</Chip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Selected Variants</h3>
                    <div className="component-group">
                        <Chip selected variant="default">
                            Default
                        </Chip>
                        <Chip selected variant="info">
                            Info
                        </Chip>
                        <Chip selected variant="success">
                            Success
                        </Chip>
                        <Chip selected variant="warning">
                            Warning
                        </Chip>
                        <Chip selected variant="danger">
                            Danger
                        </Chip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Sizes</h3>
                    <div className="component-group" style={{ alignItems: 'center' }}>
                        <Chip size="xsmall">Extra Small</Chip>
                        <Chip size="small">Small</Chip>
                        <Chip size="medium">Medium</Chip>
                        <Chip size="large">Large</Chip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Counts and Colors</h3>
                    <div className="component-group">
                        <Chip count={9} color="#d97729">
                            Fiction
                        </Chip>
                        <Chip count={6} color="#3d8b50">
                            Essays
                        </Chip>
                        <Chip count={3} color="#a855f7" selected>
                            Sci-Fi
                        </Chip>
                        <Chip count={2} color="#2563eb" selected>
                            Science
                        </Chip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Selectable Chips</h3>
                    <div className="component-group">
                        {[
                            { id: 'fiction', label: 'Fiction', count: 9, color: '#d97729' },
                            { id: 'poetry', label: 'Poetry', count: 3, color: '#c77b7b' },
                            { id: 'science', label: 'Science', count: 2, color: '#2563eb' },
                            { id: 'travel', label: 'Travel', count: 2, color: '#3d8b50' },
                        ].map(topic => (
                            <Chip
                                key={topic.id}
                                color={topic.color}
                                count={topic.count}
                                onClick={() => toggleTopic(topic.id)}
                                selected={selectedTopics.includes(topic.id)}
                            >
                                {topic.label}
                            </Chip>
                        ))}
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Disabled</h3>
                    <div className="component-group">
                        <Chip disabled>Disabled</Chip>
                        <Chip disabled selected variant="info">
                            Disabled Selected
                        </Chip>
                    </div>
                </div>
            </section>
        </div>
    );
};
