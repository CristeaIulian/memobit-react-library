// Subsequence fuzzy match: characters must appear in order in the text, with up to 1 mismatch
// per 4 characters. Short queries (< 4 chars) require all characters to match to avoid false positives.
// e.g. "pigd" matches "pigafetta" (3/4 = 75% ≥ threshold).
export const fuzzyMatch = (text: string, query: string): boolean => {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    if (textLower.includes(queryLower)) return true;

    const threshold = 1 - 1 / Math.max(queryLower.length, 4);
    let matched = 0;
    let ti = 0;

    for (let qi = 0; qi < queryLower.length; qi++) {
        while (ti < textLower.length && textLower[ti] !== queryLower[qi]) ti++;
        if (ti < textLower.length) {
            matched++;
            ti++;
        }
    }

    return matched / queryLower.length >= threshold;
};
