import { useCallback, useEffect, useState } from 'react';

import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import { Icon } from '../Icon';
import { InputText } from '../InputText';
import { Loading } from '../Loading';
import { Modal } from '../Modal';

import './FolderBrowserModal.scss';

export interface FolderBrowserEntry {
    name: string;
    path: string;
}

export interface FolderBrowserListing {
    /** Absolute path currently shown, or null when listing drive roots. */
    current: string | null;
    /** Parent path, or null when there is no navigable parent. */
    parent: string | null;
    /** Drive roots (e.g. `C:\`) used as the top level of the tree. */
    drives: string[];
    directories: FolderBrowserEntry[];
    error?: string;
}

export interface FolderBrowserModalProps {
    isOpen: boolean;
    title?: string;
    /** Path to open the browser at. Omit to start from the drive list. */
    initialPath?: string;
    /** Loads a directory listing. Called with no argument to list drive roots. */
    loadDirectory: (path?: string) => Promise<FolderBrowserListing>;
    onSelect: (path: string) => void;
    onClose: () => void;
    selectLabel?: string;
}

export const FolderBrowserModal = ({
    isOpen,
    title = 'Select a folder',
    initialPath,
    loadDirectory,
    onSelect,
    onClose,
    selectLabel = 'Select this folder',
}: FolderBrowserModalProps) => {
    const [listing, setListing] = useState<FolderBrowserListing | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pathInput, setPathInput] = useState('');

    const navigate = useCallback(
        async (path?: string) => {
            setIsLoading(true);
            try {
                setListing(await loadDirectory(path));
            } catch {
                setListing({ current: path ?? null, parent: null, drives: [], directories: [], error: 'Unable to read directory.' });
            } finally {
                setIsLoading(false);
            }
        },
        [loadDirectory]
    );

    useEffect(() => {
        if (isOpen) {
            void navigate(initialPath);
        }
    }, [isOpen, initialPath, navigate]);

    // Keep the editable path field in sync with the directory actually loaded.
    useEffect(() => {
        setPathInput(listing?.current ?? '');
    }, [listing]);

    const handleUp = () => {
        if (!listing) return;
        void navigate(listing.parent ?? '');
    };

    const handlePathSubmit = () => {
        const trimmed = pathInput.trim();
        if (isLoading || trimmed === (listing?.current ?? '')) return;
        void navigate(trimmed === '' ? undefined : trimmed);
    };

    const atDrives = listing?.current === null;
    const entries = atDrives
        ? listing?.drives.map(drive => ({ name: drive, path: drive })) ?? []
        : listing?.directories ?? [];

    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={onClose}
            size="medium"
            className="folder-browser"
            primary={{
                variant: 'success',
                icon: 'checkmark',
                text: selectLabel,
                disabled: atDrives || !listing?.current,
                onClick: () => listing?.current && onSelect(listing.current),
            }}
            secondary={{ variant: 'default', icon: 'return', text: 'Cancel', onClick: onClose }}
        >
            <div className="folder-browser__body">
                <div className="folder-browser__path-row">
                    <Button variant="default" size="small" icon="arrow-up" disabled={isLoading || atDrives} onClick={handleUp}>
                        Up
                    </Button>
                    <div className={`folder-browser__path${listing?.error ? ' folder-browser__path--error' : ''}`}>
                        <InputText
                            value={pathInput}
                            placeholder="Paste or type a folder path, then press Enter"
                            disabled={isLoading}
                            onChange={setPathInput}
                            onKeyDown={event => event.key === 'Enter' && handlePathSubmit()}
                        />
                    </div>
                    <Button variant="default" size="small" icon="arrow-right" disabled={isLoading} onClick={handlePathSubmit}>
                        Go
                    </Button>
                </div>

                {listing?.error && <p className="folder-browser__error">{listing.error}</p>}

                <div className="folder-browser__list">
                    {isLoading ? (
                        <div className="folder-browser__loading">
                            <Loading />
                        </div>
                    ) : entries.length === 0 ? (
                        <EmptyState icon="folder" title="No subfolders" description="This folder has no subfolders. You can still select it." />
                    ) : (
                        entries.map(entry => (
                            <button
                                key={entry.path}
                                type="button"
                                className="folder-browser__entry"
                                onDoubleClick={() => void navigate(entry.path)}
                                onClick={() => void navigate(entry.path)}
                            >
                                <Icon name="folder" size="sm" />
                                <span className="folder-browser__entry-name">{entry.name}</span>
                                <Icon className="folder-browser__entry-chevron" name="arrow-right" size="sm" />
                            </button>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
};
