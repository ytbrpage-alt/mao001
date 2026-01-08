// src/lib/storage/indexedDB.ts
// IndexedDB wrapper for offline storage

const DB_NAME = 'maos-amigas-db';
const DB_VERSION = 1;

export interface StoredEvaluation {
    id: string;
    data: unknown;
    updatedAt: string;
    syncStatus: 'synced' | 'pending' | 'conflict';
    version: number;
    serverVersion?: number;
}

export interface SyncQueueItem {
    id: string;
    evaluationId: string;
    action: 'create' | 'update' | 'delete';
    data: unknown;
    timestamp: string;
    retryCount: number;
}

let db: IDBDatabase | null = null;

/**
 * Open IndexedDB connection
 */
export async function openDatabase(): Promise<IDBDatabase> {
    if (db) return db;

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('[IndexedDB] Failed to open database:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            console.log('[IndexedDB] Database opened successfully');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;

            // Evaluations store
            if (!database.objectStoreNames.contains('evaluations')) {
                const evaluationsStore = database.createObjectStore('evaluations', { keyPath: 'id' });
                evaluationsStore.createIndex('syncStatus', 'syncStatus', { unique: false });
                evaluationsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
            }

            // Sync queue store
            if (!database.objectStoreNames.contains('syncQueue')) {
                const syncQueueStore = database.createObjectStore('syncQueue', { keyPath: 'id' });
                syncQueueStore.createIndex('evaluationId', 'evaluationId', { unique: false });
                syncQueueStore.createIndex('timestamp', 'timestamp', { unique: false });
            }

            // Metadata store (for sync timestamps, etc)
            if (!database.objectStoreNames.contains('metadata')) {
                database.createObjectStore('metadata', { keyPath: 'key' });
            }

            console.log('[IndexedDB] Database upgraded to version', DB_VERSION);
        };
    });
}

/**
 * Get a transaction for a store
 */
async function getTransaction(
    storeName: string,
    mode: IDBTransactionMode = 'readonly'
): Promise<IDBObjectStore> {
    const database = await openDatabase();
    const transaction = database.transaction(storeName, mode);
    return transaction.objectStore(storeName);
}

/**
 * Save an evaluation to IndexedDB
 */
export async function saveEvaluation(evaluation: StoredEvaluation): Promise<void> {
    const store = await getTransaction('evaluations', 'readwrite');

    return new Promise((resolve, reject) => {
        const request = store.put(evaluation);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get an evaluation by ID
 */
export async function getEvaluation(id: string): Promise<StoredEvaluation | null> {
    const store = await getTransaction('evaluations', 'readonly');

    return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get all evaluations
 */
export async function getAllEvaluations(): Promise<StoredEvaluation[]> {
    const store = await getTransaction('evaluations', 'readonly');

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get pending evaluations (not synced)
 */
export async function getPendingEvaluations(): Promise<StoredEvaluation[]> {
    const store = await getTransaction('evaluations', 'readonly');
    const index = store.index('syncStatus');

    return new Promise((resolve, reject) => {
        const request = index.getAll('pending');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Delete an evaluation
 */
export async function deleteEvaluation(id: string): Promise<void> {
    const store = await getTransaction('evaluations', 'readwrite');

    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add item to sync queue
 */
export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<string> {
    const store = await getTransaction('syncQueue', 'readwrite');
    const id = `sync-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return new Promise((resolve, reject) => {
        const request = store.add({ ...item, id });
        request.onsuccess = () => resolve(id);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get all items in sync queue
 */
export async function getSyncQueue(): Promise<SyncQueueItem[]> {
    const store = await getTransaction('syncQueue', 'readonly');

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Remove item from sync queue
 */
export async function removeFromSyncQueue(id: string): Promise<void> {
    const store = await getTransaction('syncQueue', 'readwrite');

    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Update sync queue item (e.g., increment retry count)
 */
export async function updateSyncQueueItem(item: SyncQueueItem): Promise<void> {
    const store = await getTransaction('syncQueue', 'readwrite');

    return new Promise((resolve, reject) => {
        const request = store.put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get metadata value
 */
export async function getMetadata<T = unknown>(key: string): Promise<T | null> {
    const store = await getTransaction('metadata', 'readonly');

    return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result?.value || null);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Set metadata value
 */
export async function setMetadata(key: string, value: unknown): Promise<void> {
    const store = await getTransaction('metadata', 'readwrite');

    return new Promise((resolve, reject) => {
        const request = store.put({ key, value });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Clear all data (for logout)
 */
export async function clearAllData(): Promise<void> {
    const database = await openDatabase();
    const storeNames = ['evaluations', 'syncQueue', 'metadata'];

    const transaction = database.transaction(storeNames, 'readwrite');

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);

        storeNames.forEach((storeName) => {
            transaction.objectStore(storeName).clear();
        });
    });
}
