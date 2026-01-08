import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
    AuditLogEntry,
    AuditEventType,
    AuditCategory,
    AuditSeverity,
    AuditChange,
    AuditLogFilters,
    AuditLogPage,
    VersionSnapshot,
    VersionDiff,
    AuditStats,
    AuditRetentionConfig,
} from '@/types/audit';
import { useAuthStore } from './authStore';
import { getOrCreateDeviceId } from '@/lib/auth/crypto';

// Mapeamento de evento para categoria e severidade
const EVENT_CONFIG: Record<AuditEventType, { category: AuditCategory; severity: AuditSeverity }> = {
    evaluation_created: { category: 'evaluation', severity: 'info' },
    evaluation_updated: { category: 'evaluation', severity: 'info' },
    evaluation_deleted: { category: 'evaluation', severity: 'warning' },
    evaluation_status_changed: { category: 'evaluation', severity: 'info' },
    evaluation_exported: { category: 'document', severity: 'info' },

    discovery_updated: { category: 'evaluation', severity: 'info' },
    patient_updated: { category: 'evaluation', severity: 'info' },
    health_history_updated: { category: 'evaluation', severity: 'info' },
    abemid_updated: { category: 'evaluation', severity: 'info' },
    katz_updated: { category: 'evaluation', severity: 'info' },
    lawton_updated: { category: 'evaluation', severity: 'info' },
    safety_checklist_updated: { category: 'evaluation', severity: 'info' },
    schedule_updated: { category: 'evaluation', severity: 'info' },
    results_calculated: { category: 'evaluation', severity: 'info' },

    proposal_generated: { category: 'document', severity: 'info' },
    proposal_sent: { category: 'document', severity: 'info' },
    proposal_accepted: { category: 'document', severity: 'info' },
    proposal_rejected: { category: 'document', severity: 'warning' },
    contract_generated: { category: 'document', severity: 'info' },
    contract_signed: { category: 'document', severity: 'info' },

    user_created: { category: 'user', severity: 'info' },
    user_updated: { category: 'user', severity: 'info' },
    user_deleted: { category: 'user', severity: 'warning' },
    user_login: { category: 'authentication', severity: 'info' },
    user_logout: { category: 'authentication', severity: 'info' },
    user_pin_changed: { category: 'authentication', severity: 'info' },
    user_pin_reset: { category: 'authentication', severity: 'warning' },
    user_locked: { category: 'authentication', severity: 'critical' },
    user_unlocked: { category: 'authentication', severity: 'warning' },

    sync_started: { category: 'system', severity: 'info' },
    sync_completed: { category: 'system', severity: 'info' },
    sync_failed: { category: 'system', severity: 'critical' },
    data_exported: { category: 'system', severity: 'info' },
    data_imported: { category: 'system', severity: 'warning' },
};

// Labels de campos para exibição humana
const FIELD_LABELS: Record<string, string> = {
    // Patient
    'patient.fullName': 'Nome completo',
    'patient.birthDate': 'Data de nascimento',
    'patient.cpf': 'CPF',
    'patient.maritalStatus': 'Estado civil',
    'patient.preferredName': 'Nome preferido',

    // Health
    'healthHistory.neurologicalConditions': 'Condições neurológicas',
    'healthHistory.cardiovascularConditions': 'Condições cardiovasculares',
    'healthHistory.medicationCount': 'Quantidade de medicamentos',

    // ABEMID
    'abemid.consciousness': 'Nível de consciência',
    'abemid.breathing': 'Padrão respiratório',
    'abemid.totalScore': 'Pontuação total ABEMID',
    'abemid.indicatedProfessional': 'Profissional indicado',

    // Katz
    'katz.bathing': 'Banho',
    'katz.dressing': 'Vestir',
    'katz.totalScore': 'Pontuação total Katz',
    'katz.classification': 'Classificação Katz',

    // Schedule
    'schedule.startTime': 'Horário de início',
    'schedule.endTime': 'Horário de término',
    'schedule.weekDays': 'Dias da semana',

    // Status
    'status': 'Status',
};

interface AuditState {
    // Logs
    entries: Record<string, AuditLogEntry>;

    // Snapshots de versão
    snapshots: Record<string, VersionSnapshot[]>;

    // Configuração
    retentionConfig: AuditRetentionConfig;

    // Ações de logging
    log: (
        eventType: AuditEventType,
        entityType: 'evaluation' | 'user' | 'system',
        entityId: string,
        description: string,
        options?: {
            changes?: AuditChange[];
            metadata?: Record<string, unknown>;
            entityName?: string;
        }
    ) => string;

    // Ações de versão
    createSnapshot: (
        entityType: 'evaluation' | 'user',
        entityId: string,
        data: Record<string, unknown>
    ) => void;

    // Consultas
    getEntries: (filters?: AuditLogFilters, page?: number, pageSize?: number) => AuditLogPage;
    getEntriesByEntity: (entityType: 'evaluation' | 'user', entityId: string) => AuditLogEntry[];
    getSnapshots: (entityType: 'evaluation' | 'user', entityId: string) => VersionSnapshot[];
    compareVersions: (entityId: string, versionA: number, versionB: number) => VersionDiff | null;
    getStats: (filters?: AuditLogFilters) => AuditStats;

    // Utilitários de diff
    detectChanges: (
        previousData: Record<string, unknown>,
        newData: Record<string, unknown>,
        prefix?: string
    ) => AuditChange[];

    // Manutenção
    cleanup: (olderThanDays: number) => number;
    exportLogs: (filters?: AuditLogFilters) => string;
    updateRetentionConfig: (config: Partial<AuditRetentionConfig>) => void;

    // Sync
    markAsSynced: (entryIds: string[]) => void;
    getUnsyncedEntries: () => AuditLogEntry[];
}

// Gerar checksum simples para snapshot
function generateChecksum(data: Record<string, unknown>): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
}

export const useAuditStore = create<AuditState>()(
    persist(
        (set, get) => ({
            entries: {},
            snapshots: {},
            retentionConfig: {
                retentionDays: 365,
                archiveBeforeDelete: true,
                autoCleanup: true,
                cleanupSchedule: 'weekly',
            },

            // Criar entrada de log
            log: (eventType, entityType, entityId, description, options = {}) => {
                const authStore = useAuthStore.getState();
                const session = authStore.session;

                const entryId = uuidv4();
                const config = EVENT_CONFIG[eventType];

                const entry: AuditLogEntry = {
                    id: entryId,
                    timestamp: new Date(),

                    eventType,
                    category: config.category,
                    severity: config.severity,

                    userId: session?.userId || 'system',
                    userName: session?.user.fullName || 'Sistema',
                    userRole: session?.user.role || 'system',

                    entityType,
                    entityId,
                    entityName: options.entityName,

                    description,
                    changes: options.changes,
                    metadata: options.metadata,

                    deviceId: getOrCreateDeviceId(),
                    sessionId: session?.token || 'no-session',

                    synced: false,
                };

                set((state) => ({
                    entries: { ...state.entries, [entryId]: entry },
                }));

                return entryId;
            },

            // Criar snapshot de versão
            createSnapshot: (entityType, entityId, data) => {
                const authStore = useAuthStore.getState();
                const session = authStore.session;

                const key = `${entityType}:${entityId}`;
                const existingSnapshots = get().snapshots[key] || [];
                const version = existingSnapshots.length + 1;

                const snapshot: VersionSnapshot = {
                    id: uuidv4(),
                    entityType,
                    entityId,
                    version,
                    timestamp: new Date(),
                    userId: session?.userId || 'system',
                    userName: session?.user.fullName || 'Sistema',
                    data,
                    checksum: generateChecksum(data),
                };

                set((state) => ({
                    snapshots: {
                        ...state.snapshots,
                        [key]: [...existingSnapshots, snapshot],
                    },
                }));
            },

            // Consultar entries com filtros e paginação
            getEntries: (filters = {}, page = 1, pageSize = 20) => {
                const allEntries = Object.values(get().entries);

                let filtered = allEntries.filter((entry) => {
                    if (filters.startDate && new Date(entry.timestamp) < filters.startDate) return false;
                    if (filters.endDate && new Date(entry.timestamp) > filters.endDate) return false;
                    if (filters.userId && entry.userId !== filters.userId) return false;
                    if (filters.entityId && entry.entityId !== filters.entityId) return false;
                    if (filters.entityType && entry.entityType !== filters.entityType) return false;
                    if (filters.eventTypes?.length && !filters.eventTypes.includes(entry.eventType)) return false;
                    if (filters.categories?.length && !filters.categories.includes(entry.category)) return false;
                    if (filters.severities?.length && !filters.severities.includes(entry.severity)) return false;
                    if (filters.searchTerm) {
                        const term = filters.searchTerm.toLowerCase();
                        return (
                            entry.description.toLowerCase().includes(term) ||
                            entry.userName.toLowerCase().includes(term) ||
                            entry.entityName?.toLowerCase().includes(term)
                        );
                    }
                    return true;
                });

                // Ordenar por timestamp decrescente
                filtered.sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                const total = filtered.length;
                const start = (page - 1) * pageSize;
                const entries = filtered.slice(start, start + pageSize);

                return {
                    entries,
                    total,
                    page,
                    pageSize,
                    hasMore: start + pageSize < total,
                };
            },

            // Entries por entidade
            getEntriesByEntity: (entityType, entityId) => {
                return Object.values(get().entries)
                    .filter((e) => e.entityType === entityType && e.entityId === entityId)
                    .sort((a, b) =>
                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    );
            },

            // Snapshots por entidade
            getSnapshots: (entityType, entityId) => {
                const key = `${entityType}:${entityId}`;
                return get().snapshots[key] || [];
            },

            // Comparar versões
            compareVersions: (entityId, versionA, versionB) => {
                const evaluationKey = `evaluation:${entityId}`;
                const userKey = `user:${entityId}`;

                const snapshots = get().snapshots[evaluationKey] || get().snapshots[userKey];
                if (!snapshots) return null;

                const snapshotA = snapshots.find((s) => s.version === versionA);
                const snapshotB = snapshots.find((s) => s.version === versionB);

                if (!snapshotA || !snapshotB) return null;

                const changes = get().detectChanges(snapshotA.data, snapshotB.data);

                return {
                    previousVersion: versionA,
                    currentVersion: versionB,
                    previousTimestamp: snapshotA.timestamp,
                    currentTimestamp: snapshotB.timestamp,
                    previousUserId: snapshotA.userId,
                    currentUserId: snapshotB.userId,
                    changes,
                };
            },

            // Estatísticas
            getStats: (filters = {}) => {
                const { entries: entriesPage } = get().getEntries(filters, 1, 100000);

                const byCategory: Record<AuditCategory, number> = {
                    evaluation: 0,
                    user: 0,
                    authentication: 0,
                    system: 0,
                    document: 0,
                };

                const bySeverity: Record<AuditSeverity, number> = {
                    info: 0,
                    warning: 0,
                    critical: 0,
                };

                const byUserMap = new Map<string, { userName: string; count: number }>();
                const byDayMap = new Map<string, number>();
                const byHourMap = new Map<number, number>();

                entriesPage.forEach((entry) => {
                    byCategory[entry.category]++;
                    bySeverity[entry.severity]++;

                    const userKey = entry.userId;
                    if (byUserMap.has(userKey)) {
                        byUserMap.get(userKey)!.count++;
                    } else {
                        byUserMap.set(userKey, { userName: entry.userName, count: 1 });
                    }

                    const day = new Date(entry.timestamp).toISOString().split('T')[0];
                    byDayMap.set(day, (byDayMap.get(day) || 0) + 1);

                    const hour = new Date(entry.timestamp).getHours();
                    byHourMap.set(hour, (byHourMap.get(hour) || 0) + 1);
                });

                return {
                    totalEntries: entriesPage.length,
                    entriesByCategory: byCategory,
                    entriesBySeverity: bySeverity,
                    entriesByUser: Array.from(byUserMap.entries())
                        .map(([userId, data]) => ({ userId, ...data }))
                        .sort((a, b) => b.count - a.count),
                    entriesByDay: Array.from(byDayMap.entries())
                        .map(([date, count]) => ({ date, count }))
                        .sort((a, b) => a.date.localeCompare(b.date)),
                    mostActiveHours: Array.from(byHourMap.entries())
                        .map(([hour, count]) => ({ hour, count }))
                        .sort((a, b) => b.count - a.count),
                };
            },

            // Detectar alterações entre dois objetos
            detectChanges: (previousData, newData, prefix = '') => {
                const changes: AuditChange[] = [];

                const allKeys = new Set([
                    ...Object.keys(previousData || {}),
                    ...Object.keys(newData || {}),
                ]);

                allKeys.forEach((key) => {
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    const prevValue = previousData?.[key];
                    const newValue = newData?.[key];

                    // Ignorar campos de metadados
                    if (['id', 'createdAt', 'updatedAt'].includes(key)) return;

                    // Se ambos são objetos, recursão
                    if (
                        typeof prevValue === 'object' &&
                        typeof newValue === 'object' &&
                        prevValue !== null &&
                        newValue !== null &&
                        !Array.isArray(prevValue) &&
                        !Array.isArray(newValue)
                    ) {
                        changes.push(
                            ...get().detectChanges(
                                prevValue as Record<string, unknown>,
                                newValue as Record<string, unknown>,
                                fullKey
                            )
                        );
                        return;
                    }

                    // Comparação direta
                    const prevStr = JSON.stringify(prevValue);
                    const newStr = JSON.stringify(newValue);

                    if (prevStr !== newStr) {
                        let changeType: 'added' | 'modified' | 'removed' = 'modified';
                        if (prevValue === undefined || prevValue === null) changeType = 'added';
                        if (newValue === undefined || newValue === null) changeType = 'removed';

                        changes.push({
                            field: fullKey,
                            fieldLabel: FIELD_LABELS[fullKey] || key,
                            previousValue: prevValue,
                            newValue: newValue,
                            changeType,
                        });
                    }
                });

                return changes;
            },

            // Limpeza de logs antigos
            cleanup: (olderThanDays) => {
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

                const { entries, snapshots } = get();
                let removedCount = 0;

                const newEntries: Record<string, AuditLogEntry> = {};
                Object.entries(entries).forEach(([id, entry]) => {
                    if (new Date(entry.timestamp) >= cutoffDate) {
                        newEntries[id] = entry;
                    } else {
                        removedCount++;
                    }
                });

                // Limpar snapshots antigos também (manter apenas últimos 10 por entidade)
                const newSnapshots: Record<string, VersionSnapshot[]> = {};
                Object.entries(snapshots).forEach(([key, snapshotList]) => {
                    newSnapshots[key] = snapshotList.slice(-10);
                });

                set({ entries: newEntries, snapshots: newSnapshots });

                return removedCount;
            },

            // Exportar logs
            exportLogs: (filters = {}) => {
                const { entries } = get().getEntries(filters, 1, 100000);
                return JSON.stringify(entries, null, 2);
            },

            // Atualizar configuração de retenção
            updateRetentionConfig: (config) => {
                set((state) => ({
                    retentionConfig: { ...state.retentionConfig, ...config },
                }));
            },

            // Marcar como sincronizado
            markAsSynced: (entryIds) => {
                const now = new Date();
                set((state) => {
                    const newEntries = { ...state.entries };
                    entryIds.forEach((id) => {
                        if (newEntries[id]) {
                            newEntries[id] = {
                                ...newEntries[id],
                                synced: true,
                                syncedAt: now,
                            };
                        }
                    });
                    return { entries: newEntries };
                });
            },

            // Obter entries não sincronizados
            getUnsyncedEntries: () => {
                return Object.values(get().entries).filter((e) => !e.synced);
            },
        }),
        {
            name: 'maos-amigas-audit',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                entries: state.entries,
                snapshots: state.snapshots,
                retentionConfig: state.retentionConfig,
            }),
        }
    )
);

// Hook para logging automático em atualizações de avaliação
export function useAuditLog() {
    const { log, detectChanges, createSnapshot } = useAuditStore();

    const logEvaluationUpdate = (
        evaluationId: string,
        section: string,
        previousData: Record<string, unknown>,
        newData: Record<string, unknown>,
        patientName?: string
    ) => {
        const changes = detectChanges(previousData, newData, section);

        if (changes.length === 0) return;

        const eventType = `${section}_updated` as AuditEventType;

        log(
            eventType,
            'evaluation',
            evaluationId,
            `${changes.length} campo(s) atualizado(s) em ${section}`,
            {
                changes,
                entityName: patientName,
            }
        );
    };

    const logEvaluationSnapshot = (
        evaluationId: string,
        data: Record<string, unknown>
    ) => {
        createSnapshot('evaluation', evaluationId, data);
    };

    return {
        log,
        logEvaluationUpdate,
        logEvaluationSnapshot,
        detectChanges,
    };
}
