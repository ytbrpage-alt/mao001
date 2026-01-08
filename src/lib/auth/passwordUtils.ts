// src/lib/auth/passwordUtils.ts
// Password validation and hashing utilities

import bcrypt from 'bcryptjs';
import type { PasswordValidation } from '@/types/auth';

const SALT_ROUNDS = 12;

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 */
export function validatePassword(password: string): PasswordValidation {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Senha deve ter no mínimo 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Senha deve conter pelo menos um número');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Hash a password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length];
    }
    return result;
}
