/** A number as it stands before a Romanian noun: "3", "19", "20 de", "101", "120 de" (the "de" appears from 20 up, except after 01–19). */
export const roNumberBeforeNoun = (count: number): string => {
    const lastTwoDigits = count % 100;
    return count === 0 || (lastTwoDigits >= 1 && lastTwoDigits <= 19) ? String(count) : `${count} de`;
};

/** A counted Romanian noun: "1 lună", "3 luni", "20 de luni". */
export const roCount = (count: number, one: string, many: string): string => (count === 1 ? `${count} ${one}` : `${roNumberBeforeNoun(count)} ${many}`);
