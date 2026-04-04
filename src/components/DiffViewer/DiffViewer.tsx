import { useMemo } from 'react';

import './DiffViewer.scss';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DiffMode = 'split' | 'inline';
export type DiffType = 'text' | 'code';
export type DiffLang = 'javascript' | 'typescript' | 'jsx' | 'tsx' | 'css' | 'scss' | 'html' | 'json' | 'python' | 'bash' | 'plaintext';

interface DiffViewerProps {
    oldValue: string;
    newValue: string;
    mode?: DiffMode; // split | inline (default: split)
    type?: DiffType; // text | code (default: text)
    language?: DiffLang; // used for syntax highlighting when type='code'
    oldTitle?: string; // header label for old side (default: 'Before')
    newTitle?: string; // header label for new side (default: 'After')
    showLineNumbers?: boolean; // default: true
}

// ─── Diff engine ─────────────────────────────────────────────────────────────

type LineKind = 'equal' | 'removed' | 'added';

interface DiffLine {
    kind: LineKind;
    oldLineNo?: number;
    newLineNo?: number;
    oldText?: string;
    newText?: string;
    text?: string; // for equal lines
}

// Myers diff on arrays of strings — returns edit script
function myersDiff<T>(a: T[], b: T[]): Array<{ kind: 'eq' | 'del' | 'ins'; val: T }> {
    const n = a.length;
    const m = b.length;
    const max = n + m;
    const v: number[] = new Array(2 * max + 1).fill(0);
    const trace: number[][] = [];

    outer: for (let d = 0; d <= max; d++) {
        trace.push([...v]);
        for (let k = -d; k <= d; k += 2) {
            const ki = k + max;
            let x = k === -d || (k !== d && v[ki - 1] < v[ki + 1]) ? v[ki + 1] : v[ki - 1] + 1;
            let y = x - k;
            while (x < n && y < m && a[x] === b[y]) {
                x++;
                y++;
            }
            v[ki] = x;
            if (x >= n && y >= m) break outer;
        }
    }

    // Backtrack
    const result: Array<{ kind: 'eq' | 'del' | 'ins'; val: T }> = [];
    let x = n,
        y = m;
    for (let d = trace.length - 1; d >= 0 && (x > 0 || y > 0); d--) {
        const vd = trace[d];
        const k = x - y;
        const ki = k + max;
        const prevK = k === -d || (k !== d && vd[ki - 1] < vd[ki + 1]) ? k + 1 : k - 1;
        const prevX = vd[prevK + max];
        const prevY = prevX - prevK;
        while (x > prevX + 1 && y > prevY + 1) {
            x--;
            y--;
            result.unshift({ kind: 'eq', val: a[x] });
        }
        if (d > 0) {
            if (x > prevX) {
                x--;
                result.unshift({ kind: 'del', val: a[x] });
            } else {
                y--;
                result.unshift({ kind: 'ins', val: b[y] });
            }
        }
        while (x > prevX && y > prevY) {
            x--;
            y--;
            result.unshift({ kind: 'eq', val: a[x] });
        }
    }
    return result;
}

// Build structured diff lines from two text strings
function computeLineDiff(oldText: string, newText: string): DiffLine[] {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const edits = myersDiff(oldLines, newLines);

    const result: DiffLine[] = [];
    let oldNo = 1,
        newNo = 1;

    // Pair up adjacent del+ins as changed lines for word-diff
    let i = 0;
    while (i < edits.length) {
        const e = edits[i];
        if (e.kind === 'eq') {
            result.push({ kind: 'equal', oldLineNo: oldNo++, newLineNo: newNo++, text: e.val as string });
            i++;
        } else if (e.kind === 'del' && i + 1 < edits.length && edits[i + 1].kind === 'ins') {
            // Changed line — pair for word-level diff
            result.push({
                kind: 'removed',
                oldLineNo: oldNo++,
                oldText: e.val as string,
                newText: edits[i + 1].val as string,
            });
            result.push({
                kind: 'added',
                newLineNo: newNo++,
                oldText: e.val as string,
                newText: edits[i + 1].val as string,
            });
            i += 2;
        } else if (e.kind === 'del') {
            result.push({ kind: 'removed', oldLineNo: oldNo++, oldText: e.val as string });
            i++;
        } else {
            result.push({ kind: 'added', newLineNo: newNo++, newText: e.val as string });
            i++;
        }
    }
    return result;
}

// ─── Word-level diff rendering ────────────────────────────────────────────────

function wordDiff(a: string, b: string): Array<{ kind: 'eq' | 'del' | 'ins'; val: string }> {
    // Split on word boundaries preserving spaces
    const tokenize = (s: string) => s.match(/\S+|\s+/g) ?? [];
    return myersDiff(tokenize(a), tokenize(b));
}

interface WordSpanProps {
    a: string;
    b: string;
    side: 'old' | 'new';
}

const WordSpans = ({ a, b, side }: WordSpanProps) => {
    const tokens = wordDiff(a, b);
    return (
        <>
            {tokens.map((t, i) => {
                if (t.kind === 'eq') return <span key={i}>{t.val}</span>;
                if (t.kind === 'del' && side === 'old')
                    return (
                        <mark key={i} className="dv-word dv-word--del">
                            {t.val}
                        </mark>
                    );
                if (t.kind === 'ins' && side === 'new')
                    return (
                        <mark key={i} className="dv-word dv-word--ins">
                            {t.val}
                        </mark>
                    );
                return null;
            })}
        </>
    );
};

// ─── Syntax highlighting (token-based, no external deps) ──────────────────────

const TOKEN_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
    { name: 'comment', pattern: /\/\/.*$|\/\*[\s\S]*?\*\/|#.*$/m },
    { name: 'string', pattern: /`[\s\S]*?`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
    {
        name: 'keyword',
        pattern:
            /\b(const|let|var|function|return|if|else|for|while|class|import|export|default|from|async|await|new|typeof|instanceof|void|null|undefined|true|false|extends|implements|interface|type|enum|public|private|protected|static|readonly|abstract|def|print|pass|lambda|yield|in|is|not|and|or)\b/,
    },
    { name: 'number', pattern: /\b\d+\.?\d*\b/ },
    { name: 'tag', pattern: /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?>/ },
    { name: 'attr', pattern: /\b[a-zA-Z-]+(?==)/ },
    { name: 'function', pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/ },
];

function tokenizeLine(line: string): Array<{ name: string; val: string }> {
    const tokens: Array<{ name: string; val: string }> = [];
    let remaining = line;
    while (remaining.length > 0) {
        let matched = false;
        for (const { name, pattern } of TOKEN_PATTERNS) {
            const m = remaining.match(new RegExp(`^(?:${pattern.source})`, pattern.flags));
            if (m) {
                tokens.push({ name, val: m[0] });
                remaining = remaining.slice(m[0].length);
                matched = true;
                break;
            }
        }
        if (!matched) {
            // Consume one char
            tokens.push({ name: 'plain', val: remaining[0] });
            remaining = remaining.slice(1);
        }
    }
    return tokens;
}

const SyntaxLine = ({ text }: { text: string }) => {
    const tokens = useMemo(() => tokenizeLine(text), [text]);
    return (
        <>
            {tokens.map((t, i) =>
                t.name === 'plain' ? (
                    <span key={i}>{t.val}</span>
                ) : (
                    <span key={i} className={`dv-token dv-token--${t.name}`}>
                        {t.val}
                    </span>
                )
            )}
        </>
    );
};

// ─── Line renderer ─────────────────────────────────────────────────────────────

interface LineContentProps {
    line: DiffLine;
    side: 'old' | 'new';
    type: DiffType;
}

const LineContent = ({ line, side, type }: LineContentProps) => {
    const text = side === 'old' ? (line.text ?? line.oldText ?? '') : (line.text ?? line.newText ?? '');

    // Word-level diff only on changed lines
    const isChanged = line.kind !== 'equal' && line.oldText !== undefined && line.newText !== undefined;

    if (isChanged) {
        return <WordSpans a={line.oldText!} b={line.newText!} side={side} />;
    }

    if (type === 'code') return <SyntaxLine text={text} />;
    return <>{text}</>;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const DiffViewer = ({
    oldValue,
    newValue,
    mode = 'split',
    type = 'text',
    oldTitle = 'Before',
    newTitle = 'After',
    showLineNumbers = true,
}: DiffViewerProps) => {
    const lines = useMemo(() => computeLineDiff(oldValue, newValue), [oldValue, newValue]);

    const stats = useMemo(
        () => ({
            added: lines.filter(l => l.kind === 'added').length,
            removed: lines.filter(l => l.kind === 'removed').length,
        }),
        [lines]
    );

    return (
        <div className={`dv dv--${mode} dv--${type}`}>
            {/* ── Header ── */}
            <div className="dv__header">
                {mode === 'split' ? (
                    <>
                        <div className="dv__header-side">{oldTitle}</div>
                        <div className="dv__header-side">{newTitle}</div>
                    </>
                ) : (
                    <div className="dv__header-inline">
                        <span>{oldTitle}</span>
                        <span className="dv__header-arrow">→</span>
                        <span>{newTitle}</span>
                    </div>
                )}
                <div className="dv__stats">
                    {stats.removed > 0 && <span className="dv__stat dv__stat--removed">−{stats.removed}</span>}
                    {stats.added > 0 && <span className="dv__stat dv__stat--added">+{stats.added}</span>}
                </div>
            </div>

            {/* ── Body ── */}
            <div className="dv__body">
                {mode === 'split' ? (
                    <div className="dv__split">
                        {/* Old side */}
                        <div className="dv__pane dv__pane--old">
                            {lines.map((line, i) => {
                                const isBlank = line.kind === 'added';
                                return (
                                    <div key={i} className={`dv__row ${isBlank ? 'dv__row--blank' : `dv__row--${line.kind}`}`}>
                                        {showLineNumbers && <span className="dv__lineno">{isBlank ? '' : line.oldLineNo}</span>}
                                        <span className="dv__gutter">{isBlank ? '' : line.kind === 'removed' ? '−' : ' '}</span>
                                        <span className="dv__code">{!isBlank && <LineContent line={line} side="old" type={type} />}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* New side */}
                        <div className="dv__pane dv__pane--new">
                            {lines.map((line, i) => {
                                const isBlank = line.kind === 'removed';
                                return (
                                    <div key={i} className={`dv__row ${isBlank ? 'dv__row--blank' : `dv__row--${line.kind}`}`}>
                                        {showLineNumbers && <span className="dv__lineno">{isBlank ? '' : line.newLineNo}</span>}
                                        <span className="dv__gutter">{isBlank ? '' : line.kind === 'added' ? '+' : ' '}</span>
                                        <span className="dv__code">{!isBlank && <LineContent line={line} side="new" type={type} />}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Inline mode */
                    <div className="dv__inline">
                        {lines.map((line, i) => (
                            <div key={i} className={`dv__row dv__row--${line.kind}`}>
                                {showLineNumbers && (
                                    <>
                                        <span className="dv__lineno">{line.kind !== 'added' ? line.oldLineNo : ''}</span>
                                        <span className="dv__lineno">{line.kind !== 'removed' ? line.newLineNo : ''}</span>
                                    </>
                                )}
                                <span className="dv__gutter">{line.kind === 'removed' ? '−' : line.kind === 'added' ? '+' : ' '}</span>
                                <span className="dv__code">
                                    <LineContent line={line} side={line.kind === 'removed' ? 'old' : 'new'} type={type} />
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
