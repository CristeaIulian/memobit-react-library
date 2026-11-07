import { createContext } from 'react';

export type Theme =
    | 'arctic-blue'
    | 'asphalt-code'
    | 'atelier-media'
    | 'audit-ember'
    | 'azure-night'
    | 'blossom-meadow'
    | 'blueprint-clay'
    | 'carbon-velocity'
    | 'chalk-circuit'
    | 'chrono-atlas'
    | 'circuit-harbor'
    | 'cobalt-pulse'
    | 'citrus-vital'
    | 'crawler-dusk'
    | 'crimson-dusk'
    | 'cyber-forest'
    | 'dashdarkx'
    | 'emerald-ledger'
    | 'garden-harvest'
    | 'graphite-shell'
    | 'horizon-amber'
    | 'indigo-stitch'
    | 'ivory-serif'
    | 'kindred-ink'
    | 'lamplight'
    | 'lumen'
    | 'luna'
    | 'mesh-circuit'
    | 'midnight-atlas'
    | 'midnight-amber'
    | 'noir-marquee'
    | 'ocean-breeze'
    | 'ocean-depths'
    | 'orbital-night'
    | 'sandstone'
    | 'sandy-parchment'
    | 'screening-room'
    | 'signal-burst'
    | 'signal-clarity'
    | 'slate-focus'
    | 'slate-bazaar'
    | 'tailwind-vue-dark'
    | 'terminal-phosphor'
    | 'terracotta-kitchen'
    | 'vault-guard'
    | 'verdant-pulse'
    | 'vital-aurora'
    | 'vital-signal'
    | 'war-room';

export interface ThemeEffects {
    effect: string;
    components: string[];
}

export interface ThemeSaveValue {
    theme: Theme;
    effects: ThemeEffects;
}

export interface ThemeContextType {
    theme: Theme;
    effects: ThemeEffects;
    setPreviewTheme: (theme: Theme) => void;
    setPreviewEffects: (effects: ThemeEffects) => void;
    commitPreview: () => void;
    clearPreview: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
