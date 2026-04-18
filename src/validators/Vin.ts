const VALID_CHARS = /^[A-HJ-NPR-Z0-9]+$/;

const TRANSLITERATION: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5,
    P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};

const POSITION_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

const VALID_YEAR_CHARS = new Set('ABCDEFGHJKLMNPRSTVWXY123456789');

function charValue(ch: string): number {
    return /\d/.test(ch) ? parseInt(ch, 10) : (TRANSLITERATION[ch] ?? 0);
}

function checkDigit(vin: string): boolean {
    const sum = vin.split('').reduce((acc, ch, i) => acc + charValue(ch) * POSITION_WEIGHTS[i], 0);
    const remainder = sum % 11;
    const expected = remainder === 10 ? 'X' : String(remainder);
    return vin[8] === expected;
}

export interface VinValidationResult {
    valid: boolean;
    error?: string;
}

export function validateVin(vin: string): VinValidationResult {
    const v = vin.trim().toUpperCase();

    if (v.length !== 17) {
        return { valid: false, error: 'VIN must be exactly 17 characters' };
    }

    if (!VALID_CHARS.test(v)) {
        return { valid: false, error: 'VIN contains invalid characters (I, O and Q are not allowed)' };
    }

    if (!VALID_YEAR_CHARS.has(v[9])) {
        return { valid: false, error: 'VIN has an invalid model year character (position 10)' };
    }

    if (!checkDigit(v)) {
        return { valid: false, error: 'VIN checksum is invalid' };
    }

    return { valid: true };
}
