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
