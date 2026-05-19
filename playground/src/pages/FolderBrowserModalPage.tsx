import React, { useCallback, useMemo, useState } from 'react';

import { Badge, Button, FolderBrowserModal, type FolderBrowserEntry, type FolderBrowserListing } from '../../../src';

import './FolderBrowserModalPage.scss';

const drives = ['C:\\', 'D:\\'];

const folderTree: Record<string, string[]> = {
    'C:\\': ['Users', 'Projects', 'Program Files'],
    'C:\\Users': ['iulia', 'Public'],
    'C:\\Users\\iulia': ['Desktop', 'Documents', 'Downloads', 'Pictures'],
    'C:\\Users\\iulia\\Documents': ['Invoices', 'Reports', 'Templates'],
    'C:\\Users\\iulia\\Documents\\Reports': ['2025', '2026'],
    'C:\\Users\\iulia\\Documents\\Reports\\2026': ['May review', 'Q2 planning'],
    'C:\\Users\\iulia\\Downloads': [],
    'C:\\Projects': ['Web Apps', 'Design Systems', 'Sandbox'],
    'C:\\Projects\\Web Apps': ['LIBRARIES', 'Online', 'Internal Tools'],
    'C:\\Projects\\Web Apps\\LIBRARIES': ['memobit-react', 'shared-icons'],
    'C:\\Projects\\Web Apps\\LIBRARIES\\memobit-react': ['src', 'playground', 'dist'],
    'D:\\': ['Archive', 'Media', 'Backups'],
    'D:\\Archive': ['Client exports', 'Restricted', 'Receipts'],
    'D:\\Archive\\Client exports': ['Acme', 'Northwind', 'Umbrella'],
    'D:\\Backups': ['Daily', 'Weekly', 'Monthly'],
};

const pathLabel = (path: string | null): string => path ?? 'This PC';

const getParentPath = (path: string): string | null => {
    const normalized = path.endsWith('\\') && path.length > 3 ? path.slice(0, -1) : path;
    if (drives.includes(normalized)) {
        return null;
    }

    const lastSlash = normalized.lastIndexOf('\\');
    if (lastSlash <= 2) {
        return `${normalized.slice(0, 2)}\\`;
    }

    return normalized.slice(0, lastSlash);
};

const makeEntry = (parent: string, name: string): FolderBrowserEntry => ({
    name,
    path: parent.endsWith('\\') ? `${parent}${name}` : `${parent}\\${name}`,
});

// A folder "exists" if it is a key in the tree or appears as a child of one.
const validPaths = new Set<string>([
    ...Object.keys(folderTree),
    ...Object.entries(folderTree).flatMap(([parent, names]) => names.map(name => makeEntry(parent, name).path)),
]);

const createListing = (path?: string): FolderBrowserListing => {
    if (!path) {
        return {
            current: null,
            parent: null,
            drives,
            directories: [],
        };
    }

    if (path === 'D:\\Archive\\Restricted') {
        return {
            current: path,
            parent: getParentPath(path),
            drives,
            directories: [],
            error: 'Access denied for this folder.',
        };
    }

    const normalized = path.endsWith('\\') && path.length > 3 ? path.slice(0, -1) : path;
    if (!validPaths.has(normalized)) {
        return {
            current: path,
            parent: null,
            drives,
            directories: [],
            error: `Folder "${path}" does not exist.`,
        };
    }

    const directories = (folderTree[normalized] ?? []).map(name => makeEntry(normalized, name));

    return {
        current: normalized,
        parent: getParentPath(normalized),
        drives,
        directories,
    };
};

interface BrowserCardProps {
    title: string;
    description: string;
    buttonLabel: string;
    selectedPath?: string;
    onOpen: () => void;
}

const BrowserCard: React.FC<BrowserCardProps> = ({ title, description, buttonLabel, selectedPath, onOpen }) => (
    <div className="folder-browser-card">
        <div className="folder-browser-card__body">
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="folder-browser-card__path">
                <span>Selected</span>
                <strong title={selectedPath}>{selectedPath ?? 'None'}</strong>
            </div>
        </div>
        <Button icon="folder-open" onClick={onOpen}>
            {buttonLabel}
        </Button>
    </div>
);

export const FolderBrowserModalPage: React.FC = () => {
    const [activeBrowser, setActiveBrowser] = useState<'root' | 'project' | 'empty' | 'error' | null>(null);
    const [selectedRoot, setSelectedRoot] = useState<string>();
    const [selectedProject, setSelectedProject] = useState('C:\\Projects\\Web Apps\\LIBRARIES\\memobit-react');
    const [selectedEmpty, setSelectedEmpty] = useState<string>();
    const [selectedError, setSelectedError] = useState<string>();

    const loadDirectory = useCallback(async (path?: string): Promise<FolderBrowserListing> => {
        await new Promise(resolve => setTimeout(resolve, 180));
        return createListing(path);
    }, []);

    const modalConfig = useMemo(() => {
        switch (activeBrowser) {
            case 'root':
                return {
                    title: 'Choose workspace folder',
                    initialPath: undefined,
                    selectLabel: 'Use folder',
                    onSelect: setSelectedRoot,
                };
            case 'project':
                return {
                    title: 'Select project subfolder',
                    initialPath: selectedProject,
                    selectLabel: 'Set project folder',
                    onSelect: setSelectedProject,
                };
            case 'empty':
                return {
                    title: 'Select an empty folder',
                    initialPath: 'C:\\Users\\iulia\\Downloads',
                    selectLabel: 'Select empty folder',
                    onSelect: setSelectedEmpty,
                };
            case 'error':
                return {
                    title: 'Browse protected archive',
                    initialPath: 'D:\\Archive',
                    selectLabel: 'Use archive folder',
                    onSelect: setSelectedError,
                };
            default:
                return null;
        }
    }, [activeBrowser, selectedProject]);

    return (
        <div className="folder-browser-modal-page">
            <h1>FolderBrowserModal Component</h1>
            <p>Folder picker modal with async directory loading, drive-root navigation, parent traversal, and selectable current folders.</p>

            <section className="page-section">
                <h2>Browse Flows</h2>

                <div className="folder-browser-grid">
                    <BrowserCard
                        title="Start at drive roots"
                        description="Open at This PC and pick a drive before selecting a folder."
                        buttonLabel="Browse Roots"
                        selectedPath={selectedRoot}
                        onOpen={() => setActiveBrowser('root')}
                    />
                    <BrowserCard
                        title="Open inside a project"
                        description="Start from a known folder so the user can move up or drill deeper."
                        buttonLabel="Browse Project"
                        selectedPath={selectedProject}
                        onOpen={() => setActiveBrowser('project')}
                    />
                    <BrowserCard
                        title="Empty folder state"
                        description="Show the empty-state copy while still allowing the current folder to be selected."
                        buttonLabel="Browse Empty"
                        selectedPath={selectedEmpty}
                        onOpen={() => setActiveBrowser('empty')}
                    />
                    <BrowserCard
                        title="Directory error"
                        description="Navigate into Restricted to show the inline load error state."
                        buttonLabel="Browse Archive"
                        selectedPath={selectedError}
                        onOpen={() => setActiveBrowser('error')}
                    />
                </div>
            </section>

            <section className="page-section">
                <h2>Mock Filesystem</h2>
                <div className="showcase-group">
                    <h3>Available paths</h3>
                    <div className="folder-browser-path-list">
                        {Object.keys(folderTree).map(path => (
                            <div key={path} className="folder-browser-path-list__item">
                                <strong>{pathLabel(path)}</strong>
                                <Badge size="small" variant={folderTree[path].length > 0 ? 'info' : 'default'}>
                                    {folderTree[path].length} folders
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {modalConfig && (
                <FolderBrowserModal
                    isOpen={activeBrowser !== null}
                    title={modalConfig.title}
                    initialPath={modalConfig.initialPath}
                    selectLabel={modalConfig.selectLabel}
                    loadDirectory={loadDirectory}
                    onSelect={path => {
                        modalConfig.onSelect(path);
                        setActiveBrowser(null);
                    }}
                    onClose={() => setActiveBrowser(null)}
                />
            )}
        </div>
    );
};
