// src/types/audit.ts
// Comprehensive type definitions for audit trail

// Tipos de eventos auditáveis
export type AuditEventType =
    // Avaliação
    | 'evaluation_created'
    | 'evaluation_updated'
    | 'evaluation_deleted'
    | 'evaluation_status_changed'
    | 'evaluation_exported'

    // Seções da avaliação
    | 'discovery_updated'
    | 'patient_updated'
    | 'health_history_updated'
    | 'abemid_updated'
    | 'katz_updated'
    | 'lawton_updated'
    | 'safety_checklist_updated'
    | 'schedule_updated'
    | 'results_calculated'

    // Proposta e contrato
    | 'proposal_generated'
    | 'proposal_sent'
    | 'proposal_accepted'
    | 'proposal_rejected'
    | 'contract_generated'
    | 'contract_signed'

    // Usuários
    | 'user_created'
    | 'user_updated'
    | 'user_deleted'
    | 'user_login'
    | 'user_logout'
    | 'user_pin_changed'
    | 'user_pin_reset'
    | 'user_locked'
    | 'user_unlocked'

    // Sistema
    | 'sync_started'
    | 'sync_completed'
    | 'sync_failed'
    | 'data_exported'
    | 'data_imported';

// Severidade do evento
export type AuditSeverity = 'info' | 'warning' | 'critical';

// Categoria do evento
export type AuditCategory =
    | 'evaluation'
    | 'user'
    | 'authentication'
    | 'system'
    | 'document';

// Entrada de log de auditoria
export interface AuditLogEntry {
    id: string;
    timestamp: Date;

    // Evento
    eventType: AuditEventType;
    category: AuditCategory;
    severity: AuditSeverity;

    // Contexto
    userId: string;
    userName: string;
    userRole: string;

    // Entidade afetada
    entityType: 'evaluation' | 'user' | 'system';
    entityId: string;
    entityName?: string;

    // Detalhes da alteração
    description: string;
    changes?: AuditChange[];
    metadata?: Record<string, unknown>;

    // Dispositivo/sessão
    deviceId: string;
    sessionId: string;
    ipAddress?: string;
    userAgent?: string;

    // Sincronização
    synced: boolean;
    syncedAt?: Date;
}

// Alteração específica de campo
export interface AuditChange {
    field: string;
    fieldLabel: string;
    previousValue: unknown;
    newValue: unknown;
    changeType: 'added' | 'modified' | 'removed';
}

// Filtros para consulta de audit log
export interface AuditLogFilters {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    entityId?: string;
    entityType?: 'evaluation' | 'user' | 'system';
    eventTypes?: AuditEventType[];
    categories?: AuditCategory[];
    severities?: AuditSeverity[];
    searchTerm?: string;
}

// Resultado paginado
export interface AuditLogPage {
    entries: AuditLogEntry[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// Snapshot de versão (para comparação)
export interface VersionSnapshot {
    id: string;
    entityType: 'evaluation' | 'user';
    entityId: string;
    version: number;
    timestamp: Date;
    userId: string;
    userName: string;
    data: Record<string, unknown>;
    checksum: string;
}

// Comparação entre versões
export interface VersionDiff {
    previousVersion: number;
    currentVersion: number;
    previousTimestamp: Date;
    currentTimestamp: Date;
    previousUserId: string;
    currentUserId: string;
    changes: AuditChange[];
}

// Estatísticas de auditoria
export interface AuditStats {
    totalEntries: number;
    entriesByCategory: Record<AuditCategory, number>;
    entriesBySeverity: Record<AuditSeverity, number>;
    entriesByUser: { userId: string; userName: string; count: number }[];
    entriesByDay: { date: string; count: number }[];
    mostActiveHours: { hour: number; count: number }[];
}

// Configuração de retenção
export interface AuditRetentionConfig {
    retentionDays: number;
    archiveBeforeDelete: boolean;
    autoCleanup: boolean;
    cleanupSchedule: 'daily' | 'weekly' | 'monthly';
}

// Labels para exibição
export const AUDIT_EVENT_LABELS: Record<AuditEventType, string> = {
    evaluation_created: 'Avaliação criada',
    evaluation_updated: 'Avaliação atualizada',
    evaluation_deleted: 'Avaliação excluída',
    evaluation_status_changed: 'Status da avaliação alterado',
    evaluation_exported: 'Avaliação exportada',

    discovery_updated: 'Descoberta atualizada',
    patient_updated: 'Dados do paciente atualizados',
    health_history_updated: 'Histórico de saúde atualizado',
    abemid_updated: 'ABEMID atualizado',
    katz_updated: 'Katz atualizado',
    lawton_updated: 'Lawton atualizado',
    safety_checklist_updated: 'Checklist de segurança atualizado',
    schedule_updated: 'Agenda atualizada',
    results_calculated: 'Resultados calculados',

    proposal_generated: 'Proposta gerada',
    proposal_sent: 'Proposta enviada',
    proposal_accepted: 'Proposta aceita',
    proposal_rejected: 'Proposta rejeitada',
    contract_generated: 'Contrato gerado',
    contract_signed: 'Contrato assinado',

    user_created: 'Usuário criado',
    user_updated: 'Usuário atualizado',
    user_deleted: 'Usuário excluído',
    user_login: 'Login realizado',
    user_logout: 'Logout realizado',
    user_pin_changed: 'PIN alterado',
    user_pin_reset: 'PIN resetado',
    user_locked: 'Usuário bloqueado',
    user_unlocked: 'Usuário desbloqueado',

    sync_started: 'Sincronização iniciada',
    sync_completed: 'Sincronização concluída',
    sync_failed: 'Sincronização falhou',
    data_exported: 'Dados exportados',
    data_imported: 'Dados importados',
};

export const AUDIT_CATEGORY_LABELS: Record<AuditCategory, string> = {
    evaluation: 'Avaliação',
    user: 'Usuário',
    authentication: 'Autenticação',
    system: 'Sistema',
    document: 'Documento',
};

export const AUDIT_SEVERITY_CONFIG: Record<AuditSeverity, { label: string; color: string; icon: string }> = {
    info: { label: 'Informação', color: 'blue', icon: 'info' },
    warning: { label: 'Atenção', color: 'yellow', icon: 'alert-triangle' },
    critical: { label: 'Crítico', color: 'red', icon: 'alert-circle' },
};
