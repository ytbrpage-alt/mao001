// src/lib/audit/auditLogger.ts
// Audit logging system for LGPD compliance

import { openDatabase } from '@/lib/storage/indexedDB';

export type AuditAction =
    | 'CREATE'
    | 'READ'
    | 'UPDATE'
    | 'DELETE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'EXPORT'
    | 'CONSENT_ACCEPT'
    | 'CONSENT_REVOKE'
    | 'DATA_ACCESS_REQUEST'
    | 'DATA_DELETION_REQUEST';

export type AuditResource =
    | 'evaluation'
    | 'patient'
    | 'user'
    | 'contract'
    | 'consent'
    | 'session';

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    userEmail: string;
    action: AuditAction;
    resource: AuditResource;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, unknown>;
    previousValue?: unknown;
    newValue?: unknown;
    success: boolean;
    errorMessage?: string;
}

export interface AuditLogFilter {
    userId?: string;
    action?: AuditAction;
    resource?: AuditResource;
    resourceId?: string;
    startDate?: Date;
    endDate?: Date;
    success?: boolean;
}

// Ensure audit store exists
async function ensureAuditStore(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('maos-amigas-audit', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains('auditLogs')) {
                const store = db.createObjectStore('auditLogs', { keyPath: 'id' });
                store.createIndex('timestamp', 'timestamp', { unique: false });
                store.createIndex('userId', 'userId', { unique: false });
                store.createIndex('action', 'action', { unique: false });
                store.createIndex('resource', 'resource', { unique: false });
                store.createIndex('resourceId', 'resourceId', { unique: false });
            }
        };
    });
}

/**
 * Generate unique ID for log entry
 */
function generateId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Get client IP address (best effort)
 */
async function getClientIP(): Promise<string | undefined> {
    try {
        // In production, this would come from the server
        // For client-side, we can try a public API
        const response = await fetch('https://api.ipify.org?format=json', {
            signal: AbortSignal.timeout(2000),
        });
        const data = await response.json();
        return data.ip;
    } catch {
        return undefined;
    }
}

/**
 * Log an audit event
 */
export async function logAudit(
    entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>
): Promise<void> {
    try {
        const db = await ensureAuditStore();
        const transaction = db.transaction('auditLogs', 'readwrite');
        const store = transaction.objectStore('auditLogs');

        const fullEntry: AuditLogEntry = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            ipAddress: await getClientIP().catch(() => undefined),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            ...entry,
        };

        await new Promise<void>((resolve, reject) => {
            const request = store.add(fullEntry);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        console.log('[AuditLogger] Logged:', fullEntry.action, fullEntry.resource, fullEntry.resourceId);
    } catch (error) {
        console.error('[AuditLogger] Failed to log:', error);
        // Don't throw - audit logging should not break the app
    }
}

/**
 * Get audit logs with optional filtering
 */
export async function getAuditLogs(filter?: AuditLogFilter): Promise<AuditLogEntry[]> {
    const db = await ensureAuditStore();
    const transaction = db.transaction('auditLogs', 'readonly');
    const store = transaction.objectStore('auditLogs');

    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            let logs = request.result as AuditLogEntry[];

            // Apply filters
            if (filter) {
                if (filter.userId) {
                    logs = logs.filter((log) => log.userId === filter.userId);
                }
                if (filter.action) {
                    logs = logs.filter((log) => log.action === filter.action);
                }
                if (filter.resource) {
                    logs = logs.filter((log) => log.resource === filter.resource);
                }
                if (filter.resourceId) {
                    logs = logs.filter((log) => log.resourceId === filter.resourceId);
                }
                if (filter.startDate) {
                    logs = logs.filter((log) => new Date(log.timestamp) >= filter.startDate!);
                }
                if (filter.endDate) {
                    logs = logs.filter((log) => new Date(log.timestamp) <= filter.endDate!);
                }
                if (filter.success !== undefined) {
                    logs = logs.filter((log) => log.success === filter.success);
                }
            }

            // Sort by timestamp descending
            logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            resolve(logs);
        };

        request.onerror = () => reject(request.error);
    });
}

/**
 * Get audit logs for a specific resource (for history view)
 */
export async function getResourceHistory(
    resource: AuditResource,
    resourceId: string
): Promise<AuditLogEntry[]> {
    return getAuditLogs({ resource, resourceId });
}

/**
 * Get user activity logs
 */
export async function getUserActivity(userId: string): Promise<AuditLogEntry[]> {
    return getAuditLogs({ userId });
}

/**
 * Export audit logs as CSV
 */
export function exportLogsAsCSV(logs: AuditLogEntry[]): string {
    const headers = [
        'ID',
        'Data/Hora',
        'Usuário ID',
        'Email',
        'Ação',
        'Recurso',
        'Recurso ID',
        'IP',
        'Sucesso',
        'Detalhes',
    ];

    const rows = logs.map((log) => [
        log.id,
        log.timestamp,
        log.userId,
        log.userEmail,
        log.action,
        log.resource,
        log.resourceId || '',
        log.ipAddress || '',
        log.success ? 'Sim' : 'Não',
        log.details ? JSON.stringify(log.details) : '',
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return csvContent;
}

/**
 * Export audit logs as JSON
 */
export function exportLogsAsJSON(logs: AuditLogEntry[]): string {
    return JSON.stringify(logs, null, 2);
}

/**
 * Download logs as file
 */
export function downloadLogs(logs: AuditLogEntry[], format: 'csv' | 'json' = 'csv'): void {
    const content = format === 'csv' ? exportLogsAsCSV(logs) : exportLogsAsJSON(logs);
    const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
    const fileName = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Clear old audit logs (for maintenance - keep last N days)
 */
export async function clearOldLogs(daysToKeep: number = 365): Promise<number> {
    const db = await ensureAuditStore();
    const transaction = db.transaction('auditLogs', 'readwrite');
    const store = transaction.objectStore('auditLogs');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    let deletedCount = 0;

    return new Promise((resolve, reject) => {
        const request = store.openCursor();

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                const log = cursor.value as AuditLogEntry;
                if (new Date(log.timestamp) < cutoffDate) {
                    cursor.delete();
                    deletedCount++;
                }
                cursor.continue();
            } else {
                resolve(deletedCount);
            }
        };

        request.onerror = () => reject(request.error);
    });
}
