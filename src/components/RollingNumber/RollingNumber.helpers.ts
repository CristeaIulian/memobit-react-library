// Number readouts in other components render the value as given, so the roll keeps its exact
// decimals and leaves out the thousands grouping RollingNumber adds by default.
export const countDecimals = (value: number): number => {
    const [, fraction = ''] = String(value).split('.');

    return /^\d+$/.test(fraction) ? fraction.length : 0;
};
