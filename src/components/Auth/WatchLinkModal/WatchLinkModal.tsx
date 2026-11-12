import { type ReactElement, useCallback, useEffect, useState } from 'react';

import { formatDate } from '../../../helpers/Datetime';
import { buildRequestHeaders, HttpMethod } from '../../../helpers/Http';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../Button';
import { InputPIN } from '../../InputPIN';
import { Modal } from '../../Modal';

import './WatchLinkModal.scss';

interface WatchLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/** A watch signed in through a pairing code (memobit-framework WatchController). */
interface LinkedWatch {
    id: number;
    label: string;
    /** Server-local 'YYYY-MM-DD HH:MM:SS'. */
    createdAt: string;
    lastUsedAt: string | null;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const CODE_LENGTH = 6;

const formatServerDate = (value: string): string => formatDate(new Date(value.replace(' ', 'T')), 'DD MMM YYYY, HH:mm:ss');

/**
 * Links a watch app (Garmin Connect IQ) to the signed-in account: the watch shows a 6-character
 * code, entering it here signs that watch in. Lists the linked watches so one can be signed out.
 * Talks to the framework's watch/* routes, which the app must route (see memobit-framework README).
 */
export function WatchLinkModal({ isOpen, onClose }: WatchLinkModalProps): ReactElement {
    const { config } = useAuth();
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isLinking, setIsLinking] = useState(false);
    const [watches, setWatches] = useState<LinkedWatch[]>([]);
    const [listError, setListError] = useState<string | undefined>();

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
                throw new Error(data.error || 'Request failed');
            }
            return data.data;
        },
        [config.apiBaseUrl]
    );

    const refresh = useCallback(async () => {
        try {
            setWatches((await request<LinkedWatch[]>('/watch/devices', HttpMethod.Get)) ?? []);
            setListError(undefined);
        } catch {
            setListError('Could not load your linked watches.');
        }
    }, [request]);

    useEffect(() => {
        if (!isOpen) return;
        setCode('');
        setError(undefined);
        setSuccess(undefined);
        void refresh();
    }, [isOpen, refresh]);

    const handleLink = async (value: string) => {
        if (value.length !== CODE_LENGTH || isLinking) return;
        setIsLinking(true);
        setError(undefined);
        setSuccess(undefined);
        try {
            const result = await request<{ label: string }>('/watch/link', HttpMethod.Post, { code: value });
            setSuccess(`${result?.label ?? 'The watch'} is linked. It will sync in a moment.`);
            setCode('');
            await refresh();
        } catch (linkError) {
            setError(linkError instanceof Error ? linkError.message : 'That code did not work.');
        } finally {
            setIsLinking(false);
        }
    };

    const handleUnlink = async (watch: LinkedWatch) => {
        try {
            await request(`/watch/unlink/${watch.id}`, HttpMethod.Post);
            await refresh();
        } catch {
            setListError(`Could not sign ${watch.label} out.`);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Link a watch"
            titleIcon="link"
            size="small"
            primary={{ text: 'Link', icon: 'checkmark', variant: 'info', onClick: () => handleLink(code), disabled: code.length !== CODE_LENGTH || isLinking }}
            secondary={{ text: 'Close', variant: 'plain', onClick: onClose }}
        >
            <div className="WatchLinkModal">
                <p className="WatchLinkModal_hint">Open the app on your watch and type the code it shows.</p>
                <InputPIN
                    autoFocus
                    length={CODE_LENGTH}
                    groupSize={3}
                    type="alphanumeric"
                    value={code}
                    error={error}
                    success={success}
                    disabled={isLinking}
                    onChange={next => setCode(next.toUpperCase())}
                    onComplete={next => handleLink(next.toUpperCase())}
                />

                {listError && <p className="WatchLinkModal_error">{listError}</p>}

                {watches.length > 0 && (
                    <div className="WatchLinkModal_list">
                        <span className="WatchLinkModal_listTitle">Linked watches</span>
                        {watches.map(watch => (
                            <div key={watch.id} className="WatchLinkModal_item">
                                <div className="WatchLinkModal_itemText">
                                    <span className="WatchLinkModal_itemName">{watch.label}</span>
                                    <span className="WatchLinkModal_itemMeta">
                                        Linked {formatServerDate(watch.createdAt)}
                                        {watch.lastUsedAt ? ` · last synced ${formatServerDate(watch.lastUsedAt)}` : ''}
                                    </span>
                                </div>
                                <Button size="small" variant="ghost" icon="logout" onClick={() => handleUnlink(watch)}>
                                    Sign out
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
}
