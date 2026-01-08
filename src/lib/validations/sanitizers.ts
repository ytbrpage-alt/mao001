// src/lib/validations/sanitizers.ts
// Input sanitization functions to prevent XSS and injection attacks

/**
 * Sanitize a string by removing dangerous characters
 */
export function sanitizeString(input: string): string {
    if (!input) return '';

    return input
        .trim()
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove script and event handlers
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        // Remove null bytes
        .replace(/\0/g, '')
        // Normalize whitespace
        .replace(/\s+/g, ' ');
}

/**
 * Sanitize HTML - for rich text fields (use with caution)
 */
export function sanitizeHTML(html: string): string {
    if (!html) return '';

    // Basic sanitization - for production use DOMPurify
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '');
}

/**
 * Format CPF: 12345678901 -> 123.456.789-01
 */
export function formatCPF(cpf: string): string {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return cpf;
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Format phone: 11999998888 -> (11) 99999-8888
 */
export function formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (digits.length === 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
}

/**
 * Format CEP: 01234567 -> 01234-567
 */
export function formatCEP(cep: string): string {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return cep;
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Normalize email
 */
export function normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
}

/**
 * Normalize name (capitalize words)
 */
export function normalizeName(name: string): string {
    return sanitizeString(name)
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
}

/**
 * Extract digits only
 */
export function extractDigits(input: string): string {
    return input.replace(/\D/g, '');
}
