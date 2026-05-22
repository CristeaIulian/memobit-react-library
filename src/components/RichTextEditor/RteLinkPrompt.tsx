import React from 'react';

interface RteLinkPromptProps {
    isEditing: boolean;
    linkText: string;
    linkUrl: string;
    setLinkText: (value: string) => void;
    setLinkUrl: (value: string) => void;
    confirmLink: () => void;
    cancelLink: () => void;
}

export const RteLinkPrompt: React.FC<RteLinkPromptProps> = ({ isEditing, linkText, linkUrl, setLinkText, setLinkUrl, confirmLink, cancelLink }) => (
    <div className="rte-link-prompt">
        <input
            className="rte-link-input"
            type="text"
            placeholder="Display text (optional)"
            value={linkText}
            onChange={e => setLinkText(e.target.value)}
        />
        <input
            className="rte-link-input"
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => {
                if (e.key === 'Enter') confirmLink();
                if (e.key === 'Escape') cancelLink();
            }}
            autoFocus
        />
        <div className="rte-link-actions">
            <button type="button" className="rte-link-btn rte-link-btn--confirm" onClick={confirmLink}>
                {isEditing ? 'Update' : 'Insert'}
            </button>
            <button type="button" className="rte-link-btn rte-link-btn--cancel" onClick={cancelLink}>
                Cancel
            </button>
        </div>
    </div>
);
