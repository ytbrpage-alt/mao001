// src/lib/crypto/sensitiveFields.ts
// Helper for encrypting/decrypting sensitive fields in evaluations

import { encryptField, decryptField } from './encryption';
import type { PatientData, HealthHistoryData } from '@/types';

// Define which fields are sensitive and need encryption
export const SENSITIVE_PATIENT_FIELDS: (keyof PatientData)[] = [
    'fullName',
    'cpf',
];

export const SENSITIVE_HEALTH_FIELDS: (keyof HealthHistoryData)[] = [
    'medicationAllergies',
    'foodAllergies',
    'otherAllergies',
];

/**
 * Encrypt sensitive patient fields
 */
export async function encryptPatientData(
    patient: PatientData,
    password: string
): Promise<PatientData> {
    const encrypted = { ...patient };

    for (const field of SENSITIVE_PATIENT_FIELDS) {
        const value = patient[field];
        if (value && typeof value === 'string') {
            (encrypted as Record<string, unknown>)[field] = await encryptField(value, password);
        }
    }

    return encrypted;
}

/**
 * Decrypt sensitive patient fields
 */
export async function decryptPatientData(
    patient: PatientData,
    password: string
): Promise<PatientData> {
    const decrypted = { ...patient };

    for (const field of SENSITIVE_PATIENT_FIELDS) {
        const value = patient[field];
        if (value && typeof value === 'string') {
            try {
                (decrypted as Record<string, unknown>)[field] = await decryptField(value, password);
            } catch {
                // Value might not be encrypted (migration case)
                (decrypted as Record<string, unknown>)[field] = value;
            }
        }
    }

    return decrypted;
}

/**
 * Encrypt sensitive health history fields
 */
export async function encryptHealthData(
    health: HealthHistoryData,
    password: string
): Promise<HealthHistoryData> {
    const encrypted = { ...health };

    for (const field of SENSITIVE_HEALTH_FIELDS) {
        const value = health[field];
        if (value && typeof value === 'string') {
            (encrypted as Record<string, unknown>)[field] = await encryptField(value, password);
        }
    }

    return encrypted;
}

/**
 * Decrypt sensitive health history fields
 */
export async function decryptHealthData(
    health: HealthHistoryData,
    password: string
): Promise<HealthHistoryData> {
    const decrypted = { ...health };

    for (const field of SENSITIVE_HEALTH_FIELDS) {
        const value = health[field];
        if (value && typeof value === 'string') {
            try {
                (decrypted as Record<string, unknown>)[field] = await decryptField(value, password);
            } catch {
                // Value might not be encrypted
                (decrypted as Record<string, unknown>)[field] = value;
            }
        }
    }

    return decrypted;
}

/**
 * Check if a string looks like encrypted data
 */
export function isEncrypted(value: string): boolean {
    if (!value) return false;
    try {
        const parsed = JSON.parse(value);
        return (
            typeof parsed === 'object' &&
            'ciphertext' in parsed &&
            'iv' in parsed &&
            'salt' in parsed
        );
    } catch {
        return false;
    }
}

/**
 * Mask sensitive data for display (e.g., CPF: ***.***.789-01)
 */
export function maskCPF(cpf: string): string {
    if (!cpf || cpf.length < 4) return '***';
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return '***';
    return `***.***.*${digits.slice(8, 9)}${digits.slice(9, 10)}-${digits.slice(10)}`;
}

/**
 * Mask name for display (e.g., J*** S***)
 */
export function maskName(name: string): string {
    if (!name) return '***';
    return name
        .split(' ')
        .map((word) => (word.length > 0 ? word[0] + '*'.repeat(Math.min(word.length - 1, 3)) : ''))
        .join(' ');
}
