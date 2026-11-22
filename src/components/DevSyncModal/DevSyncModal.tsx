import { type ReactElement, useCallback, useEffect, useState } from 'react';

import { formatBytes } from '../../helpers/Format';
import { buildRequestHeaders, HttpMethod } from '../../helpers/Http';
import { useAuth } from '../../hooks/useAuth';
import { Checkbox } from '../Checkbox';
import { Modal } from '../Modal';
import { ProgressBar } from '../ProgressBar';

import './DevSyncModal.scss';

interface DevSyncModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/** The uploaded-files part of a pull (ProdSyncFiles::pull). */
interface FilesSummary {
    filesDownloaded: number;
    filesRemoved: number;
    filesUnchanged: number;
    bytesDownloaded: number;
    /** false when prod has no data-files folder for this app; nothing local was touched. */
    filesOnProd: boolean;
}

/** What the framework's devSync/pull reports back (ProdSync::pull). */
interface PullSummary {
    tables: number;
    rows: number;
    skippedTables: string[];
    unmatchedUsers: string[];
    structure: boolean;
    durationMs: number;
    files?: FilesSummary;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

type Phase = 'idle' | 'pulling' | 'done';

const formatDuration = (ms: number): string => (ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`);

const describeFiles = (files: FilesSummary): string => {
    if (!files.filesOnProd) {
        return 'Prod has no uploaded files for this app, so local files were left as they are.';
    }
    const parts = [`${files.filesDownloaded} files downloaded (${formatBytes(files.bytesDownloaded, 1)})`, `${files.filesUnchanged} already up to date`];
    if (files.filesRemoved > 0) {
        parts.push(`${files.filesRemoved} local-only removed`);
    }
    return `Uploaded files: ${parts.join(', ')}.`;
};

/**
 * Local dev only: replaces this app's local data with a copy from prod, through the
 * framework's devSync/pull (which the framework routes only when APP_ENV is development).
 */
export function DevSyncModal({ isOpen, onClose }: DevSyncModalProps): ReactElement {
    const { config } = useAuth();
    const [withStructure, setWithStructure] = useState(false);
    const [withFiles, setWithFiles] = useState(false);
    const [phase, setPhase] = useState<Phase>('idle');
    const [isConfigured, setIsConfigured] = useState<boolean | undefined>();
    const [summary, setSummary] = useState<PullSummary | undefined>();
    const [error, setError] = useState<string | undefined>();

    const request = useCallback(
        async <T,>(path: string, method: HttpMethod, body?: Record<string, unknown>): Promise<T | undefined> => {
            const response = await fetch(`${config.apiBaseUrl}${path}`, {
                method,
                credentials: 'include',
                headers: buildRequestHeaders(method),
                body: body ? JSON.stringify(body) : undefined,
            });
            const data = (await response.json().catch(() => ({}))) as ApiResponse<T>;
            if (!response.ok || !data.success) {
                throw new Error(data.error || `Request failed (HTTP ${response.status})`);
            }
            return data.data;
        },
        [config.apiBaseUrl]
    );

    useEffect(() => {
        if (!isOpen) return;
        setPhase('idle');
        setSummary(undefined);
        setError(undefined);
        request<{ configured: boolean }>('/devSync/status', HttpMethod.Get)
            .then(status => setIsConfigured(Boolean(status?.configured)))
            .catch(() => {
                setIsConfigured(false);
                setError('This server does not offer the sync. It runs only on a local development backend.');
            });
    }, [isOpen, request]);

    const handlePull = async () => {
        setPhase('pulling');
        setError(undefined);
        try {
            setSummary(await request<PullSummary>('/devSync/pull', HttpMethod.Post, { structure: withStructure, files: withFiles }));
            setPhase('done');
        } catch (pullError) {
            setError(pullError instanceof Error ? pullError.message : 'The sync failed.');
            setPhase('idle');
        }
    };

    const isPulling = phase === 'pulling';
    const handleClose = () => {
        if (!isPulling) onClose();
    };

    const primary =
        phase === 'done'
            ? { text: 'Reload page', icon: 'synchronize' as const, variant: 'info' as const, onClick: () => window.location.reload() }
            : { text: 'Pull', icon: 'download' as const, variant: 'info' as const, onClick: handlePull, disabled: isPulling || !isConfigured };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Pull prod data"
            titleIcon="synchronize"
            size="small"
            primary={primary}
            secondary={{ text: 'Close', variant: 'plain', onClick: handleClose, disabled: isPulling }}
        >
            <div className="DevSyncModal">
                <p className="DevSyncModal_hint">Replaces this app&apos;s local data with a copy from prod. Nothing outside this app is touched.</p>

                <div className="DevSyncModal_options">
                    <Checkbox
                        label="Also copy the table structures"
                        checked={withStructure}
                        disabled={isPulling || phase === 'done'}
                        onChange={setWithStructure}
                    />
                    <p className="DevSyncModal_optionHint">
                        {withStructure
                            ? 'Drops and recreates the tables from prod. Local schema changes not yet on prod are lost.'
                            : 'Keeps the local tables as they are and replaces only their rows.'}
                    </p>
                </div>

                <div className="DevSyncModal_options">
                    <Checkbox
                        label="Also copy the uploaded images and files"
                        checked={withFiles}
                        disabled={isPulling || phase === 'done'}
                        onChange={setWithFiles}
                    />
                    <p className="DevSyncModal_optionHint">
                        {withFiles
                            ? 'Downloads only what is new or changed in data-files, and removes local files prod does not have. The first pull can take a while.'
                            : 'Leaves the local data-files folder as it is.'}
                    </p>
                </div>

                {isConfigured === false && !error && (
                    <p className="DevSyncModal_warning">Add SYNC_KEY to this app&apos;s .env (the same value as the prod hub&apos;s) to enable the sync.</p>
                )}

                {isPulling && <ProgressBar value={100} striped animated showPercentage={false} label="Pulling from prod…" />}

                {error && <p className="DevSyncModal_error">{error}</p>}

                {summary && (
                    <div className="DevSyncModal_summary">
                        <p className="DevSyncModal_success">
                            Copied {summary.rows} rows across {summary.tables} tables in {formatDuration(summary.durationMs)}.
                        </p>
                        {summary.files && <p className="DevSyncModal_hint">{describeFiles(summary.files)}</p>}
                        {summary.skippedTables.length > 0 && (
                            <p className="DevSyncModal_warning">
                                Not on local, skipped: {summary.skippedTables.join(', ')}. Tick the structures option to create them.
                            </p>
                        )}
                        {summary.unmatchedUsers.length > 0 && (
                            <p className="DevSyncModal_warning">
                                No local account for {summary.unmatchedUsers.join(', ')}, so their rows keep the prod user id.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
