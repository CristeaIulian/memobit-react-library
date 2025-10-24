export const slugify = (text: string): string =>
    text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

export const shortenText = (text: string, startChars: number = 20, endChars: number = 20, separator: string = '...'): string => {
    if (!text || text.length === 0) {
        return '';
    }

    const totalCharsNeeded = startChars + endChars + separator.length;

    if (text.length <= totalCharsNeeded) {
        return text;
    }

    const startPart = text.substring(0, startChars);
    const endPart = text.substring(text.length - endChars);

    return `${startPart}${separator}${endPart}`;
};

export const convertTextToHTMLIndentation = (text: string): { __html: string } => {
    return {
        // don't .replace(/ /g, '&nbsp;') because it will do this with spaces between words as well
        __html: text.replace(/\n/g, '<br />').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;'),
    };
};
