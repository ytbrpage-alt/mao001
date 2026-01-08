/**
 * Password Security Utilities
 * 
 * Secure password hashing and validation
 */

import { hash, compare } from 'bcryptjs';
import crypto from 'crypto';

// Password hashing configuration
const SALT_ROUNDS = 12; // High enough for security, reasonable for performance

// Password validation rules
const PASSWORD_RULES = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
};

export interface PasswordValidationResult {
    valid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong' | 'very_strong';
}

/**
 * Validate password against security rules
 */
export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];

    if (password.length < PASSWORD_RULES.minLength) {
        errors.push(`Senha deve ter no mínimo ${PASSWORD_RULES.minLength} caracteres`);
    }

    if (password.length > PASSWORD_RULES.maxLength) {
        errors.push(`Senha deve ter no máximo ${PASSWORD_RULES.maxLength} caracteres`);
    }

    if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra minúscula');
    }

    if (PASSWORD_RULES.requireNumber && !/\d/.test(password)) {
        errors.push('Senha deve conter pelo menos um número');
    }

    if (PASSWORD_RULES.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Senha deve conter pelo menos um caractere especial');
    }

    // Check for common weak passwords
    const commonWeakPasswords = [
        'password', '12345678', 'qwerty123', 'abc12345',
        'password1', 'senha123', 'teste123', 'admin123',
    ];
    if (commonWeakPasswords.some(weak =>
        password.toLowerCase().includes(weak)
    )) {
        errors.push('Senha muito comum, escolha outra');
    }

    // Calculate strength
    let strength: PasswordValidationResult['strength'] = 'weak';
    let score = 0;

    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    if (/[^A-Za-z0-9!@#$%^&*(),.?":{}|<>]/.test(password)) score++; // Unicode chars

    if (score >= 5) strength = 'very_strong';
    else if (score >= 4) strength = 'strong';
    else if (score >= 2) strength = 'medium';

    return {
        valid: errors.length === 0,
        errors,
        strength,
    };
}

/**
 * Hash password securely with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const validation = validatePassword(password);
    if (!validation.valid) {
        throw new Error(validation.errors[0]);
    }

    return hash(password, SALT_ROUNDS);
}

/**
 * Verify password against hash (constant-time by bcrypt design)
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return compare(password, hashedPassword);
}

/**
 * Generate secure random password
 */
export function generateSecurePassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*(),.?';
    const allChars = uppercase + lowercase + numbers + special;

    let password = '';

    // Ensure at least one of each required type
    password += uppercase[crypto.randomInt(uppercase.length)];
    password += lowercase[crypto.randomInt(lowercase.length)];
    password += numbers[crypto.randomInt(numbers.length)];
    password += special[crypto.randomInt(special.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[crypto.randomInt(allChars.length)];
    }

    // Shuffle the password
    return password
        .split('')
        .sort(() => crypto.randomInt(3) - 1)
        .join('');
}

/**
 * Generate secure token for reset/verification
 */
export function generateSecureToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Hash token for storage (prevents timing attacks on lookup)
 */
export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}
