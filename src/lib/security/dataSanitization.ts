/**
 * Data Sanitization Utilities
 * 
 * Masks and sanitizes sensitive data for display and logging
 */

/**
 * Mask CPF (Brazilian tax ID) for display
 * Example: 123.456.789-00 -> ***.456.***-**
 */
export function maskCPF(cpf: string): string {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return '***.***.***-**';

    return `***.${cleaned.substring(3, 6)}.***-**`;
}

/**
 * Mask RG (Brazilian ID) for display
 */
export function maskRG(rg: string): string {
    if (!rg) return '';
    const cleaned = rg.replace(/\D/g, '');
    if (cleaned.length < 4) return '****';

    return `${cleaned.substring(0, 2)}${'*'.repeat(cleaned.length - 4)}${cleaned.slice(-2)}`;
}

/**
 * Mask name - show only first and last name with initials
 * Example: "Maria Clara Santos Silva" -> "Maria C. S. Silva"
 */
export function maskName(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length <= 2) return name;

    const first = parts[0];
    const last = parts[parts.length - 1];
    const middle = parts.slice(1, -1).map(p => `${p[0]}.`).join(' ');

    return `${first} ${middle} ${last}`;
}

/**
 * Mask email for display
 * Example: usuario@email.com -> u***o@e***l.com
 */
export function maskEmail(email: string): string {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (!local || !domain) return '***@***.***';

    const maskedLocal = local.length <= 2
        ? '*'.repeat(local.length)
        : `${local[0]}${'*'.repeat(Math.max(local.length - 2, 1))}${local[local.length - 1]}`;

    const [domainName, tld] = domain.split('.');
    const maskedDomain = domainName.length <= 2
        ? '*'.repeat(domainName.length)
        : `${domainName[0]}${'*'.repeat(Math.max(domainName.length - 2, 1))}${domainName[domainName.length - 1]}`;

    return `${maskedLocal}@${maskedDomain}.${tld}`;
}

/**
 * Mask phone number
 * Example: (11) 98765-4321 -> (11) ****-4321
 */
export function maskPhone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return `(${cleaned.substring(0, 2)}) ****-${cleaned.slice(-4)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 2)}) ***-${cleaned.slice(-4)}`;
    }

    return '(**) ****-****';
}

/**
 * Mask address - show only neighborhood and city
 */
export function maskAddress(address: string): string {
    if (!address) return '';
    // Try to extract city/neighborhood from common formats
    const parts = address.split(',').map(p => p.trim());
    if (parts.length >= 2) {
        return `***, ${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
    }
    return '***';
}

/**
 * Sanitize object by masking sensitive fields
 */
export function sanitizeForLogging<T extends Record<string, unknown>>(
    data: T,
    sensitiveFields: string[] = ['cpf', 'rg', 'email', 'phone', 'address', 'password']
): T {
    const result = { ...data };

    for (const field of sensitiveFields) {
        if (field in result && typeof result[field] === 'string') {
            const value = result[field] as string;

            if (field === 'cpf') {
                (result as Record<string, unknown>)[field] = maskCPF(value);
            } else if (field === 'rg') {
                (result as Record<string, unknown>)[field] = maskRG(value);
            } else if (field === 'email') {
                (result as Record<string, unknown>)[field] = maskEmail(value);
            } else if (field === 'phone') {
                (result as Record<string, unknown>)[field] = maskPhone(value);
            } else if (field === 'address') {
                (result as Record<string, unknown>)[field] = maskAddress(value);
            } else if (field === 'password') {
                (result as Record<string, unknown>)[field] = '[REDACTED]';
            } else {
                (result as Record<string, unknown>)[field] = '***';
            }
        }
    }

    return result;
}

/**
 * Remove sensitive fields completely (for external APIs)
 */
export function removeSensitiveFields<T extends Record<string, unknown>>(
    data: T,
    fieldsToRemove: string[] = ['cpf', 'rg', 'password', 'passwordHash']
): Partial<T> {
    const result = { ...data };

    for (const field of fieldsToRemove) {
        delete (result as Record<string, unknown>)[field];
    }

    return result;
}

/**
 * Deep sanitize nested objects
 */
export function deepSanitize<T>(
    data: T,
    sensitiveFields: string[] = ['cpf', 'rg', 'email', 'phone', 'address', 'password']
): T {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
        return data.map(item => deepSanitize(item, sensitiveFields)) as T;
    }

    if (typeof data === 'object') {
        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(data)) {
            if (sensitiveFields.includes(key) && typeof value === 'string') {
                result[key] = '***';
            } else if (typeof value === 'object') {
                result[key] = deepSanitize(value, sensitiveFields);
            } else {
                result[key] = value;
            }
        }

        return result as T;
    }

    return data;
}

/**
 * Validate CPF (Brazilian tax ID)
 */
export function validateCPF(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11) return false;

    // Check for known invalid patterns
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned[i]) * (10 - i);
    }
    let digit1 = (sum * 10) % 11;
    if (digit1 === 10) digit1 = 0;

    if (digit1 !== parseInt(cleaned[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned[i]) * (11 - i);
    }
    let digit2 = (sum * 10) % 11;
    if (digit2 === 10) digit2 = 0;

    return digit2 === parseInt(cleaned[10]);
}

/**
 * Format CPF for display
 */
export function formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;

    return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
}
