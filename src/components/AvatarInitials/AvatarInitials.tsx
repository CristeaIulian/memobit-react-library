import React from 'react';

import './AvatarInitials.scss';

type AvatarSize = 'small' | 'medium' | 'large';
type AvatarShape = 'rounded' | 'squared';

interface AvatarInitialsProps {
    name: string;
    size?: AvatarSize;
    shape?: AvatarShape;
    className?: string;
}

// Deterministic palette — picked from the luna theme accent family + complementary tones
const AVATAR_COLORS: Array<{ background: string; color: string }> = [
    { background: '#f6a821', color: '#1a1a1a' }, // amber (accent)
    { background: '#1bbf89', color: '#ffffff' }, // success green
    { background: '#56c0e0', color: '#1a1a1a' }, // info blue
    { background: '#db524b', color: '#ffffff' }, // danger red
    { background: '#8b6fff', color: '#ffffff' }, // violet
    { background: '#f7af3e', color: '#1a1a1a' }, // warm orange
    { background: '#3f859a', color: '#ffffff' }, // teal
    { background: '#b6443e', color: '#ffffff' }, // deep red
    { background: '#168963', color: '#ffffff' }, // forest green
    { background: '#616779', color: '#ffffff' }, // slate
];

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || name.trim() === '') return '?';
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorIndex(initials: string): number {
    // Simple hash: sum of char codes mod palette length
    let hash = 0;
    for (const char of initials) {
        hash += char.charCodeAt(0);
    }
    return hash % AVATAR_COLORS.length;
}

export const AvatarInitials: React.FC<AvatarInitialsProps> = ({
    name,
    size = 'medium',
    shape = 'rounded',
    className = '',
}) => {
    const initials = getInitials(name);
    const { background, color } = AVATAR_COLORS[getColorIndex(initials)];

    return (
        <div
            className={`avatar-initials avatar-initials--${size} avatar-initials--${shape} ${className}`}
            style={{ backgroundColor: background, color }}
            title={name}
            role="img"
            aria-label={`Avatar for ${name}`}
        >
            <span className="avatar-initials__text">{initials}</span>
        </div>
    );
};
