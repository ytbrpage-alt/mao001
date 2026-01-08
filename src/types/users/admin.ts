/**
 * Tipos específicos para administradores
 */

import type { BaseUser } from './base';

// Usuário administrador
export interface AdminUser extends BaseUser {
    userType: 'admin' | 'supervisor' | 'evaluator';
    adminLevel: 'super_admin' | 'admin' | 'manager' | 'operator';
    department?: string;
    adminPermissions: AdminPermissions;
    managedAreas?: { cities?: string[]; regions?: string[]; teams?: string[] };
    approvalLimit?: number;
    canApproveContracts: boolean;
    canApprovePayments: boolean;
}

// Permissões administrativas detalhadas
export interface AdminPermissions {
    dashboard: { viewMetrics: boolean; viewFinancials: boolean; viewTeamPerformance: boolean; exportData: boolean };
    users: { viewAll: boolean; create: boolean; edit: boolean; delete: boolean; approve: boolean; suspend: boolean; resetCredentials: boolean; viewSensitiveData: boolean };
    clients: { viewAll: boolean; create: boolean; edit: boolean; delete: boolean; viewFinancials: boolean; manageContracts: boolean };
    professionals: { viewAll: boolean; create: boolean; edit: boolean; delete: boolean; approve: boolean; assignPatients: boolean; viewDocuments: boolean; managePayroll: boolean };
    patients: { viewAll: boolean; create: boolean; edit: boolean; viewMedicalInfo: boolean; editMedicalInfo: boolean; assignProfessionals: boolean };
    evaluations: { viewAll: boolean; create: boolean; edit: boolean; delete: boolean; approve: boolean; generateProposals: boolean };
    financial: { viewReports: boolean; manageInvoices: boolean; processPayments: boolean; manageRefunds: boolean; viewPayroll: boolean; approveExpenses: boolean; configureRates: boolean };
    scheduling: { viewAll: boolean; createForOthers: boolean; editOthersSchedule: boolean; manageSubstitutions: boolean };
    reports: { viewOperational: boolean; viewFinancial: boolean; viewQuality: boolean; createCustom: boolean; exportAll: boolean };
    system: { viewAuditLogs: boolean; manageSettings: boolean; manageIntegrations: boolean; manageTemplates: boolean; performBackups: boolean };
}

// Níveis de admin predefinidos
export const ADMIN_LEVEL_PERMISSIONS: Record<string, AdminPermissions> = {
    super_admin: {
        dashboard: { viewMetrics: true, viewFinancials: true, viewTeamPerformance: true, exportData: true },
        users: { viewAll: true, create: true, edit: true, delete: true, approve: true, suspend: true, resetCredentials: true, viewSensitiveData: true },
        clients: { viewAll: true, create: true, edit: true, delete: true, viewFinancials: true, manageContracts: true },
        professionals: { viewAll: true, create: true, edit: true, delete: true, approve: true, assignPatients: true, viewDocuments: true, managePayroll: true },
        patients: { viewAll: true, create: true, edit: true, viewMedicalInfo: true, editMedicalInfo: true, assignProfessionals: true },
        evaluations: { viewAll: true, create: true, edit: true, delete: true, approve: true, generateProposals: true },
        financial: { viewReports: true, manageInvoices: true, processPayments: true, manageRefunds: true, viewPayroll: true, approveExpenses: true, configureRates: true },
        scheduling: { viewAll: true, createForOthers: true, editOthersSchedule: true, manageSubstitutions: true },
        reports: { viewOperational: true, viewFinancial: true, viewQuality: true, createCustom: true, exportAll: true },
        system: { viewAuditLogs: true, manageSettings: true, manageIntegrations: true, manageTemplates: true, performBackups: true },
    },
    admin: {
        dashboard: { viewMetrics: true, viewFinancials: true, viewTeamPerformance: true, exportData: true },
        users: { viewAll: true, create: true, edit: true, delete: false, approve: true, suspend: true, resetCredentials: true, viewSensitiveData: false },
        clients: { viewAll: true, create: true, edit: true, delete: false, viewFinancials: true, manageContracts: true },
        professionals: { viewAll: true, create: true, edit: true, delete: false, approve: true, assignPatients: true, viewDocuments: true, managePayroll: false },
        patients: { viewAll: true, create: true, edit: true, viewMedicalInfo: true, editMedicalInfo: true, assignProfessionals: true },
        evaluations: { viewAll: true, create: true, edit: true, delete: false, approve: true, generateProposals: true },
        financial: { viewReports: true, manageInvoices: true, processPayments: false, manageRefunds: false, viewPayroll: true, approveExpenses: false, configureRates: false },
        scheduling: { viewAll: true, createForOthers: true, editOthersSchedule: true, manageSubstitutions: true },
        reports: { viewOperational: true, viewFinancial: true, viewQuality: true, createCustom: true, exportAll: true },
        system: { viewAuditLogs: true, manageSettings: false, manageIntegrations: false, manageTemplates: true, performBackups: false },
    },
    manager: {
        dashboard: { viewMetrics: true, viewFinancials: false, viewTeamPerformance: true, exportData: true },
        users: { viewAll: true, create: false, edit: false, delete: false, approve: false, suspend: false, resetCredentials: false, viewSensitiveData: false },
        clients: { viewAll: true, create: true, edit: true, delete: false, viewFinancials: false, manageContracts: false },
        professionals: { viewAll: true, create: false, edit: false, delete: false, approve: false, assignPatients: true, viewDocuments: true, managePayroll: false },
        patients: { viewAll: true, create: true, edit: true, viewMedicalInfo: true, editMedicalInfo: false, assignProfessionals: true },
        evaluations: { viewAll: true, create: true, edit: true, delete: false, approve: false, generateProposals: true },
        financial: { viewReports: false, manageInvoices: false, processPayments: false, manageRefunds: false, viewPayroll: false, approveExpenses: false, configureRates: false },
        scheduling: { viewAll: true, createForOthers: true, editOthersSchedule: true, manageSubstitutions: true },
        reports: { viewOperational: true, viewFinancial: false, viewQuality: true, createCustom: false, exportAll: false },
        system: { viewAuditLogs: false, manageSettings: false, manageIntegrations: false, manageTemplates: false, performBackups: false },
    },
    operator: {
        dashboard: { viewMetrics: true, viewFinancials: false, viewTeamPerformance: false, exportData: false },
        users: { viewAll: false, create: false, edit: false, delete: false, approve: false, suspend: false, resetCredentials: false, viewSensitiveData: false },
        clients: { viewAll: true, create: true, edit: false, delete: false, viewFinancials: false, manageContracts: false },
        professionals: { viewAll: true, create: false, edit: false, delete: false, approve: false, assignPatients: false, viewDocuments: false, managePayroll: false },
        patients: { viewAll: true, create: false, edit: false, viewMedicalInfo: false, editMedicalInfo: false, assignProfessionals: false },
        evaluations: { viewAll: true, create: true, edit: false, delete: false, approve: false, generateProposals: false },
        financial: { viewReports: false, manageInvoices: false, processPayments: false, manageRefunds: false, viewPayroll: false, approveExpenses: false, configureRates: false },
        scheduling: { viewAll: true, createForOthers: false, editOthersSchedule: false, manageSubstitutions: false },
        reports: { viewOperational: false, viewFinancial: false, viewQuality: false, createCustom: false, exportAll: false },
        system: { viewAuditLogs: false, manageSettings: false, manageIntegrations: false, manageTemplates: false, performBackups: false },
    },
};
