import React, { useState, useCallback, useId } from 'react';
import './Tree.scss';

// ── Types ─────────────────────────────────────────────────────────────────────

export type TreeVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';

export interface TreeNode {
    id: string | number;
    label: string;
    icon?: React.ReactNode;
    variant?: TreeVariant;
    badge?: string | number;
    disabled?: boolean;
    /** Pre-expanded on first render */
    defaultExpanded?: boolean;
    children?: TreeNode[];
}

export interface TreeProps {
    nodes: TreeNode[];
    /** Allow selecting a single node */
    selectable?: boolean;
    /** Callback fired when a node is selected */
    onSelect?: (node: TreeNode) => void;
    /** Show indent guide lines */
    showGuides?: boolean;
    /** Animate expand/collapse */
    animated?: boolean;
    /** Pre-selected node id */
    defaultSelectedId?: string | number;
    className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
    <svg className={`tree__chevron ${open ? 'tree__chevron--open' : ''}`} viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
        <path d="M5 3l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ── Internal recursive node ───────────────────────────────────────────────────

interface TreeNodeItemProps {
    node: TreeNode;
    depth: number;
    selectable: boolean;
    showGuides: boolean;
    animated: boolean;
    selectedId: string | number | null;
    onSelect: (node: TreeNode) => void;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({ node, depth, selectable, showGuides, animated, selectedId, onSelect }) => {
    const [expanded, setExpanded] = useState(node.defaultExpanded ?? false);
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const isSelected = selectable && selectedId === node.id;
    const innerId = useId();

    const handleToggle = useCallback(
        (e: React.MouseEvent | React.KeyboardEvent) => {
            if (node.disabled) return;
            if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
            if (hasChildren) setExpanded(prev => !prev);
            if (selectable) onSelect(node);
        },
        [hasChildren, node, selectable, onSelect]
    );

    const rowClass = [
        'tree__row',
        isSelected ? 'tree__row--selected' : '',
        node.disabled ? 'tree__row--disabled' : '',
        node.variant && node.variant !== 'default' ? `tree__row--${node.variant}` : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <li
            role={hasChildren ? 'treeitem' : 'treeitem'}
            aria-expanded={hasChildren ? expanded : undefined}
            aria-selected={selectable ? isSelected : undefined}
            aria-disabled={node.disabled}
        >
            <div
                id={innerId}
                className={rowClass}
                style={{ '--depth': depth } as React.CSSProperties}
                tabIndex={node.disabled ? -1 : 0}
                onClick={handleToggle}
                onKeyDown={handleToggle}
            >
                {/* Indent guides — one absolutely-positioned span per ancestor level */}
                {showGuides &&
                    depth > 0 &&
                    Array.from({ length: depth }).map((_, i) => (
                        <span key={i} className="tree__guide" style={{ '--guide-level': i } as React.CSSProperties} aria-hidden="true" />
                    ))}

                {/* Chevron / leaf spacer */}
                <span className="tree__toggle" aria-hidden="true">
                    {hasChildren ? <ChevronIcon open={expanded} /> : <span className="tree__leaf-dot" />}
                </span>

                {/* Icon */}
                {node.icon && <span className="tree__icon">{node.icon}</span>}

                {/* Label */}
                <span className="tree__label">{node.label}</span>

                {/* Badge */}
                {node.badge !== undefined && <span className={`tree__badge tree__badge--${node.variant ?? 'default'}`}>{node.badge}</span>}
            </div>

            {/* Children */}
            {hasChildren && (
                <ul
                    role="group"
                    aria-labelledby={innerId}
                    className={['tree__children', expanded ? 'tree__children--open' : '', animated ? 'tree__children--animated' : ''].filter(Boolean).join(' ')}
                >
                    {node.children!.map(child => (
                        <TreeNodeItem
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            selectable={selectable}
                            showGuides={showGuides}
                            animated={animated}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

// ── Public component ──────────────────────────────────────────────────────────

export const Tree: React.FC<TreeProps> = ({
    nodes,
    selectable = false,
    onSelect,
    showGuides = true,
    animated = true,
    defaultSelectedId = null,
    className = '',
}) => {
    const [selectedId, setSelectedId] = useState<string | number | null>(defaultSelectedId);

    const handleSelect = useCallback(
        (node: TreeNode) => {
            if (node.disabled) return;
            setSelectedId(node.id);
            onSelect?.(node);
        },
        [onSelect]
    );

    return (
        <ul role="tree" className={['tree', className].filter(Boolean).join(' ')} aria-multiselectable={false}>
            {nodes.map(node => (
                <TreeNodeItem
                    key={node.id}
                    node={node}
                    depth={0}
                    selectable={selectable}
                    showGuides={showGuides}
                    animated={animated}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                />
            ))}
        </ul>
    );
};
