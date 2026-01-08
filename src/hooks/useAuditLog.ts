// src/hooks/useAuditLog.ts
// Hook for audit logging and viewing logs

'use client';

import { useState, useCallback, useEffect } from 'react';
import {
    logAudit,
    getAuditLogs,
    getResourceHistory,
    downloadLogs,
    type AuditLogEntry,
    type AuditLogFilter,
    type AuditAction,
    type AuditResource,
} from '@/lib/audit';
import { useAuth } from '@/hooks/useAuth';

interface UseAuditLogReturn {
    logs: AuditLogEntry[];
    isLoading: boolean;
    error: Error | null;
    log: (
        action: AuditAction,
        resource: AuditResource,
        resourceId?: string,
        details?: Record<string, unknown>
    ) => Promise<void>;
    refresh: () => Promise<void>;
    filter: (filter: AuditLogFilter) => Promise<void>;
    exportCSV: () => void;
    exportJSON: () => void;
}

export function useAuditLog(initialFilter?: AuditLogFilter): UseAuditLogReturn {
    const { user } = useAuth();
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentFilter, setCurrentFilter] = useState<AuditLogFilter | undefined>(initialFilter);

    const fetchLogs = useCallback(async (filter?: AuditLogFilter) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAuditLogs(filter);
            setLogs(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch logs'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs(currentFilter);
    }, [fetchLogs, currentFilter]);

    const log = useCallback(
        async (
            action: AuditAction,
            resource: AuditResource,
            resourceId?: string,
            details?: Record<string, unknown>
        ) => {
            if (!user) {
                console.warn('[useAuditLog] No user context for logging');
                return;
            }

            await logAudit({
                userId: user.id,
                userEmail: user.email,
                action,
                resource,
                resourceId,
                details,
                success: true,
            });
        },
        [user]
    );

    const refresh = useCallback(async () => {
        await fetchLogs(currentFilter);
    }, [fetchLogs, currentFilter]);

    const filter = useCallback(async (newFilter: AuditLogFilter) => {
        setCurrentFilter(newFilter);
    }, []);

    const exportCSV = useCallback(() => {
        downloadLogs(logs, 'csv');
    }, [logs]);

    const exportJSON = useCallback(() => {
        downloadLogs(logs, 'json');
    }, [logs]);

    return {
        logs,
        isLoading,
        error,
        log,
        refresh,
        filter,
        exportCSV,
        exportJSON,
    };
}

/**
 * Hook for resource-specific audit history
 */
export function useResourceHistory(resource: AuditResource, resourceId: string) {
    const [history, setHistory] = useState<AuditLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const data = await getResourceHistory(resource, resourceId);
                setHistory(data);
            } catch (err) {
                console.error('Failed to fetch resource history:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [resource, resourceId]);

    return { history, isLoading };
}
