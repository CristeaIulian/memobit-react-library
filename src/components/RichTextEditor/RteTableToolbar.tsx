import React, { RefObject } from 'react';

import { Tooltip } from '../Tooltip';

import { TableToolbarPos } from './hooks/useTableOps';

interface RteTableToolbarProps {
    pos: TableToolbarPos;
    toolbarRef: RefObject<HTMLDivElement>;
    addRowAbove: () => void;
    addRowBelow: () => void;
    removeRow: () => void;
    addColumnLeft: () => void;
    addColumnRight: () => void;
    removeColumn: () => void;
    deleteTable: () => void;
}

export const RteTableToolbar: React.FC<RteTableToolbarProps> = ({
    pos,
    toolbarRef,
    addRowAbove,
    addRowBelow,
    removeRow,
    addColumnLeft,
    addColumnRight,
    removeColumn,
    deleteTable,
}) => (
    <div ref={toolbarRef} className="rte-table-toolbar" style={{ top: pos.top, left: pos.left }} onMouseDown={e => e.preventDefault()}>
        <div className="rte-table-toolbar-group">
            <Tooltip title="Add row above">
                <button type="button" className="rte-table-toolbar-btn" onClick={addRowAbove}>
                    ↑ Row
                </button>
            </Tooltip>
            <Tooltip title="Add row below">
                <button type="button" className="rte-table-toolbar-btn" onClick={addRowBelow}>
                    ↓ Row
                </button>
            </Tooltip>
            <Tooltip title="Remove last row">
                <button type="button" className="rte-table-toolbar-btn rte-table-toolbar-btn--danger" onClick={removeRow}>
                    − Row
                </button>
            </Tooltip>
        </div>
        <div className="rte-table-toolbar-divider" />
        <div className="rte-table-toolbar-group">
            <Tooltip title="Add column left">
                <button type="button" className="rte-table-toolbar-btn" onClick={addColumnLeft}>
                    ← Col
                </button>
            </Tooltip>
            <Tooltip title="Add column right">
                <button type="button" className="rte-table-toolbar-btn" onClick={addColumnRight}>
                    → Col
                </button>
            </Tooltip>
            <Tooltip title="Remove last column">
                <button type="button" className="rte-table-toolbar-btn rte-table-toolbar-btn--danger" onClick={removeColumn}>
                    − Col
                </button>
            </Tooltip>
        </div>
        <div className="rte-table-toolbar-divider" />
        <div className="rte-table-toolbar-group">
            <Tooltip title="Delete table">
                <button type="button" className="rte-table-toolbar-btn rte-table-toolbar-btn--danger" onClick={deleteTable}>
                    ✕ Table
                </button>
            </Tooltip>
        </div>
    </div>
);
