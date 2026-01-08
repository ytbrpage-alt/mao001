// src/lib/sync/syncService.ts
// Offline-first sync service with conflict resolution

import {
    saveEvaluation,
    getEvaluation,
    getAllEvaluations,
    getPendingEvaluations,
    addToSyncQueue,
    getSyncQueue,
    removeFromSyncQueue,
    updateSyncQueueItem,
    getMetadata,
    setMetadata,
    type StoredEvaluation,
    type SyncQueueItem,
} from '@/lib/storage/indexedDB';
import type { Evaluation } from '@/types';

const MAX_RETRY_COUNT = 3;
const SYNC_INTERVAL = 30000; // 30 seconds

type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

interface SyncState {
    status: SyncStatus;
    lastSyncAt: Date | null;
    pendingCount: number;
    error: string | null;
}

type SyncListener = (state: SyncState) => void;

class SyncService {
    private state: SyncState = {
        status: 'idle',
        lastSyncAt: null,
        pendingCount: 0,
        error: null,
    };
    private listeners: Set<SyncListener> = new Set();
    private syncInterval: NodeJS.Timeout | null = null;
    private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

    constructor() {
        if (typeof window !== 'undefined') {
            this.setupEventListeners();
            this.initialize();
        }
    }

    private setupEventListeners() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    private async initialize() {
        // Get last sync time
        const lastSync = await getMetadata<string>('lastSyncAt');
        if (lastSync) {
            this.state.lastSyncAt = new Date(lastSync);
        }

        // Count pending items
        const pending = await getPendingEvaluations();
        this.state.pendingCount = pending.length;

        // Start periodic sync
        this.startPeriodicSync();
    }

    private handleOnline() {
        console.log('[SyncService] Online - triggering sync');
        this.isOnline = true;
        this.setState({ status: 'idle' });
        this.sync();
    }

    private handleOffline() {
        console.log('[SyncService] Offline');
        this.isOnline = false;
        this.setState({ status: 'offline' });
    }

    private startPeriodicSync() {
        this.syncInterval = setInterval(() => {
            if (this.isOnline && this.state.status !== 'syncing') {
                this.sync();
            }
        }, SYNC_INTERVAL);
    }

    private setState(partial: Partial<SyncState>) {
        this.state = { ...this.state, ...partial };
        this.notifyListeners();
    }

    private notifyListeners() {
        this.listeners.forEach((listener) => listener(this.state));
    }

    /**
     * Subscribe to sync state changes
     */
    subscribe(listener: SyncListener): () => void {
        this.listeners.add(listener);
        listener(this.state);
        return () => this.listeners.delete(listener);
    }

    /**
     * Get current sync state
     */
    getState(): SyncState {
        return { ...this.state };
    }

    /**
     * Save evaluation locally and queue for sync
     */
    async saveLocal(evaluation: Evaluation): Promise<void> {
        const existing = await getEvaluation(evaluation.id);
        const version = existing ? existing.version + 1 : 1;

        const stored: StoredEvaluation = {
            id: evaluation.id,
            data: evaluation,
            updatedAt: new Date().toISOString(),
            syncStatus: 'pending',
            version,
            serverVersion: existing?.serverVersion,
        };

        await saveEvaluation(stored);

        // Add to sync queue
        await addToSyncQueue({
            evaluationId: evaluation.id,
            action: existing ? 'update' : 'create',
            data: evaluation,
            timestamp: new Date().toISOString(),
            retryCount: 0,
        });

        this.setState({ pendingCount: this.state.pendingCount + 1 });

        // Try immediate sync if online
        if (this.isOnline) {
            this.sync();
        }
    }

    /**
     * Delete evaluation locally and queue for sync
     */
    async deleteLocal(id: string): Promise<void> {
        const existing = await getEvaluation(id);
        if (!existing) return;

        // Mark as deleted in local store
        await saveEvaluation({
            ...existing,
            syncStatus: 'pending',
            version: existing.version + 1,
        });

        // Add delete action to queue
        await addToSyncQueue({
            evaluationId: id,
            action: 'delete',
            data: null,
            timestamp: new Date().toISOString(),
            retryCount: 0,
        });

        this.setState({ pendingCount: this.state.pendingCount + 1 });

        if (this.isOnline) {
            this.sync();
        }
    }

    /**
     * Sync all pending changes
     */
    async sync(): Promise<void> {
        if (!this.isOnline) {
            console.log('[SyncService] Offline - skipping sync');
            return;
        }

        if (this.state.status === 'syncing') {
            console.log('[SyncService] Already syncing');
            return;
        }

        this.setState({ status: 'syncing', error: null });

        try {
            const queue = await getSyncQueue();
            console.log(`[SyncService] Syncing ${queue.length} items`);

            for (const item of queue) {
                await this.processQueueItem(item);
            }

            // Pull latest from server
            await this.pullFromServer();

            // Update state
            const pending = await getPendingEvaluations();
            this.setState({
                status: 'idle',
                lastSyncAt: new Date(),
                pendingCount: pending.length,
            });

            await setMetadata('lastSyncAt', new Date().toISOString());
        } catch (error) {
            console.error('[SyncService] Sync error:', error);
            this.setState({
                status: 'error',
                error: error instanceof Error ? error.message : 'Sync failed',
            });
        }
    }

    private async processQueueItem(item: SyncQueueItem): Promise<void> {
        try {
            // Simulate API call
            // In production, replace with actual API calls
            const response = await this.sendToServer(item);

            if (response.success) {
                // Update local evaluation with server version
                const evaluation = await getEvaluation(item.evaluationId);
                if (evaluation && item.action !== 'delete') {
                    await saveEvaluation({
                        ...evaluation,
                        syncStatus: 'synced',
                        serverVersion: response.serverVersion,
                    });
                }

                // Remove from queue
                await removeFromSyncQueue(item.id);
                console.log(`[SyncService] Synced: ${item.evaluationId}`);
            } else if (response.conflict) {
                // Handle conflict
                await this.resolveConflict(item, response.serverData);
            }
        } catch (error) {
            console.error(`[SyncService] Failed to sync ${item.evaluationId}:`, error);

            // Increment retry count
            if (item.retryCount < MAX_RETRY_COUNT) {
                await updateSyncQueueItem({
                    ...item,
                    retryCount: item.retryCount + 1,
                });
            } else {
                console.error(`[SyncService] Max retries reached for ${item.evaluationId}`);
            }
        }
    }

    private async sendToServer(item: SyncQueueItem): Promise<{
        success: boolean;
        conflict?: boolean;
        serverVersion?: number;
        serverData?: unknown;
    }> {
        // TODO: Replace with actual API calls
        // For now, simulate successful sync
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Simulate 90% success, 10% conflict
        const isConflict = Math.random() < 0.1;

        if (isConflict) {
            return {
                success: false,
                conflict: true,
                serverData: { ...item.data, serverModified: true },
            };
        }

        return {
            success: true,
            serverVersion: Date.now(),
        };
    }

    private async resolveConflict(
        item: SyncQueueItem,
        serverData: unknown
    ): Promise<void> {
        console.log(`[SyncService] Resolving conflict for ${item.evaluationId}`);

        const localEval = await getEvaluation(item.evaluationId);
        if (!localEval) return;

        // Last-write-wins strategy
        const localTime = new Date(localEval.updatedAt).getTime();
        const serverTime = (serverData as { updatedAt?: string })?.updatedAt
            ? new Date((serverData as { updatedAt: string }).updatedAt).getTime()
            : 0;

        if (localTime >= serverTime) {
            // Local wins - retry sync
            console.log('[SyncService] Local version wins');
            await updateSyncQueueItem({
                ...item,
                retryCount: 0, // Reset retry count for force push
            });
        } else {
            // Server wins - update local
            console.log('[SyncService] Server version wins');
            await saveEvaluation({
                id: item.evaluationId,
                data: serverData,
                updatedAt: new Date().toISOString(),
                syncStatus: 'synced',
                version: localEval.version + 1,
                serverVersion: Date.now(),
            });

            // Remove from queue
            await removeFromSyncQueue(item.id);
        }
    }

    private async pullFromServer(): Promise<void> {
        // TODO: Implement pull from server
        // This would fetch changes since lastSyncAt
        console.log('[SyncService] Pull from server (placeholder)');
    }

    /**
     * Force sync now
     */
    forceSync(): void {
        this.sync();
    }

    /**
     * Check if there are pending changes
     */
    hasPendingChanges(): boolean {
        return this.state.pendingCount > 0;
    }

    /**
     * Clean up
     */
    destroy() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        this.listeners.clear();
    }
}

// Singleton instance
export const syncService = typeof window !== 'undefined' ? new SyncService() : null;
