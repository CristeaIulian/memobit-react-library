export interface ThemeConfig {
    value: string;
    label: string;
    fontUrl: string;
    fontUrlDisplay?: string;
    fontUrlMono?: string;
    recommendedApps?: string[];
}

export const THEME_CONFIGS: ThemeConfig[] = [
    {
        value: 'arctic-blue',
        label: 'Arctic Blue',
        fontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'azure-night',
        label: 'Azure Night',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    {
        value: 'blossom-meadow',
        label: 'Blossom Meadow',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400&display=swap',
        recommendedApps: ['child-progress'],
    },
    {
        value: 'crimson-dusk',
        label: 'Crimson Dusk',
        fontUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'cyber-forest',
        label: 'Cyber Forest',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    {
        value: 'dashdarkx',
        label: 'DashDark X',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap',
    },
    {
        value: 'ember-night',
        label: 'Ember Night',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'frost-petal',
        label: 'Frost Petal',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'lavender-mist',
        label: 'Lavender Mist',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'light-blue',
        label: 'Light Blue',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap',
    },
    {
        value: 'lumen',
        label: 'Lumen',
        recommendedApps: ['Photo Face Search'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap',
        fontUrlMono: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap',
    },
    {
        value: 'luna',
        label: 'Luna',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
    },
    {
        value: 'mint-meadow',
        label: 'Mint Meadow',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'mintone',
        label: 'MinTone',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap',
    },
    {
        value: 'neon-tokyo',
        label: 'Neon Tokyo',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'ocean-breeze',
        label: 'Ocean Breeze',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800&display=swap',
    },
    {
        value: 'ocean-depths',
        label: 'Ocean Depths',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    {
        value: 'sandstone',
        label: 'Sandstone',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'tailwind-vue-dark',
        label: 'Tailwind View Dark',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swa',
    },
    {
        value: 'twilight-pulse',
        label: 'Twilight Pulse',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    {
        value: 'sandy-parchment',
        label: 'Sandy Parchment',
        recommendedApps: ['Books'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Newsreader:wght@400;500;600;700&display=swap',
    },
    {
        value: 'midnight-amber',
        label: 'Midnight Amber',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap',
    },
    {
        value: 'cobalt-pulse',
        label: 'Cobalt Pulse',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap',
        fontUrlMono: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap',
    },
    {
        value: 'carbon-velocity',
        label: 'Carbon Velocity',
        recommendedApps: ['Cars'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap',
    },
    {
        value: 'signal-burst',
        label: 'Signal Burst',
        recommendedApps: ['Impulse'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'ivory-serif',
        label: 'Ivory Serif',
        recommendedApps: ['Resume / CV'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
    },
    {
        value: 'clinical-aqua',
        label: 'Clinical Aqua',
        recommendedApps: ['MedTrack'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400&display=swap',
    },
    {
        value: 'velvet-tome',
        label: 'Velvet Tome',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
    },
    {
        value: 'midnight-folio',
        label: 'Midnight Folio',
        recommendedApps: ['Library Presentation'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap',
    },
    {
        value: 'velvet-reel',
        label: 'Velvet Reel',
        recommendedApps: ['Movies'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap',
    },
    {
        value: 'noir-marquee',
        label: 'Noir Marquee',
        recommendedApps: ['Movies'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&display=swap',
    },
    {
        value: 'garden-harvest',
        label: 'Garden Harvest',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap',
        recommendedApps: ['Nutrition'],
    },
    {
        value: 'citrus-vital',
        label: 'Citrus Vital',
        recommendedApps: ['Nutrition'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700&display=swap',
    },
    {
        value: 'horizon-amber',
        label: 'Horizon Amber',
        recommendedApps: ['Ascend'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap',
    },
    {
        value: 'chalk-circuit',
        label: 'Chalk & Circuit',
        recommendedApps: ['Quiz Lab'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'terracotta-kitchen',
        label: 'Terracotta Kitchen',
        recommendedApps: ['Recipes'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
    },
    {
        value: 'blush-market',
        label: 'Blush Market',
        fontUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400&display=swap',
    },
    {
        value: 'slate-bazaar',
        label: 'Slate Bazaar',
        recommendedApps: ['Shopping'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'slate-focus',
        label: 'Slate Focus',
        recommendedApps: ['Todo'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    {
        value: 'horizon-drift',
        label: 'Horizon Drift',
        recommendedApps: ['Travel'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'midnight-atlas',
        label: 'Midnight Atlas',
        recommendedApps: ['Travel'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Newsreader:wght@400;500;600;700&display=swap',
    },
    {
        value: 'vault-guard',
        label: 'Vault Guard',
        recommendedApps: ['Backup'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap',
    },
    {
        value: 'crawler-dusk',
        label: 'Crawler Dusk',
        recommendedApps: ['Books Crawler'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap',
    },
    {
        value: 'asphalt-code',
        label: 'Asphalt Code',
        recommendedApps: ['Cars Crawler'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap',
    },
    {
        value: 'emerald-ledger',
        label: 'Emerald Ledger',
        recommendedApps: ['Finances'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
    },
    {
        value: 'vital-signal',
        label: 'Vital Signal',
        recommendedApps: ['Health Intelligence System'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap',
    },
    {
        value: 'gilded-bear',
        label: 'Gilded Bear',
        recommendedApps: ['Investments'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
    },
    {
        value: 'mesh-circuit',
        label: 'Mesh Circuit',
        recommendedApps: ['Internet of Things'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap',
    },
    {
        value: 'amber-meridian',
        label: 'Amber Meridian',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap',
    },
    {
        value: 'vital-aurora',
        label: 'Vital Aurora',
        recommendedApps: ['Life Expectancy / Lifespan'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap',
    },
    {
        value: 'spectrum-vault',
        label: 'Spectrum Vault',
        recommendedApps: ['Media Info / Personal Media Collections'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap',
    },
    {
        value: 'archive-indigo',
        label: 'Archive Indigo',
        recommendedApps: ['Media Organizer'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'terminal-phosphor',
        label: 'Terminal Phosphor',
        fontUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap',
        fontUrlMono: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap',
    },
    {
        value: 'signal-clarity',
        label: 'Signal Clarity',
        recommendedApps: ['Network Audit'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'audit-ember',
        label: 'Audit Ember',
        recommendedApps: ['Network Audit'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap',
        fontUrlMono: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap',
    },
    {
        value: 'blueprint-clay',
        label: 'Blueprint Clay',
        recommendedApps: ['Real Estate Crawler'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap',
    },
    {
        value: 'brass-chronicle',
        label: 'Brass Chronicle',
        recommendedApps: ['Timeline Explorer'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap',
    },
    {
        value: 'graphite-shell',
        label: 'Graphite Shell',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap',
    },
    {
        value: 'command-slate',
        label: 'Command Slate',
        recommendedApps: ['Tools Launcher'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap',
    },
    {
        value: 'screening-room',
        label: 'Screening Room',
        recommendedApps: ['Movies'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;500;600;700;800&display=swap',
    },
    {
        value: 'verdant-pulse',
        label: 'Verdant Pulse',
        recommendedApps: ['Nutrition'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&display=swap',
    },
    {
        value: 'atelier-media',
        label: 'Atelier Media',
        recommendedApps: ['MediaOrganizer'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        fontUrlDisplay:
            'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,500&display=swap',
    },
    {
        value: 'chrono-atlas',
        label: 'Chrono Atlas',
        recommendedApps: ['Timeline Explorer'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap',
        fontUrlDisplay: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
    },
    {
        value: 'orbital-night',
        label: 'Orbital Night',
        recommendedApps: ['Global Pulse'],
        fontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap',
        fontUrlMono: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap',
    },
];

export const FAVORITE_THEMES = new Set([
    'arctic-blue',
    'crimson-dusk',
    'frost-petal',
    'lavender-mist',
    'ocean-breeze',
    'ocean-depths',
    'sandstone',
    'tailwind-vue-dark',
]);

export const LIGHT_THEMES = new Set([
    'atelier-media',
    'blueprint-clay',
    'blush-market',
    'chrono-atlas',
    'clinical-aqua',
    'frost-petal',
    'garden-harvest',
    'horizon-drift',
    'ivory-serif',
    'lavender-mist',
    'mint-meadow',
    'mintone',
    'ocean-breeze',
    'sandstone',
    'sandy-parchment',
    'terracotta-kitchen',
    'vital-aurora',
]);

export type ThemeAppearance = 'light' | 'dark';

export const getThemeAppearance = (themeValue: string): ThemeAppearance => {
    return LIGHT_THEMES.has(themeValue) ? 'light' : 'dark';
};

export const getThemeConfig = (themeValue: string): ThemeConfig | undefined => {
    return THEME_CONFIGS.find(config => config.value === themeValue);
};
