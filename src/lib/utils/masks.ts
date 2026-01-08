// src/lib/utils/masks.ts
// Input masks and formatters for Brazilian documents

/**
 * Apply mask to a string value
 */
export function applyMask(value: string, mask: string): string {
    let result = '';
    let valueIndex = 0;
    const cleanValue = value.replace(/\D/g, '');

    for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
        if (mask[i] === '9') {
            result += cleanValue[valueIndex];
            valueIndex++;
        } else {
            result += mask[i];
        }
    }

    return result;
}

/**
 * Remove mask from value, keeping only digits
 */
export function removeMask(value: string): string {
    return value.replace(/\D/g, '');
}

// Mask patterns
export const MASKS = {
    CPF: '999.999.999-99',
    RG: '99.999.999-9',
    PHONE: '(99) 99999-9999',
    PHONE_FIXED: '(99) 9999-9999',
    CEP: '99999-999',
    DATE: '99/99/9999',
    TIME: '99:99',
    CREDIT_CARD: '9999 9999 9999 9999',
    CNPJ: '99.999.999/9999-99',
};

/**
 * Format CPF: 000.000.000-00
 */
export function formatCPF(value: string): string {
    return applyMask(value, MASKS.CPF);
}

/**
 * Format Phone: (00) 00000-0000 or (00) 0000-0000
 */
export function formatPhone(value: string): string {
    const digits = removeMask(value);
    // If more than 10 digits, use mobile format
    return applyMask(value, digits.length > 10 ? MASKS.PHONE : MASKS.PHONE_FIXED);
}

/**
 * Format CEP: 00000-000
 */
export function formatCEP(value: string): string {
    return applyMask(value, MASKS.CEP);
}

/**
 * Format RG: 00.000.000-0
 */
export function formatRG(value: string): string {
    return applyMask(value, MASKS.RG);
}

/**
 * Validate CPF algorithmically
 */
export function validateCPF(cpf: string): boolean {
    const digits = removeMask(cpf);

    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false; // All same digits

    // First verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(digits[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits[9])) return false;

    // Second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(digits[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits[10])) return false;

    return true;
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): boolean {
    const digits = removeMask(phone);
    return digits.length >= 10 && digits.length <= 11;
}

/**
 * Validate CEP
 */
export function validateCEP(cep: string): boolean {
    const digits = removeMask(cep);
    return digits.length === 8;
}

/**
 * Validate name (at least 2 words, only letters)
 */
export function validateName(name: string): boolean {
    const trimmed = name.trim();
    const words = trimmed.split(/\s+/);
    if (words.length < 2) return false;
    // Each word should have at least 2 characters
    return words.every(word => word.length >= 2 && /^[a-zA-ZÀ-ÿ]+$/.test(word));
}

/**
 * Format name (capitalize each word)
 */
export function formatName(name: string): string {
    const particles = ['de', 'da', 'do', 'das', 'dos', 'e'];
    return name
        .toLowerCase()
        .split(/\s+/)
        .map((word, index) => {
            if (index > 0 && particles.includes(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}
