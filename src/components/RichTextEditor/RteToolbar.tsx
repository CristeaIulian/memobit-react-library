import React from 'react';

import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

import { ADVANCED_BUTTONS, HEADING_LEVELS, HISTORY_BUTTONS, TOOLBAR_BUTTONS } from './helpers';

interface RteToolbarProps {
    advanced: boolean;
    isActive: (command: string) => boolean;
    exec: (command: string, value?: string) => void;
    applyHeading: (level: number) => void;
    insertTaskList: () => void;
    openLinkPrompt: () => void;
    insertTable: () => void;
    undo: () => void;
    redo: () => void;
}

export const RteToolbar: React.FC<RteToolbarProps> = ({ advanced, isActive, exec, applyHeading, insertTaskList, openLinkPrompt, insertTable, undo, redo }) => (
    <div className="rte-toolbar">
        <div className="rte-toolbar-group">
            {HISTORY_BUTTONS.map(btn => (
                <Tooltip title={btn.title} key={btn.command}>
                    <button
                        type="button"
                        className="rte-toolbar-btn"
                        onMouseDown={e => {
                            e.preventDefault();
                            if (btn.command === 'undo') undo();
                            else redo();
                        }}
                    >
                        {btn.label}
                    </button>
                </Tooltip>
            ))}
        </div>

        <div className="rte-toolbar-divider" />

        <div className="rte-toolbar-group">
            {TOOLBAR_BUTTONS.map(btn => (
                <Tooltip title={btn.title} key={btn.command}>
                    <button
                        type="button"
                        className={`rte-toolbar-btn ${isActive(btn.command) ? 'rte-toolbar-btn--active' : ''}`}
                        onMouseDown={e => {
                            e.preventDefault();
                            exec(btn.command, btn.value);
                        }}
                    >
                        {btn.label}
                    </button>
                </Tooltip>
            ))}

            <Tooltip title="Task List">
                <button
                    type="button"
                    className="rte-toolbar-btn"
                    onMouseDown={e => {
                        e.preventDefault();
                        insertTaskList();
                    }}
                >
                    <Icon name="checkmark" /> List
                </button>
            </Tooltip>
        </div>

        <div className="rte-toolbar-divider" />

        <div className="rte-toolbar-group">
            {HEADING_LEVELS.map(level => (
                <Tooltip title={`Heading ${level}`} key={level}>
                    <button
                        type="button"
                        className={`rte-toolbar-btn rte-toolbar-btn--heading ${isActive(`h${level}`) ? 'rte-toolbar-btn--active' : ''}`}
                        onMouseDown={e => {
                            e.preventDefault();
                            applyHeading(level);
                        }}
                    >
                        H{level}
                    </button>
                </Tooltip>
            ))}
        </div>

        <div className="rte-toolbar-divider" />

        <div className="rte-toolbar-group">
            <Tooltip title="Insert Link">
                <button
                    type="button"
                    className="rte-toolbar-btn"
                    onMouseDown={e => {
                        e.preventDefault();
                        openLinkPrompt();
                    }}
                >
                    <Icon name="link" /> Link
                </button>
            </Tooltip>
        </div>

        {advanced && (
            <>
                <div className="rte-toolbar-divider" />
                <div className="rte-toolbar-group">
                    {ADVANCED_BUTTONS.map(btn => (
                        <Tooltip title={btn.title} key={btn.command + (btn.value ?? '')}>
                            <button
                                type="button"
                                className={`rte-toolbar-btn ${isActive(btn.value ?? btn.command) ? 'rte-toolbar-btn--active' : ''}`}
                                onMouseDown={e => {
                                    e.preventDefault();
                                    exec(btn.command, btn.value);
                                }}
                            >
                                {btn.label}
                            </button>
                        </Tooltip>
                    ))}
                    <Tooltip title="Insert Table">
                        <button
                            type="button"
                            className="rte-toolbar-btn"
                            onMouseDown={e => {
                                e.preventDefault();
                                insertTable();
                            }}
                        >
                            Table
                        </button>
                    </Tooltip>
                </div>
            </>
        )}
    </div>
);
