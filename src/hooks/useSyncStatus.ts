// src/hooks/useSyncStatus.ts
// Hook for monitoring sync status

'use client';

import { useState, useEffect } from 'react';
import { syncService } from '@/lib/sync/syncService';

interface SyncStatusState {
    status: 'idle' | 'syncing' | 'error' | 'offline';
    lastSyncAt: Date | null;
    pendingCount: number;
    error: string | null;
    isOnline: boolean;
}

export function useSyncStatus(): SyncStatusState & {
    forceSync: () => void;
    hasPendingChanges: boolean;
} {
    const [state, setState] = useState<SyncStatusState>({
        status: 'idle',
        lastSyncAt: null,
        pendingCount: 0,
        error: null,
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    });

    useEffect(() => {
        if (!syncService) return;

        // Subscribe to sync state changes
        const unsubscribe = syncService.subscribe((syncState) => {
            setState((prev) => ({
                ...prev,
                ...syncState,
            }));
        });

        // Listen for online/offline events
        const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }));
        const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }));

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            unsubscribe();
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const forceSync = () => {
        syncService?.forceSync();
    };

    return {
        ...state,
        forceSync,
        hasPendingChanges: state.pendingCount > 0,
    };
}
