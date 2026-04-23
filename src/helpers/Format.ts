export const formatMoney = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

export const formatBigNumber = (value: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value);

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** unitIndex;
    const fractionDigits = unitIndex === 0 ? 0 : decimals;

    return `${value.toFixed(fractionDigits)} ${units[unitIndex]}`;
};
