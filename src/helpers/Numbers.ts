export const format2Digits = (val: number | string): number => Number((typeof val === 'number' ? val : Number(val)).toFixed(2));

export const getPercent = (value: number, total: number): number => {
    if (value > total) {
        console.warn(`Could not get percent of value ${value} from a total ${total}. Total must be higher or at least equal to value.`);
    }

    if (value === total) {
        return value === 0 ? 0 : 100;
    }

    return value / (total / 100);
};


export const getPercentsOf2Numbers = (aInput: number, bInput: number): { a: number; b: number } => {
    const total = aInput + bInput;

    if (total === 0) {
        return { a: 0, b: 0 };
    }

    return {
        a: Math.round((aInput / total) * 100 * 10) / 10,
        b: Math.round((bInput / total) * 100 * 10) / 10,
    };
};
