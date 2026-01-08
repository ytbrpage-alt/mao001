// src/lib/audit/dataVersioning.ts
// Data versioning for audit trail

import { openDatabase } from '@/lib/storage/indexedDB';

export interface DataVersion<T = unknown> {
    id: string;
    resourceType: string;
    resourceId: string;
    version: number;
    data: T;
    changedBy: string;
    changedAt: string;
    changeReason?: string;
    diff?: Record<string, { old: unknown; new: unknown }>;
}

// Ensure version store exists
async function ensureVersionStore(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('maos-amigas-versions', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains('versions')) {
                const store = db.createObjectStore('versions', { keyPath: 'id' });
                store.createIndex('resourceType', 'resourceType', { unique: false });
                store.createIndex('resourceId', 'resourceId', { unique: false });
                store.createIndex('version', 'version', { unique: false });
                store.createIndex('changedAt', 'changedAt', { unique: false });
            }
        };
    });
}

/**
 * Generate unique ID
 */
function generateId(): string {
    return `ver-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Calculate diff between two objects
 */
export function calculateDiff(
    oldData: Record<string, unknown>,
    newData: Record<string, unknown>
): Record<string, { old: unknown; new: unknown }> {
    const diff: Record<string, { old: unknown; new: unknown }> = {};

    // Find changed and new keys
    for (const key of Object.keys(newData)) {
        const oldVal = oldData[key];
        const newVal = newData[key];

        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
            diff[key] = { old: oldVal, new: newVal };
        }
    }

    // Find deleted keys
    for (const key of Object.keys(oldData)) {
        if (!(key in newData)) {
            diff[key] = { old: oldData[key], new: undefined };
        }
    }

    return diff;
}

/**
 * Save a new version of data
 */
export async function saveVersion<T>(
    resourceType: string,
    resourceId: string,
    data: T,
    changedBy: string,
    changeReason?: string,
    previousData?: T
): Promise<DataVersion<T>> {
    const db = await ensureVersionStore();
    const transaction = db.transaction('versions', 'readwrite');
    const store = transaction.objectStore('versions');

    // Get current version number
    const currentVersion = await getLatestVersion(resourceType, resourceId);
    const version = currentVersion ? currentVersion.version + 1 : 1;

    // Calculate diff if previous data provided
    const diff = previousData
        ? calculateDiff(previousData as Record<string, unknown>, data as Record<string, unknown>)
        : undefined;

    const versionEntry: DataVersion<T> = {
        id: generateId(),
        resourceType,
        resourceId,
        version,
        data,
        changedBy,
        changedAt: new Date().toISOString(),
        changeReason,
        diff,
    };

    await new Promise<void>((resolve, reject) => {
        const request = store.add(versionEntry);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });

    console.log('[DataVersioning] Saved version', version, 'for', resourceType, resourceId);
    return versionEntry;
}

/**
 * Get all versions for a resource
 */
export async function getVersionHistory<T>(
    resourceType: string,
    resourceId: string
): Promise<DataVersion<T>[]> {
    const db = await ensureVersionStore();
    const transaction = db.transaction('versions', 'readonly');
    const store = transaction.objectStore('versions');

    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            const versions = (request.result as DataVersion<T>[])
                .filter(
                    (v) => v.resourceType === resourceType && v.resourceId === resourceId
                )
                .sort((a, b) => b.version - a.version);

            resolve(versions);
        };

        request.onerror = () => reject(request.error);
    });
}

/**
 * Get a specific version
 */
export async function getVersion<T>(
    resourceType: string,
    resourceId: string,
    version: number
): Promise<DataVersion<T> | null> {
    const versions = await getVersionHistory<T>(resourceType, resourceId);
    return versions.find((v) => v.version === version) || null;
}

/**
 * Get latest version
 */
export async function getLatestVersion<T>(
    resourceType: string,
    resourceId: string
): Promise<DataVersion<T> | null> {
    const versions = await getVersionHistory<T>(resourceType, resourceId);
    return versions[0] || null;
}

/**
 * Restore a previous version
 */
export async function restoreVersion<T>(
    resourceType: string,
    resourceId: string,
    versionToRestore: number,
    restoredBy: string
): Promise<DataVersion<T>> {
    const versionData = await getVersion<T>(resourceType, resourceId, versionToRestore);
    if (!versionData) {
        throw new Error(`Version ${versionToRestore} not found`);
    }

    // Save as new version with restoration note
    return saveVersion(
        resourceType,
        resourceId,
        versionData.data,
        restoredBy,
        `Restored from version ${versionToRestore}`
    );
}

/**
 * Compare two versions
 */
export async function compareVersions<T>(
    resourceType: string,
    resourceId: string,
    version1: number,
    version2: number
): Promise<Record<string, { old: unknown; new: unknown }>> {
    const v1 = await getVersion<T>(resourceType, resourceId, version1);
    const v2 = await getVersion<T>(resourceType, resourceId, version2);

    if (!v1 || !v2) {
        throw new Error('One or both versions not found');
    }

    return calculateDiff(
        v1.data as Record<string, unknown>,
        v2.data as Record<string, unknown>
    );
}
