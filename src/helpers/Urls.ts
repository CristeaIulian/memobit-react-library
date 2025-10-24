export const extractDomainFromUrl = (url: string): string => {
    const urlParts = new URL(url);
    return urlParts.host;
};
