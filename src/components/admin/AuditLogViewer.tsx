// src/components/admin/AuditLogViewer.tsx
// Admin component for viewing audit logs

'use client';

import { useState } from 'react';
import { useAuditLog } from '@/hooks/useAuditLog';
import { formatDate, formatRelativeDate } from '@/lib/utils/formatters';
import {
    Download,
    RefreshCw,
    Filter,
    Search,
    User,
    FileText,
    Shield,
    Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { AuditAction, AuditResource, AuditLogFilter } from '@/lib/audit';

const ACTION_LABELS: Record<AuditAction, { label: string; color: string }> = {
    CREATE: { label: 'Criação', color: 'bg-success-100 text-success-800' },
    READ: { label: 'Visualização', color: 'bg-neutral-100 text-neutral-800' },
    UPDATE: { label: 'Atualização', color: 'bg-brand-100 text-brand-800' },
    DELETE: { label: 'Exclusão', color: 'bg-danger-100 text-danger-800' },
    LOGIN: { label: 'Login', color: 'bg-success-100 text-success-800' },
    LOGOUT: { label: 'Logout', color: 'bg-neutral-100 text-neutral-800' },
    EXPORT: { label: 'Exportação', color: 'bg-brand-100 text-brand-800' },
    CONSENT_ACCEPT: { label: 'Consentimento', color: 'bg-success-100 text-success-800' },
    CONSENT_REVOKE: { label: 'Revogação', color: 'bg-warning-100 text-warning-800' },
    DATA_ACCESS_REQUEST: { label: 'Solicitação de Acesso', color: 'bg-brand-100 text-brand-800' },
    DATA_DELETION_REQUEST: { label: 'Solicitação de Exclusão', color: 'bg-danger-100 text-danger-800' },
};

const RESOURCE_ICONS: Record<AuditResource, React.ElementType> = {
    evaluation: FileText,
    patient: User,
    user: User,
    contract: FileText,
    consent: Shield,
    session: Activity,
};

export function AuditLogViewer() {
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { logs, isLoading, refresh, filter, exportCSV, exportJSON } = useAuditLog();

    const filteredLogs = logs.filter((log) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            log.userEmail.toLowerCase().includes(search) ||
            log.resourceId?.toLowerCase().includes(search) ||
            log.action.toLowerCase().includes(search)
        );
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">
                    Logs de Auditoria
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            'p-2 rounded-lg transition-colors',
                            showFilters ? 'bg-brand-100 text-brand-700' : 'hover:bg-neutral-100'
                        )}
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => refresh()}
                        disabled={isLoading}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        <RefreshCw className={cn('w-5 h-5', isLoading && 'animate-spin')} />
                    </button>
                    <div className="relative">
                        <button
                            className="inline-flex items-center gap-2 px-3 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
                            onClick={exportCSV}
                        >
                            <Download className="w-4 h-4" />
                            Exportar
                        </button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                    type="text"
                    placeholder="Buscar por email, recurso ou ação..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">
                                    Data/Hora
                                </th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">
                                    Usuário
                                </th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">
                                    Ação
                                </th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">
                                    Recurso
                                </th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                                        Carregando logs...
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                                        Nenhum log encontrado
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.slice(0, 100).map((log) => {
                                    const actionInfo = ACTION_LABELS[log.action];
                                    const ResourceIcon = RESOURCE_ICONS[log.resource];

                                    return (
                                        <tr key={log.id} className="hover:bg-neutral-50">
                                            <td className="px-4 py-3 text-sm">
                                                <div className="font-medium text-neutral-900">
                                                    {formatDate(log.timestamp, 'dd/MM/yyyy HH:mm')}
                                                </div>
                                                <div className="text-neutral-500 text-xs">
                                                    {formatRelativeDate(log.timestamp)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="font-medium text-neutral-900">
                                                    {log.userEmail}
                                                </div>
                                                {log.ipAddress && (
                                                    <div className="text-neutral-500 text-xs">
                                                        IP: {log.ipAddress}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                                                        actionInfo.color
                                                    )}
                                                >
                                                    {actionInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <ResourceIcon className="w-4 h-4 text-neutral-400" />
                                                    <span className="text-neutral-900 capitalize">
                                                        {log.resource}
                                                    </span>
                                                    {log.resourceId && (
                                                        <span className="text-neutral-500 text-xs">
                                                            #{log.resourceId.slice(0, 8)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                                                        log.success
                                                            ? 'bg-success-100 text-success-800'
                                                            : 'bg-danger-100 text-danger-800'
                                                    )}
                                                >
                                                    {log.success ? 'Sucesso' : 'Erro'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 text-sm text-neutral-600">
                    Exibindo {Math.min(filteredLogs.length, 100)} de {filteredLogs.length} registros
                </div>
            </div>
        </div>
    );
}
