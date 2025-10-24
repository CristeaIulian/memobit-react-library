export const formatMoney = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

export const formatBigNumber = (value: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value);
