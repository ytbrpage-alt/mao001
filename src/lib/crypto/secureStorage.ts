// src/lib/crypto/secureStorage.ts
// Secure storage for sensitive data with encryption

import { encryptData, decryptData, generateHash, verifyIntegrity, type EncryptedData } from './encryption';
import { generateEncryptionPassword } from './deviceId';

interface StoredData {
    encrypted: EncryptedData;
    hash: string;
    timestamp: string;
    version: number;
}

const STORAGE_VERSION = 1;

/**
 * SecureStorage class for encrypted localStorage operations
 */
export class SecureStorage {
    private password: string;
    private prefix: string;

    constructor(password: string, prefix: string = 'secure') {
        this.password = password;
        this.prefix = prefix;
    }

    private getKey(key: string): string {
        return `${this.prefix}:${key}`;
    }

    /**
     * Store encrypted data
     */
    async setItem(key: string, value: unknown): Promise<void> {
        try {
            const plaintext = JSON.stringify(value);
            const encrypted = await encryptData(plaintext, this.password);
            const hash = await generateHash(plaintext);

            const storageData: StoredData = {
                encrypted,
                hash,
                timestamp: new Date().toISOString(),
                version: STORAGE_VERSION,
            };

            localStorage.setItem(this.getKey(key), JSON.stringify(storageData));
        } catch (error) {
            console.error('[SecureStorage] Failed to save:', error);
            throw new Error('Falha ao salvar dados seguros');
        }
    }

    /**
     * Retrieve and decrypt data
     */
    async getItem<T = unknown>(key: string): Promise<T | null> {
        try {
            const stored = localStorage.getItem(this.getKey(key));
            if (!stored) return null;

            const storageData: StoredData = JSON.parse(stored);

            // Decrypt the data
            const decrypted = await decryptData(
                storageData.encrypted,
                this.password
            );

            // Verify integrity
            const isValid = await verifyIntegrity(decrypted, storageData.hash);
            if (!isValid) {
                console.error('[SecureStorage] Data integrity check failed');
                this.removeItem(key);
                throw new Error('Dados corrompidos ou adulterados');
            }

            return JSON.parse(decrypted) as T;
        } catch (error) {
            console.error('[SecureStorage] Failed to retrieve:', error);
            return null;
        }
    }

    /**
     * Remove an item
     */
    removeItem(key: string): void {
        localStorage.removeItem(this.getKey(key));
    }

    /**
     * Clear all items with this prefix
     */
    clear(): void {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
            if (key.startsWith(`${this.prefix}:`)) {
                localStorage.removeItem(key);
            }
        });
    }

    /**
     * Check if an item exists
     */
    hasItem(key: string): boolean {
        return localStorage.getItem(this.getKey(key)) !== null;
    }

    /**
     * Get all keys with this prefix
     */
    getAllKeys(): string[] {
        const keys = Object.keys(localStorage);
        return keys
            .filter((key) => key.startsWith(`${this.prefix}:`))
            .map((key) => key.replace(`${this.prefix}:`, ''));
    }
}

// Singleton instance
let secureStorageInstance: SecureStorage | null = null;
let initializationPromise: Promise<SecureStorage> | null = null;

/**
 * Initialize secure storage with auto-generated password
 */
export async function initSecureStorage(userId?: string): Promise<SecureStorage> {
    if (secureStorageInstance) {
        return secureStorageInstance;
    }

    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = (async () => {
        const password = await generateEncryptionPassword(userId);
        secureStorageInstance = new SecureStorage(password, 'maos-amigas-secure');
        return secureStorageInstance;
    })();

    return initializationPromise;
}

/**
 * Get the initialized secure storage instance
 */
export function getSecureStorage(): SecureStorage {
    if (!secureStorageInstance) {
        throw new Error('SecureStorage não inicializado. Chame initSecureStorage() primeiro.');
    }
    return secureStorageInstance;
}

/**
 * Check if secure storage is initialized
 */
export function isSecureStorageInitialized(): boolean {
    return secureStorageInstance !== null;
}
