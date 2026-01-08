import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { SyncOperation, SyncConflict, SyncResult, SyncConfig } from '@/types/sync';
import { apiClient } from '@/lib/sync/apiClient';
import { useAuthStore } from './authStore';
import { useEvaluationStore } from './evaluationStore';
import { useAuditStore } from './auditStore';
import type { Evaluation } from '@/types';

interface SyncStoreState {
    lastSyncAt: Date | null;
    isSyncing: boolean;
    pendingCount: number;
    conflictCount: number;
    errorCount: number;
    progress: number;
    config: SyncConfig;
    operationQueue: SyncOperation[];
    conflicts: SyncConflict[];

    updateConfig: (config: Partial<SyncConfig>) => void;
    queueOperation: (op: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>) => void;
    removeOperation: (id: string) => void;
    retryOperation: (id: string) => void;
    sync: () => Promise<SyncResult>;
    resolveConflict: (id: string, resolution: 'local' | 'remote' | 'merged', merged?: Record<string, unknown>) => Promise<void>;
    checkConnectivity: () => Promise<boolean>;
    getEntitySyncStatus: (entityId: string) => 'synced' | 'pending' | 'conflict';
}

export const useSyncStore = create<SyncStoreState>()(
    persist(
        (set, get) => ({
            lastSyncAt: null,
            isSyncing: false,
            pendingCount: 0,
            conflictCount: 0,
            errorCount: 0,
            progress: 0,
            config: {
                autoSync: true,
                syncIntervalMinutes: 5,
                syncOnReconnect: true,
                maxRetries: 3,
                compressData: true,
                syncAuditLogs: true,
            },
            operationQueue: [],
            conflicts: [],

            updateConfig: (newConfig) => {
                set((state) => ({ config: { ...state.config, ...newConfig } }));
            },

            queueOperation: (operation) => {
                const newOp: SyncOperation = {
                    ...operation,
                    id: uuidv4(),
                    timestamp: new Date(),
                    retryCount: 0,
                };
                set((state) => ({
                    operationQueue: [...state.operationQueue, newOp],
                    pendingCount: state.pendingCount + 1,
                }));
            },

            removeOperation: (id) => {
                set((state) => ({
                    operationQueue: state.operationQueue.filter((op) => op.id !== id),
                    pendingCount: Math.max(0, state.pendingCount - 1),
                }));
            },

            sync: async () => {
                const { isSyncing, config } = get();
                if (isSyncing) {
                    return { success: false, pushed: 0, pulled: 0, conflicts: [], errors: [{ entityId: '', error: 'Já sincronizando' }], duration: 0 };
                }

                const startTime = Date.now();
                set({ isSyncing: true, progress: 0 });

                try {
                    const isOnline = await get().checkConnectivity();
                    if (!isOnline) {
                        set({ isSyncing: false });
                        return { success: false, pushed: 0, pulled: 0, conflicts: [], errors: [{ entityId: '', error: 'Sem conexão' }], duration: Date.now() - startTime };
                    }

                    set({ progress: 20 });

                    const authStore = useAuthStore.getState();
                    const evaluationStore = useEvaluationStore.getState();
                    const token = authStore.session?.token;
                    if (!token) {
                        set({ isSyncing: false });
                        return { success: false, pushed: 0, pulled: 0, conflicts: [], errors: [{ entityId: '', error: 'Não autenticado' }], duration: Date.now() - startTime };
                    }

                    // Push pending operations
                    const { operationQueue } = get();
                    let pushedCount = 0;
                    for (const op of operationQueue) {
                        if (op.entityType === 'evaluation' && op.type === 'update') {
                            const result = await apiClient.updateEvaluation(token, op.entityId, op.data as Partial<Evaluation>);
                            if (result.success) {
                                get().removeOperation(op.id);
                                pushedCount++;
                            }
                        }
                    }

                    set({ progress: 60 });

                    // Pull from server
                    const { lastSyncAt } = get();
                    const pullResult = await apiClient.getEvaluations(token, lastSyncAt || undefined);
                    let pulledCount = 0;
                    if (pullResult.success && pullResult.data) {
                        for (const remote of pullResult.data) {
                            const local = evaluationStore.getEvaluationById(remote.id);
                            if (!local || new Date(remote.updatedAt) > new Date(local.updatedAt)) {
                                evaluationStore.updateEvaluation(remote.id, remote);
                                pulledCount++;
                            }
                        }
                    }

                    set({ progress: 90 });

                    // Sync audit logs
                    if (config.syncAuditLogs) {
                        const auditStore = useAuditStore.getState();
                        const unsynced = auditStore.getUnsyncedEntries();
                        if (unsynced.length > 0) {
                            const result = await apiClient.pushAuditLogs(token, unsynced);
                            if (result.success && result.data) {
                                auditStore.markAsSynced(result.data);
                            }
                        }
                    }

                    set({ isSyncing: false, progress: 100, lastSyncAt: new Date() });

                    return { success: true, pushed: pushedCount, pulled: pulledCount, conflicts: [], errors: [], duration: Date.now() - startTime };
                } catch (error) {
                    set({ isSyncing: false, progress: 0 });
                    return { success: false, pushed: 0, pulled: 0, conflicts: [], errors: [{ entityId: '', error: String(error) }], duration: Date.now() - startTime };
                }
            },

            resolveConflict: async (conflictId, resolution, mergedData) => {
                const conflict = get().conflicts.find((c) => c.id === conflictId);
                if (!conflict) return;

                const evaluationStore = useEvaluationStore.getState();
                let dataToSave: Record<string, unknown>;

                switch (resolution) {
                    case 'local': dataToSave = conflict.localData; break;
                    case 'remote': dataToSave = conflict.remoteData; break;
                    case 'merged': dataToSave = mergedData || { ...conflict.remoteData, ...conflict.localData }; break;
                }

                evaluationStore.updateEvaluation(conflict.entityId, dataToSave as Partial<Evaluation>);

                set((state) => ({
                    conflicts: state.conflicts.map((c) =>
                        c.id === conflictId ? { ...c, resolvedAt: new Date(), resolution } : c
                    ),
                    conflictCount: Math.max(0, state.conflictCount - 1),
                }));
            },

            checkConnectivity: async () => {
                if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
                return apiClient.healthCheck();
            },

            retryOperation: (id: string) => {
                set((state) => ({
                    operationQueue: state.operationQueue.map((op) =>
                        op.id === id
                            ? { ...op, retryCount: op.retryCount + 1, lastError: undefined }
                            : op
                    ),
                }));
            },

            getEntitySyncStatus: (entityId: string) => {
                const { operationQueue, conflicts } = get();
                const hasPending = operationQueue.some((op) => op.entityId === entityId);
                const hasConflict = conflicts.some((c) => c.entityId === entityId && !c.resolvedAt);
                if (hasConflict) return 'conflict' as const;
                if (hasPending) return 'pending' as const;
                return 'synced' as const;
            },
        }),
        {
            name: 'maos-amigas-sync',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                lastSyncAt: state.lastSyncAt,
                operationQueue: state.operationQueue,
                conflicts: state.conflicts,
                config: state.config,
            }),
        }
    )
);

// Hook para auto-sync
import { useEffect } from 'react';

export function useSyncManager() {
    const { config, sync, checkConnectivity, isSyncing, pendingCount } = useSyncStore();

    // Auto-sync baseado no intervalo
    useEffect(() => {
        if (!config.autoSync || config.syncIntervalMinutes <= 0) return;

        const interval = setInterval(
            () => {
                if (!isSyncing && pendingCount > 0) {
                    sync();
                }
            },
            config.syncIntervalMinutes * 60 * 1000
        );

        return () => clearInterval(interval);
    }, [config.autoSync, config.syncIntervalMinutes, isSyncing, pendingCount, sync]);

    // Sync ao reconectar
    useEffect(() => {
        if (!config.syncOnReconnect) return;

        const handleOnline = () => {
            if (pendingCount > 0) {
                sync();
            }
        };

        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [config.syncOnReconnect, pendingCount, sync]);

    return { sync, checkConnectivity, isSyncing };
}
