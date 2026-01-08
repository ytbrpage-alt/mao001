// src/types/sync.ts
// Type definitions for cloud synchronization

// Status de um item
export type SyncStatus =
    | 'synced'
    | 'pending'
    | 'syncing'
    | 'conflict'
    | 'error';

// Direção da sync
export type SyncDirection = 'push' | 'pull' | 'bidirectional';

// Operação pendente
export interface SyncOperation {
    id: string;
    type: 'create' | 'update' | 'delete';
    entityType: 'evaluation' | 'user' | 'audit';
    entityId: string;
    data: Record<string, unknown>;
    timestamp: Date;
    retryCount: number;
    lastError?: string;
    priority: 'high' | 'normal' | 'low';
}

// Conflito detectado
export interface SyncConflict {
    id: string;
    entityType: 'evaluation' | 'user';
    entityId: string;
    localData: Record<string, unknown>;
    remoteData: Record<string, unknown>;
    localTimestamp: Date;
    remoteTimestamp: Date;
    detectedAt: Date;
    resolvedAt?: Date;
    resolution?: 'local' | 'remote' | 'merged';
}

// Resultado de sync
export interface SyncResult {
    success: boolean;
    pushed: number;
    pulled: number;
    conflicts: SyncConflict[];
    errors: { entityId: string; error: string }[];
    duration: number;
}

// Estado geral de sync
export interface SyncState {
    lastSyncAt: Date | null;
    isSyncing: boolean;
    pendingCount: number;
    conflictCount: number;
    errorCount: number;
    progress: number;
}

// Configuração de sync
export interface SyncConfig {
    autoSync: boolean;
    syncIntervalMinutes: number;
    syncOnReconnect: boolean;
    maxRetries: number;
    compressData: boolean;
    syncAuditLogs: boolean;
}

// Metadados de versão
export interface VersionMetadata {
    version: number;
    updatedAt: Date;
    updatedBy: string;
    checksum: string;
}

// Resposta da API
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: { code: string; message: string };
    meta?: { version: number; timestamp: Date };
}
