/**
 * Secure Storage with Encryption
 * 
 * Uses Web Crypto API for AES-GCM encryption of sensitive data
 * IndexedDB for storage with automatic key rotation and cleanup
 */

// Constants
const DB_NAME = 'maos-amigas-secure';
const DB_VERSION = 1;
const STORE_NAME = 'encrypted-data';
const KEY_STORE_NAME = 'encryption-keys';
const KEY_ROTATION_DAYS = 30;
const DATA_EXPIRY_DAYS = 90;
const BACKUP_BEFORE_DELETE = true;

// Types
interface EncryptedPayload {
    iv: string;
    data: string;
    keyId: string;
    timestamp: number;
}

interface StoredKey {
    id: string;
    key: CryptoKey;
    createdAt: number;
    expiresAt: number;
}

interface StorageRecord {
    id: string;
    payload: EncryptedPayload;
    createdAt: number;
    updatedAt: number;
    expiresAt: number;
}

interface BackupRecord {
    id: string;
    data: string;
    backedUpAt: number;
    reason: string;
}

/**
 * Check if Web Crypto API is available
 */
function isCryptoAvailable(): boolean {
    return typeof window !== 'undefined' &&
        window.crypto &&
        window.crypto.subtle !== undefined;
}

/**
 * Generate a new AES-GCM encryption key
 */
async function generateEncryptionKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true, // extractable (for key rotation backup)
        ['encrypt', 'decrypt']
    );
}

/**
 * Generate random IV for AES-GCM
 */
function generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(12)); // 96 bits for AES-GCM
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Convert base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer as ArrayBuffer;
}

/**
 * Encrypt data using AES-GCM
 */
async function encryptData(
    data: string,
    key: CryptoKey,
    keyId: string
): Promise<EncryptedPayload> {
    const iv = generateIV();
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        key,
        encodedData
    );

    return {
        iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
        data: arrayBufferToBase64(encryptedBuffer),
        keyId,
        timestamp: Date.now(),
    };
}

/**
 * Decrypt data using AES-GCM
 */
async function decryptData(
    payload: EncryptedPayload,
    key: CryptoKey
): Promise<string> {
    const iv = new Uint8Array(base64ToArrayBuffer(payload.iv));
    const encryptedData = base64ToArrayBuffer(payload.data);

    const decryptedBuffer = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        key,
        encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
}

/**
 * Open IndexedDB database
 */
function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Store for encrypted data
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('expiresAt', 'expiresAt', { unique: false });
                store.createIndex('updatedAt', 'updatedAt', { unique: false });
            }

            // Store for encryption keys
            if (!db.objectStoreNames.contains(KEY_STORE_NAME)) {
                const keyStore = db.createObjectStore(KEY_STORE_NAME, { keyPath: 'id' });
                keyStore.createIndex('expiresAt', 'expiresAt', { unique: false });
            }

            // Store for backups
            if (!db.objectStoreNames.contains('backups')) {
                const backupStore = db.createObjectStore('backups', { keyPath: 'id' });
                backupStore.createIndex('backedUpAt', 'backedUpAt', { unique: false });
            }
        };
    });
}

/**
 * SecureStorage class - main interface
 */
export class SecureStorage {
    private db: IDBDatabase | null = null;
    private currentKey: StoredKey | null = null;
    private initialized = false;

    /**
     * Initialize storage and key management
     */
    async initialize(): Promise<void> {
        if (this.initialized) return;

        if (!isCryptoAvailable()) {
            console.warn('[SecureStorage] Web Crypto API not available, falling back to less secure storage');
            this.initialized = true;
            return;
        }

        try {
            this.db = await openDatabase();
            await this.initializeEncryptionKey();
            await this.cleanupExpiredData();
            this.initialized = true;
        } catch (error) {
            console.error('[SecureStorage] Failed to initialize:', error);
            throw error;
        }
    }

    /**
     * Initialize or rotate encryption key
     */
    private async initializeEncryptionKey(): Promise<void> {
        if (!this.db) return;

        const transaction = this.db.transaction(KEY_STORE_NAME, 'readonly');
        const store = transaction.objectStore(KEY_STORE_NAME);

        // Get all keys and find the current valid one
        const keys: StoredKey[] = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        const now = Date.now();
        const validKey = keys.find(k => k.expiresAt > now);

        if (validKey) {
            this.currentKey = validKey;
        } else {
            // Generate new key
            await this.rotateKey();
        }
    }

    /**
     * Rotate encryption key
     */
    async rotateKey(): Promise<void> {
        if (!this.db) return;

        const newKey = await generateEncryptionKey();
        const keyId = crypto.randomUUID();
        const now = Date.now();

        const storedKey: StoredKey = {
            id: keyId,
            key: newKey,
            createdAt: now,
            expiresAt: now + (KEY_ROTATION_DAYS * 24 * 60 * 60 * 1000),
        };

        // Export key for storage (IndexedDB can store CryptoKey directly)
        const transaction = this.db.transaction(KEY_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(KEY_STORE_NAME);

        await new Promise<void>((resolve, reject) => {
            const request = store.put(storedKey);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        this.currentKey = storedKey;
        console.log('[SecureStorage] Key rotated successfully');
    }

    /**
     * Store data securely
     */
    async setItem(key: string, value: unknown): Promise<void> {
        await this.initialize();

        if (!this.db || !this.currentKey) {
            // Fallback to localStorage without encryption (development only)
            if (process.env.NODE_ENV === 'development') {
                localStorage.setItem(key, JSON.stringify(value));
                return;
            }
            throw new Error('Secure storage not initialized');
        }

        const jsonData = JSON.stringify(value);
        const encrypted = await encryptData(jsonData, this.currentKey.key, this.currentKey.id);

        const now = Date.now();
        const record: StorageRecord = {
            id: key,
            payload: encrypted,
            createdAt: now,
            updatedAt: now,
            expiresAt: now + (DATA_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
        };

        const transaction = this.db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        await new Promise<void>((resolve, reject) => {
            const request = store.put(record);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Retrieve data securely
     */
    async getItem<T>(key: string): Promise<T | null> {
        await this.initialize();

        if (!this.db) {
            // Fallback
            if (process.env.NODE_ENV === 'development') {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            }
            return null;
        }

        const transaction = this.db.transaction([STORE_NAME, KEY_STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        const record: StorageRecord | undefined = await new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        if (!record) return null;

        // Check expiration
        if (record.expiresAt < Date.now()) {
            await this.removeItem(key);
            return null;
        }

        // Get the encryption key used
        const keyStore = transaction.objectStore(KEY_STORE_NAME);
        const storedKey: StoredKey | undefined = await new Promise((resolve, reject) => {
            const request = keyStore.get(record.payload.keyId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        if (!storedKey) {
            console.error('[SecureStorage] Encryption key not found for data');
            return null;
        }

        try {
            const decrypted = await decryptData(record.payload, storedKey.key);
            return JSON.parse(decrypted) as T;
        } catch (error) {
            console.error('[SecureStorage] Decryption failed:', error);
            return null;
        }
    }

    /**
     * Remove item with optional backup
     */
    async removeItem(key: string, backup = BACKUP_BEFORE_DELETE): Promise<void> {
        if (!this.db) return;

        if (backup) {
            const data = await this.getItem(key);
            if (data) {
                await this.createBackup(key, data, 'manual_delete');
            }
        }

        const transaction = this.db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        await new Promise<void>((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Create backup before deletion
     */
    private async createBackup(key: string, data: unknown, reason: string): Promise<void> {
        if (!this.db) return;

        const backup: BackupRecord = {
            id: `${key}_${Date.now()}`,
            data: JSON.stringify(data),
            backedUpAt: Date.now(),
            reason,
        };

        const transaction = this.db.transaction('backups', 'readwrite');
        const store = transaction.objectStore('backups');

        await new Promise<void>((resolve, reject) => {
            const request = store.put(backup);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Cleanup expired data and old keys
     */
    async cleanupExpiredData(): Promise<void> {
        if (!this.db) return;

        const now = Date.now();

        // Cleanup expired data
        const dataTransaction = this.db.transaction(STORE_NAME, 'readwrite');
        const dataStore = dataTransaction.objectStore(STORE_NAME);
        const expiresIndex = dataStore.index('expiresAt');

        const expiredRange = IDBKeyRange.upperBound(now);
        const expiredCursor = expiresIndex.openCursor(expiredRange);

        await new Promise<void>((resolve, reject) => {
            expiredCursor.onsuccess = async (event) => {
                const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                if (cursor) {
                    const record = cursor.value as StorageRecord;

                    // Backup before delete
                    if (BACKUP_BEFORE_DELETE) {
                        try {
                            const data = await this.getItem(record.id);
                            if (data) {
                                await this.createBackup(record.id, data, 'auto_expiry');
                            }
                        } catch (e) {
                            // Ignore backup errors
                        }
                    }

                    cursor.delete();
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            expiredCursor.onerror = () => reject(expiredCursor.error);
        });

        // Cleanup old keys (keep at least 2 for data that hasn't been re-encrypted)
        const keyTransaction = this.db.transaction(KEY_STORE_NAME, 'readwrite');
        const keyStore = keyTransaction.objectStore(KEY_STORE_NAME);

        const allKeys: StoredKey[] = await new Promise((resolve, reject) => {
            const request = keyStore.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        // Sort by creation date delete oldest beyond 3
        const sortedKeys = allKeys.sort((a, b) => b.createdAt - a.createdAt);
        const keysToDelete = sortedKeys.slice(3);

        for (const key of keysToDelete) {
            await new Promise<void>((resolve, reject) => {
                const request = keyStore.delete(key.id);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }

        console.log('[SecureStorage] Cleanup completed');
    }

    /**
     * Export all data (for migration/backup)
     */
    async exportAll(): Promise<Record<string, unknown>> {
        if (!this.db) return {};

        const transaction = this.db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        const allRecords: StorageRecord[] = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        const result: Record<string, unknown> = {};

        for (const record of allRecords) {
            try {
                const data = await this.getItem(record.id);
                if (data) {
                    result[record.id] = data;
                }
            } catch (e) {
                console.warn(`[SecureStorage] Failed to export ${record.id}`);
            }
        }

        return result;
    }

    /**
     * Clear all data (with backup option)
     */
    async clear(backup = true): Promise<void> {
        if (backup) {
            const allData = await this.exportAll();
            await this.createBackup('full_export', allData, 'clear_all');
        }

        if (!this.db) {
            localStorage.clear();
            return;
        }

        const transaction = this.db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        await new Promise<void>((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get storage statistics
     */
    async getStats(): Promise<{
        itemCount: number;
        oldestItem: number | null;
        newestItem: number | null;
        keyCount: number;
        currentKeyAge: number | null;
    }> {
        if (!this.db) {
            return {
                itemCount: 0,
                oldestItem: null,
                newestItem: null,
                keyCount: 0,
                currentKeyAge: null,
            };
        }

        const dataTransaction = this.db.transaction([STORE_NAME, KEY_STORE_NAME], 'readonly');
        const dataStore = dataTransaction.objectStore(STORE_NAME);
        const keyStore = dataTransaction.objectStore(KEY_STORE_NAME);

        const allRecords: StorageRecord[] = await new Promise((resolve, reject) => {
            const request = dataStore.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        const allKeys: StoredKey[] = await new Promise((resolve, reject) => {
            const request = keyStore.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        const timestamps = allRecords.map(r => r.createdAt);

        return {
            itemCount: allRecords.length,
            oldestItem: timestamps.length > 0 ? Math.min(...timestamps) : null,
            newestItem: timestamps.length > 0 ? Math.max(...timestamps) : null,
            keyCount: allKeys.length,
            currentKeyAge: this.currentKey
                ? Date.now() - this.currentKey.createdAt
                : null,
        };
    }
}

// Singleton instance
export const secureStorage = new SecureStorage();

// Zustand storage adapter
export function createSecureStorage() {
    return {
        getItem: async (name: string): Promise<string | null> => {
            const data = await secureStorage.getItem<unknown>(name);
            return data ? JSON.stringify(data) : null;
        },
        setItem: async (name: string, value: string): Promise<void> => {
            const parsed = JSON.parse(value);
            await secureStorage.setItem(name, parsed);
        },
        removeItem: async (name: string): Promise<void> => {
            await secureStorage.removeItem(name);
        },
    };
}
