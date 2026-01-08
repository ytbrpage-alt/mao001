// src/types/auth.ts
// Comprehensive type definitions for authentication

import { type DefaultSession, type DefaultUser } from 'next-auth';
import { type JWT as DefaultJWT } from 'next-auth/jwt';

// ========================================
// NEXT-AUTH TYPE EXTENSIONS
// ========================================

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: UserRole;
            name: string;
            email: string;
        } & DefaultSession['user'];
        accessToken?: string;
        error?: string;
    }

    interface User extends DefaultUser {
        id: string;
        role: UserRole;
        passwordHash?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string;
        role: UserRole;
        accessTokenExpires?: number;
        refreshToken?: string;
        error?: string;
    }
}

// ========================================
// CORE TYPES
// ========================================

// Níveis de acesso
export type UserRole =
    | 'admin'
    | 'supervisor'
    | 'evaluator'
    | 'client'
    | 'caregiver'
    | 'nurse'
    | 'nurse_tech'
    | 'physiotherapist'
    | 'nutritionist'
    | 'psychologist'
    | 'speech_therapist'
    | 'occupational_therapist'
    | 'physician';

// Status do usuário
export type UserStatus = 'active' | 'inactive' | 'blocked' | 'pending';

// Dados do avaliador/usuário
export interface User {
    id: string;

    // Identificação
    fullName: string;
    email: string;
    phone: string;
    cpf: string;

    // Credenciais
    pinHash: string; // Hash do PIN de 6 dígitos
    passwordHash?: string; // Apenas para admins

    // Perfil profissional
    role: UserRole;
    status: UserStatus;
    registrationNumber?: string; // COREN, CREFITO, etc.
    specialization?: string;

    // Metadados
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    createdBy: string;

    // Configurações pessoais
    preferences: UserPreferences;

    // Estatísticas
    stats: UserStats;
}

export interface UserPreferences {
    // Sessão
    autoLogoutMinutes: number; // 0 = nunca
    keepLoggedIn: boolean;

    // Notificações
    notifyOnSync: boolean;
    notifyOnAssignment: boolean;

    // Interface
    hapticFeedback: boolean;
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
}

export interface UserStats {
    totalEvaluations: number;
    evaluationsThisMonth: number;
    averageEvaluationTime: number; // em minutos
    lastEvaluationAt?: Date;
}

// ========================================
// SESSION & LOGIN
// ========================================

// Sessão ativa
export interface AuthSession {
    userId: string;
    user: User;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    deviceId: string;
    isOfflineSession: boolean;
}

// Tentativas de login
export interface LoginAttempt {
    timestamp: Date;
    userId?: string;
    identifier: string; // email ou visualmente mascarado
    success: boolean;
    ipAddress?: string;
    deviceId: string;
    failureReason?: 'invalid_pin' | 'invalid_password' | 'user_blocked' | 'user_inactive';
}

// Bloqueio de conta
export interface AccountLock {
    userId: string;
    lockedAt: Date;
    unlocksAt: Date;
    reason: 'too_many_attempts' | 'admin_action' | 'security_concern';
    attemptCount: number;
}

// ========================================
// USER MANAGEMENT
// ========================================

// Dados para criar usuário
export interface CreateUserData {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    role: UserRole;
    registrationNumber?: string;
    specialization?: string;
    initialPin: string;
}

// Dados para atualizar usuário
export interface UpdateUserData {
    fullName?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
    status?: UserStatus;
    registrationNumber?: string;
    specialization?: string;
    preferences?: Partial<UserPreferences>;
}

// ========================================
// AUTH RESULTS
// ========================================

// Resultado de autenticação
export interface AuthResult {
    success: boolean;
    session?: AuthSession;
    error?: AuthError;
    requiresPasswordChange?: boolean;
    remainingAttempts?: number;
}

export interface AuthError {
    code: 'invalid_credentials' | 'account_locked' | 'account_inactive' | 'session_expired' | 'network_error';
    message: string;
    lockedUntil?: Date;
}

// ========================================
// PERMISSIONS
// ========================================

// Permissões por funcionalidade
export interface Permissions {
    // Avaliações
    canCreateEvaluation: boolean;
    canEditOwnEvaluation: boolean;
    canEditAnyEvaluation: boolean;
    canDeleteEvaluation: boolean;
    canViewAllEvaluations: boolean;

    // Usuários
    canManageUsers: boolean;
    canViewUserDetails: boolean;

    // Relatórios
    canExportData: boolean;
    canViewReports: boolean;
    canViewFinancials: boolean;

    // Sistema
    canAccessSettings: boolean;
    canViewAuditLog: boolean;
    canManageTemplates: boolean;
}

// Mapeamento de permissões por role
export const ROLE_PERMISSIONS: Record<UserRole, Permissions> = {
    admin: {
        canCreateEvaluation: true,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: true,
        canDeleteEvaluation: true,
        canViewAllEvaluations: true,
        canManageUsers: true,
        canViewUserDetails: true,
        canExportData: true,
        canViewReports: true,
        canViewFinancials: true,
        canAccessSettings: true,
        canViewAuditLog: true,
        canManageTemplates: true,
    },
    supervisor: {
        canCreateEvaluation: true,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: true,
        canDeleteEvaluation: false,
        canViewAllEvaluations: true,
        canManageUsers: false,
        canViewUserDetails: true,
        canExportData: true,
        canViewReports: true,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: true,
        canManageTemplates: false,
    },
    evaluator: {
        canCreateEvaluation: true,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: false,
        canDeleteEvaluation: false,
        canViewAllEvaluations: false,
        canManageUsers: false,
        canViewUserDetails: false,
        canExportData: false,
        canViewReports: false,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: false,
    },
    client: {
        canCreateEvaluation: false,
        canEditOwnEvaluation: false,
        canEditAnyEvaluation: false,
        canDeleteEvaluation: false,
        canViewAllEvaluations: false,
        canManageUsers: false,
        canViewUserDetails: false,
        canExportData: false,
        canViewReports: false,
        canViewFinancials: true,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: false,
    },
    caregiver: {
        canCreateEvaluation: false,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: false,
        canDeleteEvaluation: false,
        canViewAllEvaluations: false,
        canManageUsers: false,
        canViewUserDetails: false,
        canExportData: false,
        canViewReports: false,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: false,
    },
    nurse: {
        canCreateEvaluation: true,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: false,
        canDeleteEvaluation: false,
        canViewAllEvaluations: false,
        canManageUsers: false,
        canViewUserDetails: true,
        canExportData: false,
        canViewReports: true,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: false,
    },
    nurse_tech: {
        canCreateEvaluation: false,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: false,
        canDeleteEvaluation: false,
        canViewAllEvaluations: false,
        canManageUsers: false,
        canViewUserDetails: false,
        canExportData: false,
        canViewReports: false,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: false,
    },
    physiotherapist: {
        canCreateEvaluation: true,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: false,
        canDeleteEvaluation: false,
        canViewAllEvaluations: false,
        canManageUsers: false,
        canViewUserDetails: true,
        canExportData: false,
        canViewReports: true,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: false,
    },
    nutritionist: {
        canCreateEvaluation: true,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: false,
        canDeleteEvaluation: false,
        canViewAllEvaluations: false,
        canManageUsers: false,
        canViewUserDetails: true,
        canExportData: false,
        canViewReports: true,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: false,
    },
    psychologist: {
        canCreateEvaluation: true,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: false,
        canDeleteEvaluation: false,
        canViewAllEvaluations: false,
        canManageUsers: false,
        canViewUserDetails: true,
        canExportData: false,
        canViewReports: true,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: false,
    },
    speech_therapist: {
        canCreateEvaluation: true,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: false,
        canDeleteEvaluation: false,
        canViewAllEvaluations: false,
        canManageUsers: false,
        canViewUserDetails: true,
        canExportData: false,
        canViewReports: true,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: false,
    },
    occupational_therapist: {
        canCreateEvaluation: true,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: false,
        canDeleteEvaluation: false,
        canViewAllEvaluations: false,
        canManageUsers: false,
        canViewUserDetails: true,
        canExportData: false,
        canViewReports: true,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: false,
    },
    physician: {
        canCreateEvaluation: true,
        canEditOwnEvaluation: true,
        canEditAnyEvaluation: true,
        canDeleteEvaluation: false,
        canViewAllEvaluations: true,
        canManageUsers: false,
        canViewUserDetails: true,
        canExportData: true,
        canViewReports: true,
        canViewFinancials: false,
        canAccessSettings: false,
        canViewAuditLog: false,
        canManageTemplates: true,
    },
};

// ========================================
// LEGACY COMPATIBILITY
// ========================================

// Keep legacy types for backward compatibility
export interface UserCredentials {
    email: string;
    password: string;
}

export interface LoginResult {
    success: boolean;
    user?: User;
    error?: string;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
}

export interface PasswordValidation {
    valid: boolean;
    errors: string[];
}

export interface StoredSession {
    id: string;
    userId: string;
    refreshToken: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
    createdAt: Date;
}
