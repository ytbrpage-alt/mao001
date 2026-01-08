import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
    User,
    AuthSession,
    LoginAttempt,
    AccountLock,
    AuthResult,
    CreateUserData,
    UpdateUserData,
    UserRole,
    Permissions,
} from '@/types/auth';
import { ROLE_PERMISSIONS } from '@/types/auth';
import {
    hashPin,
    verifyPin,
    generateSessionToken,
    getOrCreateDeviceId,
} from '@/lib/auth/crypto';

// Constantes de segurança
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const SESSION_DURATION_HOURS = 8;

interface AuthState {
    // Sessão atual
    session: AuthSession | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    _hasHydrated: boolean; // Flag para indicar que hidratou

    // Usuários (armazenamento local para offline)
    users: Record<string, User>;
    userSalts: Record<string, string>; // Salts para hash de PIN

    // Segurança
    loginAttempts: LoginAttempt[];
    accountLocks: Record<string, AccountLock>;
    lastActivityAt: Date | null;

    // Ações de autenticação
    loginWithPin: (pin: string, userId?: string) => Promise<AuthResult>;
    loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
    logout: () => void;
    refreshSession: () => void;
    setHasHydrated: (state: boolean) => void;

    // Gestão de usuários
    createUser: (data: CreateUserData, creatorId: string) => Promise<User>;
    updateUser: (userId: string, data: UpdateUserData) => Promise<User>;
    deleteUser: (userId: string) => Promise<void>;
    changePin: (userId: string, currentPin: string, newPin: string) => Promise<boolean>;
    resetPin: (userId: string, newPin: string) => Promise<boolean>; // Admin only

    // Verificações
    checkSession: () => boolean;
    getPermissions: () => Permissions | null;
    hasPermission: (permission: keyof Permissions) => boolean;
    isAccountLocked: (userId: string) => AccountLock | null;

    // Getters
    getCurrentUser: () => User | null;
    getUserById: (id: string) => User | null;
    getAllUsers: () => User[];
    getUsersByRole: (role: UserRole) => User[];

    // Atividade
    recordActivity: () => void;
    checkInactivity: () => boolean;
}

// Usuário admin padrão (primeiro acesso)
const DEFAULT_ADMIN: Omit<User, 'pinHash'> = {
    id: 'admin-default',
    fullName: 'Administrador',
    email: 'admin@maosamigas.com.br',
    phone: '(45) 99999-9999',
    cpf: '000.000.000-00',
    role: 'admin',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    preferences: {
        autoLogoutMinutes: 30,
        keepLoggedIn: false,
        notifyOnSync: true,
        notifyOnAssignment: true,
        hapticFeedback: true,
        fontSize: 'medium',
        highContrast: false,
    },
    stats: {
        totalEvaluations: 0,
        evaluationsThisMonth: 0,
        averageEvaluationTime: 0,
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Estado inicial
            session: null,
            isAuthenticated: false,
            isLoading: false,
            _hasHydrated: false,
            users: {},
            userSalts: {},
            loginAttempts: [],
            accountLocks: {},
            lastActivityAt: null,

            // Hydration setter
            setHasHydrated: (state: boolean) => {
                set({ _hasHydrated: state });
            },

            // Login com PIN
            loginWithPin: async (pin: string, userId?: string) => {
                set({ isLoading: true });

                try {
                    const { users, userSalts, accountLocks, loginAttempts } = get();
                    const deviceId = getOrCreateDeviceId();

                    // Se não especificou userId, tentar encontrar pelo PIN
                    // (útil quando há poucos usuários)
                    let targetUserId = userId;
                    let targetUser: User | null = null;

                    if (targetUserId) {
                        targetUser = users[targetUserId] || null;
                    } else {
                        // Buscar usuário que corresponda ao PIN
                        for (const [id, user] of Object.entries(users)) {
                            const salt = userSalts[id];
                            if (salt && await verifyPin(pin, user.pinHash, salt)) {
                                targetUser = user;
                                targetUserId = id;
                                break;
                            }
                        }
                    }

                    // Se não encontrou usuário
                    if (!targetUser || !targetUserId) {
                        const attempt: LoginAttempt = {
                            timestamp: new Date(),
                            identifier: 'unknown',
                            success: false,
                            deviceId,
                            failureReason: 'invalid_pin',
                        };

                        set({
                            isLoading: false,
                            loginAttempts: [...loginAttempts, attempt],
                        });

                        return {
                            success: false,
                            error: {
                                code: 'invalid_credentials',
                                message: 'PIN inválido',
                            },
                        };
                    }

                    // Verificar se conta está bloqueada
                    const lock = accountLocks[targetUserId];
                    if (lock && new Date() < new Date(lock.unlocksAt)) {
                        set({ isLoading: false });
                        return {
                            success: false,
                            error: {
                                code: 'account_locked',
                                message: `Conta bloqueada. Tente novamente em ${Math.ceil((new Date(lock.unlocksAt).getTime() - Date.now()) / 60000)} minutos`,
                                lockedUntil: new Date(lock.unlocksAt),
                            },
                        };
                    }

                    // Verificar se usuário está ativo
                    if (targetUser.status !== 'active') {
                        set({ isLoading: false });
                        return {
                            success: false,
                            error: {
                                code: 'account_inactive',
                                message: 'Conta inativa. Entre em contato com o administrador',
                            },
                        };
                    }

                    // Verificar PIN
                    const salt = userSalts[targetUserId];
                    const isValidPin = await verifyPin(pin, targetUser.pinHash, salt);

                    if (!isValidPin) {
                        // Registrar tentativa falha
                        const recentAttempts = loginAttempts.filter(
                            a => a.userId === targetUserId &&
                                !a.success &&
                                Date.now() - new Date(a.timestamp).getTime() < LOCKOUT_DURATION_MINUTES * 60 * 1000
                        );

                        const newAttemptCount = recentAttempts.length + 1;

                        const attempt: LoginAttempt = {
                            timestamp: new Date(),
                            userId: targetUserId,
                            identifier: targetUser.email,
                            success: false,
                            deviceId,
                            failureReason: 'invalid_pin',
                        };

                        // Verificar se deve bloquear
                        if (newAttemptCount >= MAX_LOGIN_ATTEMPTS) {
                            const newLock: AccountLock = {
                                userId: targetUserId,
                                lockedAt: new Date(),
                                unlocksAt: new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000),
                                reason: 'too_many_attempts',
                                attemptCount: newAttemptCount,
                            };

                            set({
                                isLoading: false,
                                loginAttempts: [...loginAttempts, attempt],
                                accountLocks: { ...accountLocks, [targetUserId]: newLock },
                            });

                            return {
                                success: false,
                                error: {
                                    code: 'account_locked',
                                    message: `Muitas tentativas incorretas. Conta bloqueada por ${LOCKOUT_DURATION_MINUTES} minutos`,
                                    lockedUntil: newLock.unlocksAt,
                                },
                                remainingAttempts: 0,
                            };
                        }

                        set({
                            isLoading: false,
                            loginAttempts: [...loginAttempts, attempt],
                        });

                        return {
                            success: false,
                            error: {
                                code: 'invalid_credentials',
                                message: 'PIN incorreto',
                            },
                            remainingAttempts: MAX_LOGIN_ATTEMPTS - newAttemptCount,
                        };
                    }

                    // Login bem-sucedido!
                    const sessionToken = generateSessionToken();
                    const now = new Date();

                    const session: AuthSession = {
                        userId: targetUserId,
                        user: targetUser,
                        token: sessionToken,
                        expiresAt: new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000),
                        createdAt: now,
                        deviceId,
                        isOfflineSession: !navigator.onLine,
                    };

                    const attempt: LoginAttempt = {
                        timestamp: now,
                        userId: targetUserId,
                        identifier: targetUser.email,
                        success: true,
                        deviceId,
                    };

                    // Atualizar último login do usuário
                    const updatedUser: User = {
                        ...targetUser,
                        lastLoginAt: now,
                    };

                    // Limpar bloqueio se existir
                    const { [targetUserId]: _removedLock, ...remainingLocks } = accountLocks;

                    set({
                        session,
                        isAuthenticated: true,
                        isLoading: false,
                        lastActivityAt: now,
                        loginAttempts: [...loginAttempts, attempt],
                        accountLocks: remainingLocks,
                        users: { ...get().users, [targetUserId]: updatedUser },
                    });

                    return { success: true, session };

                } catch (error) {
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: {
                            code: 'network_error',
                            message: 'Erro ao processar login. Tente novamente.',
                        },
                    };
                }
            },

            // Login com email/senha (para admins)
            loginWithEmail: async (email: string, password: string) => {
                // Similar ao loginWithPin, mas usando senha
                // Implementação simplificada para MVP
                set({ isLoading: true });

                const { users } = get();
                const user = Object.values(users).find(u => u.email === email);

                if (!user || !user.passwordHash) {
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: {
                            code: 'invalid_credentials',
                            message: 'Email ou senha inválidos',
                        },
                    };
                }

                // Para MVP, usar PIN como senha também
                // Em produção, implementar hash de senha separado
                return get().loginWithPin(password, user.id);
            },

            // Logout
            logout: () => {
                set({
                    session: null,
                    isAuthenticated: false,
                    lastActivityAt: null,
                });
            },

            // Atualizar sessão
            refreshSession: () => {
                const { session } = get();
                if (!session) return;

                const now = new Date();
                set({
                    session: {
                        ...session,
                        expiresAt: new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000),
                    },
                    lastActivityAt: now,
                });
            },

            // Criar usuário
            createUser: async (data: CreateUserData, creatorId: string) => {
                const { users, userSalts } = get();

                // Verificar se email já existe
                if (Object.values(users).some(u => u.email === data.email)) {
                    throw new Error('Email já cadastrado');
                }

                // Verificar se CPF já existe
                if (Object.values(users).some(u => u.cpf === data.cpf)) {
                    throw new Error('CPF já cadastrado');
                }

                // Hash do PIN
                const { hash: pinHash, salt } = await hashPin(data.initialPin);

                const userId = uuidv4();
                const now = new Date();

                const newUser: User = {
                    id: userId,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    cpf: data.cpf,
                    pinHash,
                    role: data.role,
                    status: 'active',
                    registrationNumber: data.registrationNumber,
                    specialization: data.specialization,
                    createdAt: now,
                    updatedAt: now,
                    createdBy: creatorId,
                    preferences: {
                        autoLogoutMinutes: 30,
                        keepLoggedIn: false,
                        notifyOnSync: true,
                        notifyOnAssignment: true,
                        hapticFeedback: true,
                        fontSize: 'medium',
                        highContrast: false,
                    },
                    stats: {
                        totalEvaluations: 0,
                        evaluationsThisMonth: 0,
                        averageEvaluationTime: 0,
                    },
                };

                set({
                    users: { ...users, [userId]: newUser },
                    userSalts: { ...userSalts, [userId]: salt },
                });

                return newUser;
            },

            // Atualizar usuário
            updateUser: async (userId: string, data: UpdateUserData) => {
                const { users, session } = get();
                const user = users[userId];

                if (!user) {
                    throw new Error('Usuário não encontrado');
                }

                const updatedUser: User = {
                    ...user,
                    ...data,
                    preferences: data.preferences
                        ? { ...user.preferences, ...data.preferences }
                        : user.preferences,
                    updatedAt: new Date(),
                };

                // Se atualizou o usuário da sessão atual, atualizar sessão também
                const updatedSession = session?.userId === userId
                    ? { ...session, user: updatedUser }
                    : session;

                set({
                    users: { ...users, [userId]: updatedUser },
                    session: updatedSession,
                });

                return updatedUser;
            },

            // Deletar usuário (soft delete)
            deleteUser: async (userId: string) => {
                const { users } = get();
                const user = users[userId];

                if (!user) {
                    throw new Error('Usuário não encontrado');
                }

                // Não deletar admins
                if (user.role === 'admin') {
                    throw new Error('Não é possível deletar administradores');
                }

                const updatedUser: User = {
                    ...user,
                    status: 'inactive',
                    updatedAt: new Date(),
                };

                set({
                    users: { ...users, [userId]: updatedUser },
                });
            },

            // Alterar PIN
            changePin: async (userId: string, currentPin: string, newPin: string) => {
                const { users, userSalts } = get();
                const user = users[userId];
                const salt = userSalts[userId];

                if (!user || !salt) {
                    throw new Error('Usuário não encontrado');
                }

                // Verificar PIN atual
                const isValid = await verifyPin(currentPin, user.pinHash, salt);
                if (!isValid) {
                    return false;
                }

                // Gerar novo hash
                const { hash: newPinHash, salt: newSalt } = await hashPin(newPin);

                const updatedUser: User = {
                    ...user,
                    pinHash: newPinHash,
                    updatedAt: new Date(),
                };

                set({
                    users: { ...users, [userId]: updatedUser },
                    userSalts: { ...userSalts, [userId]: newSalt },
                });

                return true;
            },

            // Reset de PIN (admin)
            resetPin: async (userId: string, newPin: string) => {
                const { users, userSalts, session } = get();

                // Verificar se quem está resetando é admin
                if (session?.user.role !== 'admin') {
                    throw new Error('Apenas administradores podem resetar PINs');
                }

                const user = users[userId];
                if (!user) {
                    throw new Error('Usuário não encontrado');
                }

                const { hash: newPinHash, salt: newSalt } = await hashPin(newPin);

                const updatedUser: User = {
                    ...user,
                    pinHash: newPinHash,
                    updatedAt: new Date(),
                };

                set({
                    users: { ...users, [userId]: updatedUser },
                    userSalts: { ...userSalts, [userId]: newSalt },
                });

                return true;
            },

            // Verificar sessão
            checkSession: () => {
                const { session, lastActivityAt } = get();

                if (!session) return false;

                // Verificar expiração
                if (new Date() > new Date(session.expiresAt)) {
                    get().logout();
                    return false;
                }

                // Verificar inatividade
                if (lastActivityAt) {
                    const inactiveMinutes = (Date.now() - new Date(lastActivityAt).getTime()) / 60000;
                    const timeout = session.user.preferences.autoLogoutMinutes;

                    if (timeout > 0 && inactiveMinutes > timeout) {
                        get().logout();
                        return false;
                    }
                }

                return true;
            },

            // Obter permissões
            getPermissions: () => {
                const { session } = get();
                if (!session) return null;
                return ROLE_PERMISSIONS[session.user.role];
            },

            // Verificar permissão específica
            hasPermission: (permission: keyof Permissions) => {
                const permissions = get().getPermissions();
                return permissions ? permissions[permission] : false;
            },

            // Verificar bloqueio de conta
            isAccountLocked: (userId: string) => {
                const { accountLocks } = get();
                const lock = accountLocks[userId];

                if (!lock) return null;
                if (new Date() > new Date(lock.unlocksAt)) return null;

                return lock;
            },

            // Getters
            getCurrentUser: () => {
                const { session } = get();
                return session?.user || null;
            },

            getUserById: (id: string) => {
                return get().users[id] || null;
            },

            getAllUsers: () => {
                return Object.values(get().users);
            },

            getUsersByRole: (role: UserRole) => {
                return Object.values(get().users).filter(u => u.role === role);
            },

            // Registrar atividade
            recordActivity: () => {
                set({ lastActivityAt: new Date() });
            },

            // Verificar inatividade
            checkInactivity: () => {
                const { session, lastActivityAt } = get();

                if (!session || !lastActivityAt) return false;

                const inactiveMinutes = (Date.now() - new Date(lastActivityAt).getTime()) / 60000;
                const timeout = session.user.preferences.autoLogoutMinutes;

                return timeout > 0 && inactiveMinutes > timeout;
            },
        }),
        {
            name: 'maos-amigas-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                users: state.users,
                userSalts: state.userSalts,
                session: state.session,
                isAuthenticated: state.isAuthenticated,
                accountLocks: state.accountLocks,
            }),
            onRehydrateStorage: () => (state) => {
                // Callback chamado após hidratação
                if (state) {
                    // Marcar como hidratado
                    state.setHasHydrated(true);

                    // Validar sessão após hidratação
                    if (state.session) {
                        const now = new Date();
                        const expiresAt = new Date(state.session.expiresAt);

                        // Se a sessão expirou, fazer logout
                        if (now > expiresAt) {
                            useAuthStore.setState({
                                session: null,
                                isAuthenticated: false,
                                _hasHydrated: true,
                            });
                        } else {
                            // Sessão válida, garantir isAuthenticated = true
                            useAuthStore.setState({
                                isAuthenticated: true,
                                _hasHydrated: true,
                            });
                        }
                    } else {
                        useAuthStore.setState({ _hasHydrated: true });
                    }
                }
            },
        }
    )
);

// Inicializar admin padrão se não existir
export async function initializeDefaultAdmin() {
    const { users, userSalts } = useAuthStore.getState();

    if (Object.keys(users).length === 0) {
        // Criar admin com PIN padrão 102030 (deve ser alterado no primeiro acesso)
        const { hash: pinHash, salt } = await hashPin('102030');

        const adminUser: User = {
            ...DEFAULT_ADMIN,
            pinHash,
        };

        useAuthStore.setState({
            users: { [DEFAULT_ADMIN.id]: adminUser },
            userSalts: { [DEFAULT_ADMIN.id]: salt },
        });

        console.log('Admin padrão criado. PIN inicial: 102030');
    }
}
