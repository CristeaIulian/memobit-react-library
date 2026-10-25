import React, { useState } from 'react';

import { Button, DataView, type DataViewColumn, type DataViewDisplayMode, MiniStatsCard, Stats, useHighlight } from '../../../src';

interface TaskRow {
    id: number;
    title: string;
    area: string;
    points: number;
}

const AREAS = ['Kitchen', 'Garden', 'Office'];
const TITLES = ['Water plants', 'Fix shelf', 'File taxes', 'Clean oven', 'Sort mail', 'Mow lawn', 'Buy bulbs', 'Back up laptop'];

const initialTasks: TaskRow[] = TITLES.slice(0, 6).map((title, index) => ({
    id: index + 1,
    title,
    area: AREAS[index % AREAS.length],
    points: (index + 1) * 3,
}));

const columns: DataViewColumn<TaskRow>[] = [
    { key: 'title', header: 'Task', sortable: true },
    { key: 'area', header: 'Area', sortable: true },
    { key: 'points', header: 'Points', sortable: true },
];

export const DataViewMotionDemo: React.FC = () => {
    const [tasks, setTasks] = useState<TaskRow[]>(initialTasks);
    const [nextId, setNextId] = useState(initialTasks.length + 1);
    const [view, setView] = useState<DataViewDisplayMode>('table');
    const [grouped, setGrouped] = useState(false);
    const { highlightIds, highlight } = useHighlight();

    const addTask = () => {
        const task: TaskRow = { id: nextId, title: TITLES[nextId % TITLES.length], area: AREAS[nextId % AREAS.length], points: (nextId * 7) % 20 };
        setTasks(previous => [...previous.slice(0, 2), task, ...previous.slice(2)]);
        setNextId(id => id + 1);
    };

    const removeTask = (id: number) => setTasks(previous => previous.filter(task => task.id !== id));

    const bumpPoints = (id: number) => {
        setTasks(previous => previous.map(task => (task.id === id ? { ...task, points: task.points + 10 } : task)));
        highlight(id);
    };

    const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);

    return (
        <section className="page-section">
            <h2>Live Changes (motion)</h2>
            <p>
                Rows and cards fade in, fade out and slide into place. Bigger swaps (another page, a new filter) are not animated. Sort by Points, then use
                &quot;+10&quot; to watch a row travel and flash.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-8)', alignItems: 'center' }}>
                <Button onClick={addTask}>Add task</Button>
                <Button variant="ghost" onClick={() => setTasks(previous => [...previous].reverse())}>
                    Reverse
                </Button>
                <Button variant="ghost" onClick={() => setTasks([])}>
                    Clear
                </Button>
                <Button variant="ghost" onClick={() => setTasks(initialTasks)}>
                    Reset
                </Button>
                <Button variant="ghost" onClick={() => setGrouped(value => !value)}>
                    {grouped ? 'Ungroup' : 'Group by area'}
                </Button>
                <Button variant="ghost" onClick={() => setView(current => (current === 'table' ? 'cards' : 'table'))}>
                    {view === 'table' ? 'Show cards' : 'Show table'}
                </Button>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-12)' }}>
                <MiniStatsCard label="Tasks" value={tasks.length} />
                <MiniStatsCard label="Points" value={totalPoints} unit="pts" />
                <Stats
                    items={[
                        { label: 'Average', value: tasks.length ? Math.round((totalPoints / tasks.length) * 10) / 10 : 0 },
                        { label: 'Top', value: Math.max(0, ...tasks.map(task => task.points)) },
                    ]}
                />
            </div>
            <DataView
                data={tasks}
                columns={columns}
                rowKey={task => task.id}
                desktopView={view}
                cardMaxWidth={260}
                highlightIds={highlightIds}
                initialPageSize={15}
                card={{ title: task => task.title, subtitle: task => task.area }}
                group={grouped ? { groupBy: task => task.area, groupLabel: key => String(key), collapsible: true } : undefined}
                actions={task => (
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                        <Button size="small" variant="ghost" onClick={() => bumpPoints(task.id)}>
                            +10
                        </Button>
                        <Button size="small" variant="ghost" onClick={() => removeTask(task.id)}>
                            Remove
                        </Button>
                    </div>
                )}
                empty={{ title: 'No tasks', description: 'Add one to see it fade in.' }}
            />
        </section>
    );
};
