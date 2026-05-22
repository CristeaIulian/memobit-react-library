import { createContext } from 'react';

export type Theme =
    | 'amber-meridian'
    | 'archive-indigo'
    | 'arctic-blue'
    | 'asphalt-code'
    | 'atelier-media'
    | 'audit-ember'
    | 'azure-night'
    | 'blueprint-clay'
    | 'blush-market'
    | 'brass-chronicle'
    | 'carbon-velocity'
    | 'chalk-circuit'
    | 'chrono-atlas'
    | 'clinical-aqua'
    | 'cobalt-pulse'
    | 'citrus-vital'
    | 'command-slate'
    | 'crawler-dusk'
    | 'crimson-dusk'
    | 'cyber-forest'
    | 'dashdarkx'
    | 'ember-night'
    | 'emerald-ledger'
    | 'frost-petal'
    | 'garden-harvest'
    | 'gilded-bear'
    | 'graphite-shell'
    | 'horizon-amber'
    | 'horizon-drift'
    | 'ivory-serif'
    | 'lavender-mist'
    | 'light-blue'
    | 'luna'
    | 'mesh-circuit'
    | 'midnight-atlas'
    | 'midnight-amber'
    | 'midnight-folio'
    | 'mint-meadow'
    | 'mintone'
    | 'neon-tokyo'
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
    | 'spectrum-vault'
    | 'tailwind-vue-dark'
    | 'terminal-phosphor'
    | 'terracotta-kitchen'
    | 'twilight-pulse'
    | 'vault-guard'
    | 'velvet-reel'
    | 'velvet-tome'
    | 'verdant-pulse'
    | 'vital-aurora'
    | 'vital-signal';

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
