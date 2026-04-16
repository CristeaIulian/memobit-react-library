export const extractDomainFromUrl = (url: string): string => {
    const urlParts = new URL(url);
    return urlParts.host;
};

export const stripQueryString = (url: string): string => {
    try {
        const parsed = new URL(url.trim());
        parsed.search = '';
        parsed.hash = '';
        return parsed.toString().replace(/\/$/, '');
    } catch {
        return url.trim();
    }
};

const TRACKING_PARAMS = new Set([
    // Google Ads / Analytics
    'gclid', 'gclsrc', 'gad_source', 'gad_campaignid', 'gbraid', 'wbraid', 'dclid',
    // UTM
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
    // Facebook / Meta
    'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref',
    // Microsoft / Bing
    'msclkid',
    // HubSpot
    'hsa_cam', 'hsa_grp', 'hsa_mt', 'hsa_src', 'hsa_ad', 'hsa_acc', 'hsa_net', 'hsa_ver', 'hsa_la', 'hsa_ol', 'hsa_kw',
    // Mailchimp
    'mc_cid', 'mc_eid',
    // Other common trackers
    '_ga', '_gl', '_hsenc', '_hsmi', '_openstat',
    'yclid', 'ymclid', 'twclid', 'ttclid', 'li_fat_id', 'igshid',
    'ref', 'referrer', 'source',
]);

export const stripTrackingParams = (url: string): string => {
    try {
        const parsed = new URL(url.trim());
        const params = new URLSearchParams(parsed.search);

        for (const key of [...params.keys()]) {
            if (TRACKING_PARAMS.has(key)) {
                params.delete(key);
            }
        }

        parsed.search = params.toString();
        parsed.hash = '';
        return parsed.toString().replace(/\/$/, '');
    } catch {
        return url.trim();
    }
};
